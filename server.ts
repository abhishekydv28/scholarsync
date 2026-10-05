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

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Initialize GoogleGenAI server-side
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Endpoint: Student Life AI Chatbot (PlanZo Coach / Sarthi AI)
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, attachment, context } = req.body;
    const userMessage = (messages?.[messages.length - 1]?.content || '').trim();

    if (!userMessage && !attachment?.data) {
      return res.status(400).json({ error: 'Message or attachment is required' });
    }

    const systemInstruction = `You are Sarthi, an expert, empathetic, and exceptionally practical senior B.Tech mentor & academic copilot on PlanZo.
Student Academic Context:
- College / Institute: ${context?.college || 'B.Tech Engineering College'}
- Engineering Branch: ${context?.branch || 'Engineering'}
- Current Semester: Semester ${context?.semester || '1'}
- Current Schedule Load: ${context?.bandwidth || 'Balanced'}

Core Principles:
1. Provide direct, rigorous, and intelligent answers to whatever question the student asks—whether it is solving mathematics equations, explaining physics/chemistry concepts, writing and debugging code (C, C++, Python, Java, JS), breaking down syllabus topics, explaining engineering drawing principles, or advising on 75% attendance rules.
2. If an image or file is attached (e.g. photos of exam question papers, textbook pages, circuit diagrams, code screenshots, handwritten notes, or lab manuals), thoroughly analyze and explain it step-by-step.
3. Keep formatting clean, highly readable, and structured. Use clear section titles, clean numbered steps (1., 2., 3.), clean bullet points, and code blocks for code snippets. Avoid dumping messy raw symbols or excessive asterisks.
4. Never give robotic generic boilerplate or repeated pre-fed canned answers. Answer specifically and dynamically to the student's exact query.`;

    if (ai) {
      // Build conversation contents for Gemini
      const contents: any[] = [];

      // Include previous turns for context (up to last 6 messages)
      if (Array.isArray(messages) && messages.length > 1) {
        const history = messages.slice(-7, -1);
        for (const msg of history) {
          if (msg.content) {
            contents.push({
              role: msg.sender === 'user' ? 'user' : 'model',
              parts: [{ text: msg.content }],
            });
          }
        }
      }

      // Build the latest turn
      const currentParts: any[] = [];
      if (userMessage) {
        currentParts.push({ text: userMessage });
      }

      // Include image / document attachment if provided
      if (attachment && attachment.data && attachment.mimeType) {
        const cleanBase64 = attachment.data.includes(',')
          ? attachment.data.split(',')[1]
          : attachment.data;
        currentParts.push({
          inlineData: {
            mimeType: attachment.mimeType,
            data: cleanBase64,
          },
        });
      }

      // If user uploaded a file without text prompt
      if (currentParts.length === 1 && currentParts[0].inlineData) {
        currentParts.unshift({
          text: 'Please carefully analyze this uploaded image/document, identify what it contains, explain the concepts, and solve or answer any problems shown.',
        });
      }

      contents.push({
        role: 'user',
        parts: currentParts,
      });

      // Try modern models with fallback
      const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
      let generatedText = '';
      let lastError: any = null;

      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction,
            },
          });
          if (response && response.text) {
            generatedText = response.text;
            break;
          }
        } catch (err: any) {
          console.warn(`Model ${model} attempt error:`, err?.message?.slice(0, 120) || err);
          lastError = err;
        }
      }

      if (generatedText) {
        return res.json({ reply: generatedText });
      }

      console.error('All Gemini candidate models failed:', lastError);
      return res.status(503).json({
        error: 'AI service is temporarily busy. Please retry in a few seconds.',
      });
    }

    return res.status(500).json({ error: 'Gemini API is not configured on this server.' });
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
    console.log(`PlanZo server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
