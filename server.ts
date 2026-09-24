import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Endpoint: Student Life AI Chatbot (ScholarSync Coach)
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, context } = req.body;
    const userMessage = messages?.[messages.length - 1]?.content || '';

    const systemPrompt = `You are Senior Campus Mentor on ScholarSync, an experienced, friendly, and practical senior engineer advising a junior B.Tech student.
You understand the real chaos of Indian engineering colleges: 75% attendance criteria, surprise class tests, lab record submissions, HOD external viva intimidation, mass bunks, proxy drama, canteen cutting chai, and clearing exams by studying PYQs 1 night before.

User context:
- College / Branch: ${context?.college || 'B.Tech University'} / ${context?.branch || 'Computer Science & Engineering'}
- Current Semester: Semester ${context?.semester || '4'}
- Current Schedule Density: ${context?.bandwidth || 'Moderate'}
- Habits tracked: ${context?.habits?.join(', ') || 'DSA practice, Workout, Hydration'}

Key Tone & Voice Rules:
1. Speak warmly, respectfully, and realistically like a helpful senior (natural mix of practical English with relatable campus terms: "HOD", "PYQs", "viva", "internal marks", "cutting chai", "75% criteria", "backlog prevention").
2. No robotic AI jargon or generic platitudes.
3. If they ask about exam survival (72 hours / 1 night before), give direct 80/20 Pareto advice: focus on the repeating 10-mark questions from the last 3-4 years' university papers, practice standard diagrams (professors give marks for neat diagrams), and sleep at least 6 hours.
4. If they are stressed or burnt out, reassure them without patronizing, and suggest a realistic adjustment (e.g. swap a heavy subject with a chai break or postpone non-essential tasks).
5. Always keep advice actionable, structured, and calm.`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `${systemPrompt}\n\nStudent: ${userMessage}`,
      });
      return res.json({ reply: response.text });
    }

    // Heuristic fallback response when offline or key is pending
    let fallbackReply = `Here is a calm, balanced plan for your ${context?.branch || 'engineering'} coursework. Remember that deep work is most effective in 45-minute focused sprints with intentional 10-15 minute cognitive buffer zones.`;
    
    if (userMessage.toLowerCase().includes('72-hour') || userMessage.toLowerCase().includes('survival') || userMessage.toLowerCase().includes('exam')) {
      fallbackReply = `### 72-Hour High-Yield Exam Recovery Plan
Don't panic—three days is enough to master 70–80% of core marks using the 80/20 Pareto principle.

**Day 1: Foundation & High-Yield Units (Units 1 & 2)**
• Block 1 (9:00 AM - 11:30 AM): Core theory, definitions, and standard architectural diagrams.
• Buffer (11:30 AM - 12:00 PM): Digital detox walk and hydration.
• Block 2 (2:00 PM - 4:30 PM): Solved numericals and standard derivations.
• Evening Review (7:00 PM - 8:30 PM): Previous 3 years' university question papers (PYQs).

**Day 2: Application & High-Weightage Algorithms (Units 3 & 4)**
• Morning: Key algorithmic proofs or trace tables.
• Afternoon: Common recurring 10-mark questions from mid-term papers.
• Night: Sleep by 11:00 PM—sleep is vital for cognitive retrieval.

**Day 3: PYQ Simulation & Formula Consolidation**
• Solve 1 full model question paper under timed conditions.
• Formula sheet review; avoid learning completely new optional chapters.

*Tip: I've flagged a 20-minute Chill Block before your evening review to keep your mental bandwidth steady.*`;
    } else if (userMessage.toLowerCase().includes('burnout') || userMessage.toLowerCase().includes('tired') || userMessage.toLowerCase().includes('rest')) {
      fallbackReply = `### Rest & Recalibration Strategy
Engineering curricula often stack labs, theory, and deadlines all at once. Experiencing cognitive fatigue is a biological signal to restore, not a failure.

**Immediate Action:**
1. I have shifted your heavy study tasks for today into lighter review chunks tomorrow.
2. Your workout habit is postponed to Saturday when your timetable has zero lab sessions.
3. Take a 30-minute zero-screen reset: step outside, hydrate, and stretch.

Protecting your bandwidth today ensures higher peak focus tomorrow.`;
    }

    return res.json({ reply: fallbackReply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat response' });
  }
});

// Endpoint: Dynamic Schedule Recalibration
app.post('/api/recalibrate', async (req, res) => {
  try {
    const { items, missedItemTitle, reason } = req.body;

    if (ai) {
      const prompt = `You are a dynamic scheduler for an engineering student.
The student missed or wants to shift this task: "${missedItemTitle}" (Reason: ${reason || 'Fatigue / schedule clash'}).
Current remaining daily tasks: ${JSON.stringify(items)}

Task: Suggest how to quietly rearrange their schedule without guilt.
Return ONLY valid JSON matching this schema:
{
  "summary": "Short 1-sentence reassuring summary of the adjustment",
  "bufferAddedMinutes": 20,
  "suggestedAction": "Shifted to tomorrow morning and inserted a 20-min Chill Block"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    }

    return res.json({
      summary: `Schedule quietly adjusted. "${missedItemTitle || 'Missed task'}" shifted to a lighter time slot.`,
      bufferAddedMinutes: 20,
      suggestedAction: 'Inserted a restorative buffer zone and preserved your evening wind-down.',
    });
  } catch (error) {
    console.error('Recalibrate error:', error);
    res.json({
      summary: 'Schedule quietly adjusted. Buffer zone added.',
      bufferAddedMinutes: 20,
      suggestedAction: 'Postponed task to tomorrow morning.',
    });
  }
});

// Endpoint: Academic Syllabus Deep Dive & Study Chunk Planner
app.post('/api/syllabus-planner', async (req, res) => {
  try {
    const { subject, daysRemaining, currentLevel } = req.body;

    if (ai) {
      const prompt = `For the engineering subject "${subject}", generate an accelerated study roadmap for a student with ${daysRemaining || 7} days remaining who is currently at "${currentLevel || 'Beginner'}" level.
Return JSON with:
{
  "studyPlan": [
    { "phase": "string", "focusTopics": ["string"], "recommendedVideo": "string", "estimatedHours": 2 }
  ],
  "highYieldTip": "string"
}`;
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      return res.json(JSON.parse(response.text || '{}'));
    }

    return res.json({
      studyPlan: [
        {
          phase: 'Phase 1: Core Definitions & High-Yield Units',
          focusTopics: ['Module 1 Foundational Concepts', 'Standard Derivations & Diagrams'],
          recommendedVideo: `Neso Academy & Gate Smashers - ${subject} Playlist`,
          estimatedHours: 2,
        },
        {
          phase: 'Phase 2: Numerical Problems & Previous Year Questions',
          focusTopics: ['University PYQs (2022-2025)', 'Solved Examples from Standard Text'],
          recommendedVideo: `Abdul Bari / 3Blue1Brown - Intuitive Problem Solving`,
          estimatedHours: 2.5,
        },
        {
          phase: 'Phase 3: Formula Sheet & Mock Paper Review',
          focusTopics: ['Summary Cheat Sheet', '1 Timed Exam Paper Simulation'],
          recommendedVideo: `High-Yield Quick Revision Lecture`,
          estimatedHours: 1.5,
        },
      ],
      highYieldTip: `Focus on the 3 questions that appear consistently in the last 5 semester papers.`,
    });
  } catch (error) {
    console.error('Syllabus planner error:', error);
    res.status(500).json({ error: 'Failed to generate study plan' });
  }
});

// Vite Middleware integration for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ScholarSync server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
