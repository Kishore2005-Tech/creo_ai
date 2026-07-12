import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for text generation stream
  app.post("/api/generate", async (req, res) => {
    const { contentType, topic, tone, length } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    // Prepare system instructions and prompt based on types
    const systemInstruction = `You are Creo, a professional AI Content Creator. You write polished, ready-to-use copy that matches the requested Content Type, Tone, and Length.
CRITICAL FORMAT RULES:
- Instagram Caption: write natural line breaks, end with 3-5 relevant hashtags.
- Twitter/X Thread: write numbered tweets (e.g. 1/, 2/, 3/...), each tweet MUST be strictly under 280 characters.
- LinkedIn Post: professional but personable, use line breaks, end with max 3 hashtags.
- YouTube Script: hook in the first 2 lines, separate with [INTRO], [MAIN CONTENT], [OUTRO] markers.
- Blog Post: start with an engaging Title, followed by an Introduction, 2-4 Subheadings, and a Conclusion.
- Product Description: lead with a key benefit, followed by 3-5 bulleted features, and a clear call to action.
- Email: start with a "Subject: [Engaging Subject Line]" line first, followed by the email body.

CRITICAL CONTENT RULES:
- NEVER fabricate specific facts, stats, or quotes not provided in the user's topic.
- Output ONLY the requested content directly. Do not include any meta-announcements, preambles, intros like "Here is your caption:", or post-scripts. Start writing the actual content immediately.
- Adhere strictly to the requested tone: ${tone}.
- Adhere strictly to the requested length: ${length} (Short ~50-150 words, Medium ~150-400 words, Long ~400-800 words).`;

    const prompt = `Generate a ${contentType} on the topic/idea: "${topic}".
Tone: ${tone}
Length: ${length}`;

    // Lazy load and initialize Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured in the environment. Please add it in Settings > Secrets." });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Set headers for SSE streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }
      res.write("data: [DONE]\n\n");
      res.end();
    } catch (error: any) {
      console.error("Gemini stream error:", error);
      // Handle rate limits or other API errors
      let errMsg = "An error occurred during content generation.";
      if (error.status === 429 || error.message?.includes("429") || error.message?.includes("Quota")) {
        errMsg = "We've hit a rate limit. Please try again in a few seconds.";
      } else if (error.message) {
        errMsg = error.message;
      }
      
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: errMsg })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: errMsg });
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
