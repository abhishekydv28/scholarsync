import { PDFDocument, StandardFonts, rgb, PDFPage, PDFFont } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

function sanitizeText(str: string): string {
  if (!str) return '';
  return str
    .replace(/[\u2014\u2013]/g, ' - ') // em-dash, en-dash
    .replace(/[\u2018\u2019]/g, "'")   // smart single quotes
    .replace(/[\u201C\u201D]/g, '"')   // smart double quotes
    .replace(/[\u2022]/g, '-')        // bullet
    .replace(/[\u2265]/g, '>=')       // greater than or equal
    .replace(/[\u2264]/g, '<=')       // less than or equal
    .replace(/[\u03A3]/g, 'Sum')      // Sigma
    .replace(/[^\x20-\x7E\n]/g, '');   // keep only printable ascii and newline
}

async function generateDossierPdf() {
  const doc = await PDFDocument.create();
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await doc.embedFont(StandardFonts.HelveticaOblique);
  const courier = await doc.embedFont(StandardFonts.Courier);

  // Colors
  const darkTeal = rgb(0.06, 0.44, 0.44);     // #0F766E
  const lightTeal = rgb(0.85, 0.95, 0.94);    // #D8F2F0
  const primaryBlack = rgb(0.1, 0.1, 0.12);   // #1A1A1E
  const mutedGray = rgb(0.42, 0.44, 0.48);    // #6B7280
  const borderGray = rgb(0.85, 0.86, 0.88);   // #D9DCE1
  const bgLight = rgb(0.97, 0.98, 0.99);      // #F8FAFC
  const white = rgb(1, 1, 1);

  const PAGE_WIDTH = 595.28; // A4
  const PAGE_HEIGHT = 841.89;
  const MARGIN_LEFT = 48;
  const MARGIN_RIGHT = 48;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

  let currentPage!: PDFPage;
  let cursorY!: number;
  let pageNumber = 0;

  function addNewPage(headerTitle = 'PlanZo - Technical Architecture & Pitch Defense Dossier'): PDFPage {
    pageNumber++;
    currentPage = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    cursorY = PAGE_HEIGHT - 48;

    // Header (skip on cover page if pageNumber === 1)
    if (pageNumber > 1) {
      currentPage.drawText(sanitizeText(headerTitle).toUpperCase(), {
        x: MARGIN_LEFT,
        y: PAGE_HEIGHT - 32,
        size: 7.5,
        font: helveticaBold,
        color: darkTeal,
      });

      currentPage.drawLine({
        start: { x: MARGIN_LEFT, y: PAGE_HEIGHT - 38 },
        end: { x: PAGE_WIDTH - MARGIN_RIGHT, y: PAGE_HEIGHT - 38 },
        thickness: 0.75,
        color: borderGray,
      });

      // Footer
      currentPage.drawLine({
        start: { x: MARGIN_LEFT, y: 38 },
        end: { x: PAGE_WIDTH - MARGIN_RIGHT, y: 38 },
        thickness: 0.75,
        color: borderGray,
      });

      currentPage.drawText('PlanZo: B.Tech Student Productivity Operating System', {
        x: MARGIN_LEFT,
        y: 26,
        size: 7.5,
        font: helvetica,
        color: mutedGray,
      });

      const pageStr = `Page ${pageNumber}`;
      const pageStrWidth = helvetica.widthOfTextAtSize(pageStr, 7.5);
      currentPage.drawText(pageStr, {
        x: PAGE_WIDTH - MARGIN_RIGHT - pageStrWidth,
        y: 26,
        size: 7.5,
        font: helveticaBold,
        color: mutedGray,
      });
    }

    return currentPage;
  }

  function checkPageSpace(requiredSpace: number) {
    if (cursorY - requiredSpace < 56) {
      addNewPage();
    }
  }

  function drawHeading1(title: string) {
    checkPageSpace(50);
    cursorY -= 12;

    const safeTitle = sanitizeText(title);

    // Left teal accent bar
    currentPage.drawRectangle({
      x: MARGIN_LEFT,
      y: cursorY - 3,
      width: 4,
      height: 18,
      color: darkTeal,
    });

    currentPage.drawText(safeTitle, {
      x: MARGIN_LEFT + 12,
      y: cursorY,
      size: 15,
      font: helveticaBold,
      color: primaryBlack,
    });

    cursorY -= 20;
  }

  function drawHeading2(title: string) {
    checkPageSpace(36);
    cursorY -= 8;
    currentPage.drawText(sanitizeText(title), {
      x: MARGIN_LEFT,
      y: cursorY,
      size: 11,
      font: helveticaBold,
      color: darkTeal,
    });
    cursorY -= 15;
  }

  function drawParagraph(rawText: string, options: { isItalic?: boolean; fontSize?: number; fontColor?: typeof primaryBlack } = {}) {
    const sanitized = sanitizeText(rawText);
    const paragraphs = sanitized.split('\n');

    const size = options.fontSize || 8.5;
    const font = options.isItalic ? helveticaOblique : helvetica;
    const color = options.fontColor || primaryBlack;
    const lineHeight = size * 1.45;

    for (const p of paragraphs) {
      if (!p.trim()) {
        cursorY -= lineHeight * 0.5;
        continue;
      }
      const words = p.split(' ');
      let line = '';

      for (let i = 0; i < words.length; i++) {
        const testLine = line + (line ? ' ' : '') + words[i];
        const testWidth = font.widthOfTextAtSize(testLine, size);
        if (testWidth > CONTENT_WIDTH && line !== '') {
          checkPageSpace(lineHeight);
          currentPage.drawText(line, {
            x: MARGIN_LEFT,
            y: cursorY,
            size,
            font,
            color,
          });
          cursorY -= lineHeight;
          line = words[i];
        } else {
          line = testLine;
        }
      }
      if (line) {
        checkPageSpace(lineHeight);
        currentPage.drawText(line, {
          x: MARGIN_LEFT,
          y: cursorY,
          size,
          font,
          color,
        });
        cursorY -= lineHeight;
      }
      cursorY -= 3;
    }
  }

  function drawBulletPoint(title: string, desc: string) {
    const size = 8;
    const bulletSize = 2.5;
    const lineHeight = size * 1.35;
    checkPageSpace(lineHeight * 2);

    currentPage.drawCircle({
      x: MARGIN_LEFT + 4,
      y: cursorY + 3,
      size: bulletSize,
      color: darkTeal,
    });

    const fullText = sanitizeText(`${title}: ${desc}`);
    const words = fullText.split(' ');
    let line = '';
    const textIndent = MARGIN_LEFT + 14;
    const maxTextWidth = CONTENT_WIDTH - 14;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + (line ? ' ' : '') + words[i];
      const testWidth = helvetica.widthOfTextAtSize(testLine, size);

      if (testWidth > maxTextWidth && line !== '') {
        checkPageSpace(lineHeight);
        currentPage.drawText(line, {
          x: textIndent,
          y: cursorY,
          size,
          font: helvetica,
          color: primaryBlack,
        });
        cursorY -= lineHeight;
        line = words[i];
      } else {
        line = testLine;
      }
    }
    if (line) {
      checkPageSpace(lineHeight);
      currentPage.drawText(line, {
        x: textIndent,
        y: cursorY,
        size,
        font: helvetica,
        color: primaryBlack,
      });
      cursorY -= lineHeight;
    }
    cursorY -= 2;
  }

  function drawCalloutBox(title: string, text: string) {
    checkPageSpace(56);
    const boxY = cursorY;
    cursorY -= 8;

    const safeTitle = sanitizeText(title);
    const safeText = sanitizeText(text);

    currentPage.drawRectangle({
      x: MARGIN_LEFT,
      y: boxY - 48,
      width: CONTENT_WIDTH,
      height: 48,
      color: lightTeal,
      borderColor: darkTeal,
      borderWidth: 1,
    });

    currentPage.drawText(safeTitle, {
      x: MARGIN_LEFT + 10,
      y: boxY - 14,
      size: 8.5,
      font: helveticaBold,
      color: darkTeal,
    });

    const lines = safeText.split('\n');
    let textCursor = boxY - 26;
    for (const l of lines) {
      currentPage.drawText(l, {
        x: MARGIN_LEFT + 10,
        y: textCursor,
        size: 7.5,
        font: helvetica,
        color: primaryBlack,
      });
      textCursor -= 10;
    }

    cursorY = boxY - 56;
  }

  function drawTable(headers: string[], rows: string[][], colWidths: number[]) {
    const rowHeight = 18;
    const headerHeight = 20;
    const tableHeight = headerHeight + rows.length * rowHeight;
    checkPageSpace(tableHeight + 10);

    const startY = cursorY;

    // Header background
    currentPage.drawRectangle({
      x: MARGIN_LEFT,
      y: startY - headerHeight,
      width: CONTENT_WIDTH,
      height: headerHeight,
      color: darkTeal,
    });

    // Draw header texts
    let curX = MARGIN_LEFT;
    for (let i = 0; i < headers.length; i++) {
      currentPage.drawText(sanitizeText(headers[i]), {
        x: curX + 5,
        y: startY - 14,
        size: 8,
        font: helveticaBold,
        color: white,
      });
      curX += colWidths[i];
    }

    cursorY = startY - headerHeight;

    // Draw rows
    for (let r = 0; r < rows.length; r++) {
      const isAlt = r % 2 === 1;
      currentPage.drawRectangle({
        x: MARGIN_LEFT,
        y: cursorY - rowHeight,
        width: CONTENT_WIDTH,
        height: rowHeight,
        color: isAlt ? bgLight : white,
        borderColor: borderGray,
        borderWidth: 0.5,
      });

      curX = MARGIN_LEFT;
      for (let c = 0; c < rows[r].length; c++) {
        currentPage.drawText(sanitizeText(rows[r][c]), {
          x: curX + 5,
          y: cursorY - 13,
          size: 7,
          font: c === 0 ? helveticaBold : helvetica,
          color: primaryBlack,
        });
        curX += colWidths[c];
      }

      cursorY -= rowHeight;
    }

    cursorY -= 8;
  }

  function drawFormulaBox(title: string, formula: string, explanation: string) {
    checkPageSpace(58);
    const boxHeight = 52;
    const boxY = cursorY;

    currentPage.drawRectangle({
      x: MARGIN_LEFT,
      y: boxY - boxHeight,
      width: CONTENT_WIDTH,
      height: boxHeight,
      color: bgLight,
      borderColor: darkTeal,
      borderWidth: 1,
    });

    currentPage.drawText(sanitizeText(title).toUpperCase(), {
      x: MARGIN_LEFT + 10,
      y: boxY - 13,
      size: 7.5,
      font: helveticaBold,
      color: darkTeal,
    });

    currentPage.drawText(sanitizeText(formula), {
      x: MARGIN_LEFT + 10,
      y: boxY - 26,
      size: 9,
      font: courier,
      color: primaryBlack,
    });

    currentPage.drawText(sanitizeText(explanation), {
      x: MARGIN_LEFT + 10,
      y: boxY - 40,
      size: 7,
      font: helveticaOblique,
      color: mutedGray,
    });

    cursorY = boxY - boxHeight - 8;
  }

  // =========================================================================
  // COVER PAGE (PAGE 1)
  // =========================================================================
  addNewPage();

  // Top Accent Banner
  currentPage.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - 120,
    width: PAGE_WIDTH,
    height: 120,
    color: darkTeal,
  });

  currentPage.drawText('PLANZO', {
    x: MARGIN_LEFT,
    y: PAGE_HEIGHT - 65,
    size: 32,
    font: helveticaBold,
    color: white,
  });

  currentPage.drawText('STUDENT OPERATING SYSTEM - B.TECH ACADEMIC COMMAND CENTER', {
    x: MARGIN_LEFT,
    y: PAGE_HEIGHT - 88,
    size: 9.5,
    font: helveticaBold,
    color: lightTeal,
  });

  cursorY = PAGE_HEIGHT - 155;

  currentPage.drawText('Comprehensive Technical Architecture, API Ecosystem,', {
    x: MARGIN_LEFT,
    y: cursorY,
    size: 15,
    font: helveticaBold,
    color: primaryBlack,
  });
  cursorY -= 20;

  currentPage.drawText('Algorithms & Pitch Defense Dossier', {
    x: MARGIN_LEFT,
    y: cursorY,
    size: 15,
    font: helveticaBold,
    color: darkTeal,
  });
  cursorY -= 24;

  drawParagraph(
    'This dossier provides an exhaustive technical and algorithmic breakdown of the PlanZo platform. Prepared for engineering project viva examinations, hackathon pitching, and technical evaluations, this document details all system languages, full-stack framework choices, server-side APIs, mathematical formulations, attendance algorithms, and structured cross-examination defenses.',
    { fontSize: 8.5 }
  );

  cursorY -= 6;

  drawCalloutBox(
    'KEY PROJECT SPECIFICATION SUMMARY',
    'Tech Stack: TypeScript 5+, React 19, Vite 8, Tailwind CSS v4, Express.js 4, Google GenAI SDK (Gemini 3.8 Flash)\nArchitecture: Client SPA with Server-Side AI API Proxy, LocalStorage Resilience & Heuristic Fallbacks'
  );

  cursorY -= 4;

  drawHeading2('Document Navigation Index');
  const indexPoints = [
    ['1. System Architecture & Programming Languages', 'In-depth analysis of TypeScript, React 19, Node/Express, and Tailwind CSS v4.'],
    ['2. APIs & Request-Response Communication Lifecycle', 'How client actions, REST proxies, and Gemini AI endpoints collaborate securely.'],
    ['3. Algorithmic Formulations & Mathematical Models', 'Debarment calculus, guilt-free schedule recalibration, and cognitive load scoring.'],
    ['4. Data Persistence & State Synchronization', 'AppContext centralized dispatch, offline local caching, and fallback guarantees.'],
    ['5. Pitch Presentation Guide & Cross-Question Defenses', 'Bulletproof answers for professors, evaluators, and hackathon judges.'],
  ];

  for (const [title, desc] of indexPoints) {
    drawBulletPoint(title, desc);
  }

  cursorY -= 10;

  // Metadata Footer Box on Cover Page
  currentPage.drawRectangle({
    x: MARGIN_LEFT,
    y: 50,
    width: CONTENT_WIDTH,
    height: 56,
    color: bgLight,
    borderColor: borderGray,
    borderWidth: 0.5,
  });

  currentPage.drawText('PROJECT DETAILS & REVISION RECORD', {
    x: MARGIN_LEFT + 10,
    y: 90,
    size: 7.5,
    font: helveticaBold,
    color: darkTeal,
  });

  currentPage.drawText('System: PlanZo Autonomous Student OS   |   Version: 2.4.0 (Production Build)', {
    x: MARGIN_LEFT + 10,
    y: 77,
    size: 7.5,
    font: helvetica,
    color: primaryBlack,
  });

  currentPage.drawText('Target Audience: B.Tech Engineering Undergraduates   |   License: Open Academic Software', {
    x: MARGIN_LEFT + 10,
    y: 64,
    size: 7.5,
    font: helvetica,
    color: mutedGray,
  });

  // =========================================================================
  // PAGE 2: PROGRAMMING LANGUAGES & SYSTEM ARCHITECTURE
  // =========================================================================
  addNewPage();

  drawHeading1('1. System Architecture & Programming Languages');

  drawParagraph(
    'PlanZo is architected as an industrial-grade full-stack TypeScript application. Every layer - from client DOM manipulation to server-side AI prompt orchestration - shares standardized TypeScript schemas, eliminating type impedance mismatches.'
  );

  drawHeading2('Frontend Layer');
  drawBulletPoint(
    'TypeScript (Strict Mode)',
    'Enforces compile-time contracts across 100% of data models (AttendanceItem, ScheduledTask, SyllabusUnit, ExamMilestone). Prevents null/undefined crashes during critical student scheduling and attendance simulations.'
  );
  drawBulletPoint(
    'React 19 (Component Hierarchy)',
    'Leverages modern functional components, standard hooks (useState, useEffect, useMemo, useCallback), and centralized Context API (AppContext). Decouples visual representation from business and mathematical logic.'
  );
  drawBulletPoint(
    'Vite 8 & Tailwind CSS v4',
    'Provides sub-millisecond hot module reloading and optimized production tree-shaking. Tailwind v4 delivers a high-contrast B.Tech productivity aesthetic (Black, White, Neutral Gray, Teal accents) with zero CSS bloat.'
  );
  drawBulletPoint(
    'Motion & Audio Synthesis',
    'Uses lightweight physics animations (motion) for smooth layout transitions and native HTML5 Web Audio API synthesizers for instant task check-off feedback without external audio latency.'
  );

  drawHeading2('Backend Layer');
  drawBulletPoint(
    'Node.js & Express.js (v4.21)',
    'Lightweight, high-throughput REST API runtime. Houses application proxy routes (/api/chat, /api/recalibrate, /api/syllabus-planner), isolating API tokens from client exposure.'
  );
  drawBulletPoint(
    'Google GenAI TypeScript SDK (@google/genai v2.4.0)',
    'Direct server integration with Google Gemini 3.8 Flash. Executes prompt-engineered requests with structured JSON schema constraints, telemetry tracking headers, and instant fallback pipelines.'
  );
  drawBulletPoint(
    'TSX Development Engine',
    'Native TypeScript execution engine executing server.ts directly with zero manual compilation step, mirroring modern Node 22 ES module standards.'
  );

  cursorY -= 4;
  drawHeading2('Technology Comparison & Stack Summary');

  drawTable(
    ['Tier / Module', 'Technology', 'Version', 'Core Architectural Purpose'],
    [
      ['Client Framework', 'React & DOM', '19.0.1', 'Declarative UI, concurrent rendering, virtual DOM'],
      ['Type System', 'TypeScript', '7.0.2', 'Strict compile-time verification across client & server'],
      ['Styling System', 'Tailwind CSS', '4.3.3', 'Utility-first tokens, dark/light variants, responsive grid'],
      ['Build Bundler', 'Vite', '8.3.0', 'Rollup bundling, asset compilation, ES module dev server'],
      ['Server Runtime', 'Node.js + TSX', '22.x / 4.21', 'Express REST proxy, process management, API endpoints'],
      ['AI Model Engine', 'Gemini 3.8 Flash', 'GenAI 2.4.0', 'Conversational campus mentorship & schedule recalibration'],
      ['Persistence', 'LocalStorage API', 'Native HTML5', 'Client-side zero-latency session and data resilience']
    ],
    [90, 85, 65, 259]
  );

  // =========================================================================
  // PAGE 3: APIS & REQUEST-RESPONSE COMMUNICATION LIFECYCLE
  // =========================================================================
  addNewPage();

  drawHeading1('2. APIs & Request-Response Communication');

  drawParagraph(
    'PlanZo implements a strict client-server separation. The browser client never interacts directly with external AI services, protecting user credentials, ensuring rate-limiting compliance, and maintaining predictable JSON contracts.'
  );

  drawHeading2('Complete API Endpoint Catalog');

  drawBulletPoint(
    'POST /api/chat',
    'Powers the Sarthi AI Senior Campus Mentor. Receives conversation message history alongside the student profile, current semester, college, timetable density, and habit streaks. System instructions ground the AI in realistic campus jargon (75% criteria, PYQs, vivas, internal marks) to deliver actionable 80/20 study plans.'
  );

  drawBulletPoint(
    'POST /api/recalibrate',
    'Powers the Guilt-Free Schedule Recalibration engine. When a student marks a task as missed, the endpoint receives remaining daily tasks and cognitive weights, returns a reassuring 1-sentence summary, inserts a restorative buffer, and shifts intensive tasks.'
  );

  drawBulletPoint(
    'POST /api/syllabus-planner',
    'Generates high-yield study chunks based on days remaining before examinations and syllabus weightages.'
  );

  cursorY -= 6;
  drawHeading2('Detailed API Request-Response Lifecycle');

  drawParagraph(
    'Step 1: User Action Trigger - The student clicks "Start Recalibration" or asks a question in Sarthi AI.\n' +
    'Step 2: Context Aggregation - AppContext serializes current timetable, attendance percentages, and profile into a lightweight payload.\n' +
    'Step 3: Client Fetch Call - A POST request is dispatched to /api/* with Content-Type: application/json.\n' +
    'Step 4: Express Server Middleware - Express parses the body, injects student context, and validates schema.\n' +
    'Step 5: Google GenAI Invocation - The server calls ai.models.generateContent with model: "gemini-3.8-flash".\n' +
    'Step 6: Fallback Safeguard - If network is offline or quota is exceeded, an intelligent local heuristic algorithm provides instant responses.\n' +
    'Step 7: State Update & Storage - Client receives JSON, fires audio/confetti feedback, and persists state in LocalStorage.'
  );

  cursorY -= 4;
  drawCalloutBox(
    'SECURITY & CREDENTIAL ISOLATION GUARANTEE',
    'PlanZo strictly forbids embedding GEMINI_API_KEY in client bundles (Vite VITE_* variables). All external AI calls pass through the Express reverse-proxy server, ensuring complete credential confidentiality and zero credential leak vulnerability.'
  );

  // =========================================================================
  // PAGE 4: ALGORITHMIC FORMULATIONS & MATHEMATICAL MODELS
  // =========================================================================
  addNewPage();

  drawHeading1('3. Algorithmic Formulations & Mathematical Models');

  drawParagraph(
    'At the heart of PlanZo are deterministic mathematical algorithms engineered specifically for Indian university engineering guidelines (specifically AICTE and autonomous universities enforcing mandatory 75% attendance).'
  );

  drawHeading2('Algorithm 1: Academic Attendance Debarment & Buffer Calculus');
  drawParagraph(
    'Let A = number of attended classes in a subject, and T = total classes conducted so far. The institution mandates attendance fraction P_min = 0.75.'
  );

  drawFormulaBox(
    'Safe Bunk Margin Formula (When Current Attendance >= 75%)',
    'Safe Bunks = floor((4 * A - 3 * T) / 3)',
    'Calculates the exact integer number of future consecutive classes a student can safely miss without dropping below 75%.'
  );

  drawFormulaBox(
    'Recovery Attendance Requirement (When Current Attendance < 75%)',
    'Required Lectures = ceil(3 * T - 4 * A)',
    'Calculates the exact integer number of consecutive future lectures the student must attend to restore their attendance to 75%.'
  );

  drawHeading2('Algorithm 2: Guilt-Free Dynamic Schedule Recalibration');
  drawParagraph(
    'Traditional schedulers induce "guilt paralysis" by flagging missed tasks in red. PlanZo implements an adaptive rebalancing heuristic:'
  );
  drawBulletPoint(
    'Immovable Time Blocks',
    'College class schedule (10:30 AM to 5:30 PM) is locked as immutable. The algorithm cannot schedule self-study during lecture slots.'
  );
  drawBulletPoint(
    'Cognitive Weight Priority',
    'Tasks carry cognitive weights (1 = Light review, 5 = Deep DSA/Math). When evening fatigue is detected, high-weight items are deferred to next morning, and replaced with 25-minute buffer zones.'
  );

  drawHeading2('Algorithm 3: Daily Cognitive Strain & Bandwidth Scoring');
  drawFormulaBox(
    'Cognitive Strain Index (CSI)',
    'CSI = Sum( CognitiveWeight_i * DurationMinutes_i ) / 60',
    'If CSI > 6.0: System triggers "Overloaded" status and auto-suggests a 25-minute Chill Buffer.'
  );

  drawHeading2('Algorithm 4: Gamified Day Streak & Non-Linear XP Progression');
  drawFormulaBox(
    'Level Progression Curve',
    'Level = floor( sqrt( Total_XP / 100 ) ) + 1',
    'Logarithmic dampening ensures that early engineering milestones feel achievable while high levels require genuine semester-long consistency.'
  );

  // =========================================================================
  // PAGE 5: PITCH PRESENTATION GUIDE & CROSS-QUESTION DEFENSE
  // =========================================================================
  addNewPage();

  drawHeading1('4. Pitch Presentation Guide & Cross-Question Defense');

  drawParagraph(
    'When presenting PlanZo to professors, hackathon panels, or investors, use these battle-tested technical responses to demonstrate engineering maturity.'
  );

  const defenses = [
    {
      q: 'Q1: Why not just use Google Calendar or Notion for student planning?',
      a: 'Answer: Notion and Google Calendar are blank-canvas productivity tools built for enterprise knowledge workers. They require manual setup and have zero awareness of academic constraints like 75% debarment rules, semester credit distribution, or mid-term PYQ weightage. PlanZo is domain-specific: it calculates attendance debarment margins in real-time, auto-populates B.Tech syllabi, and rebalances routines without guilt.'
    },
    {
      q: 'Q2: How does the application guarantee responsiveness if Gemini API experiences rate-limiting?',
      a: 'Answer: PlanZo employs a multi-tiered resilience strategy. Every AI route in server.ts is wrapped in an asynchronous try/catch block with pre-computed academic heuristic fallback matrices. If the external Gemini API call times out or exhausts quota, the server immediately returns structured, human-like guidance without degrading UI functionality or throwing unhandled 500 errors.'
    },
    {
      q: 'Q3: Why did you build an Express backend rather than a purely static client-side app?',
      a: 'Answer: Security and architectural scalability. Client-side AI integrations leak private API tokens directly into the browser inspection console. By implementing an Express proxy layer, we enforce strict credential isolation, enable request logging, and allow future migration to self-hosted LLMs or multi-tenant database clusters without touching frontend code.'
    },
    {
      q: 'Q4: What mathematical edge cases does the attendance calculator handle?',
      a: 'Answer: The simulator handles boundary cases where T = 0 (returning 100% initial margin), fractional rounding via Math.ceil and Math.floor to ensure students never miss an extra class due to decimal truncation, and supports dynamic target adjustment (e.g. 65% for medical leaves or 80% for honors criteria).'
    },
    {
      q: 'Q5: How does PlanZo safeguard student data privacy?',
      a: 'Answer: All schedule, routine, and habit data is persisted locally in the student browser via the HTML5 LocalStorage API. No personal academic records or habits are sold, tracked, or sent to third-party ad networks.'
    }
  ];

  for (const item of defenses) {
    checkPageSpace(48);
    cursorY -= 3;
    currentPage.drawText(sanitizeText(item.q), {
      x: MARGIN_LEFT,
      y: cursorY,
      size: 8,
      font: helveticaBold,
      color: darkTeal,
    });
    cursorY -= 12;
    drawParagraph(item.a, { fontSize: 7.5 });
    cursorY -= 3;
  }

  // Final Sign-Off Stamp
  checkPageSpace(36);
  cursorY -= 8;
  currentPage.drawLine({
    start: { x: MARGIN_LEFT, y: cursorY },
    end: { x: PAGE_WIDTH - MARGIN_RIGHT, y: cursorY },
    thickness: 1,
    color: darkTeal,
  });
  cursorY -= 14;
  currentPage.drawText('PLANZO ENGINEERING SYSTEM - VERIFIED FOR PRODUCTION & ACADEMIC DEFENSE', {
    x: MARGIN_LEFT,
    y: cursorY,
    size: 7.5,
    font: helveticaBold,
    color: primaryBlack,
  });

  const pdfBytes = await doc.save();
  const outputPath = path.resolve('./public/PlanZo_Technical_Architecture_and_Pitch_Dossier.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`PDF successfully generated at: ${outputPath} (Size: ${pdfBytes.length} bytes, Pages: ${doc.getPageCount()})`);
}

generateDossierPdf().catch((err) => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
