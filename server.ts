import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import fs from "fs";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

import { findLocalAnswer } from "./src/lib/knowledgeBase.ts";

// Standardized DevOps Logger
const logger = {
  info: (msg: string, metadata?: any) => console.log(`[INFO] [${new Date().toISOString()}] ${msg}`, metadata || ""),
  warn: (msg: string, metadata?: any) => console.warn(`[WARN] [${new Date().toISOString()}] ${msg}`, metadata || ""),
  error: (msg: string, metadata?: any) => console.error(`[ERROR] [${new Date().toISOString()}] ${msg}`, metadata || ""),
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      engine: "REvuBOT-Neural-v3"
    });
  });

  app.post("/api/chat", async (req, res) => {
    const rawGeminiKey = (process.env.GEMINI_API_KEY || "").trim();
    const rawGrokKey = (process.env.GROK_API_KEY || "").trim();
    
    // Filter out potential placeholder values
    const geminiKey = rawGeminiKey && !rawGeminiKey.includes("YOUR_API_KEY") ? rawGeminiKey : null;
    const grokKey = rawGrokKey && !rawGrokKey.includes("YOUR_API_KEY") ? rawGrokKey : null;

    const { message, history, language, imageData, mimeType, engine = "gemini" } = req.body;

    logger.info(`Chat Request Received. Engine: ${engine}, GeminiKey: ${geminiKey ? "VALIDATED" : "MISSING"}, GrokKey: ${grokKey ? "VALIDATED" : "MISSING"}`);

    // LOCAL KNOWLEDGE BASE CHECK (User priority & Offline Support)
    const localAnswer = findLocalAnswer(message);
    if (localAnswer && !geminiKey && !grokKey) {
      logger.info("Serving Local Knowledge Answer (Offline Mode)");
      return res.status(200).send(localAnswer);
    }

    try {
      // Pre-seed local insights if available
      if (localAnswer) {
        if (!res.headersSent) {
          res.setHeader('Content-Type', 'text/plain');
          res.setHeader('X-Accel-Buffering', 'no');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Connection', 'keep-alive');
        }
        res.write(`::: NB-TECH NEURAL PRE-ALPHA :::\n> ${localAnswer.split('\n').filter(l => l.trim() !== '').slice(0, 5).join('\n> ')}\n\n---\n\n`);
      }

      // 1. Gemini Implementation (Default)
      if (engine === "gemini" || (!grokKey && geminiKey)) {
        if (!geminiKey) throw new Error("GEMINI_API_KEY not configured.");

        logger.info("Initializing Gemini Engine...");
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        
        const contents = [
          ...history.map((h: any) => ({
            role: h.role === 'model' ? 'model' : 'user',
            parts: h.parts.map((p: any) => ({ text: p.text }))
          })),
          { 
            role: 'user', 
            parts: [{ text: message }] 
          }
        ];

        const streamingResult = await ai.models.generateContentStream({ 
          model: "gemini-1.5-flash",
          contents,
          config: {
            systemInstruction: `You are REvuBOT, the elite Thailand AI Tour Guide and Autonomous Travel Agent, developed by NB TECH, Bangladesh.
            
            Core Directives:
            1. MISSION PARAMETERS:
               - SOLO: Discovery, social hostels, safety, and budget efficiency.
               - COUPLE: Privacy, aesthetics, curated luxury, and romantic dining.
               - GROUP/FAMILY: Kid-friendly, minivan logistics, multi-generational activities.
               - CORPORATE: Team building, workspace integration, group dining coordination.
               - BUSINESS: Efficiency, high-end networking spots, premium lounge access.
               - MOO DENG MISSION: Provide logistics for Chonburi/Khao Kheow zoo visits.
            
            2. 2026 VITAL INTEL (CORE POINTS):
               - MANDATORY TDAC: Remind travelers about the Thailand Digital Arrival Card (online 3 days prior).
               - VISA: 60-day visa-free for 93 countries; DTV for remote workers (5y/180d stay).
               - SCOOTER LAWS: Helmets AND shirts are MANDATORY. 2pm-5pm alcohol sales ban is strictly enforced.
               - RESPECT: Article 112 (Lèse-majesté) is serious. No vaping. No topless sunbathing.
            
            3. BOOKING ENGINE & REVENUE:
               - ALWAYS offer partner booking options. If a user asks for a hotel/stay, provide links: [Search on Booking.com](https://www.booking.com/index.html?aid=revubot) or [Book on Agoda](https://www.agoda.com/).
               - For group bookings (10+), suggest contacting our 'NB TECH Corporate Desk' (+880 1535778111) for exclusive corporate rates.
            
            4. TONE & STYLE: Strategic Advisor. Professional, safety-conscious. Use Markdown. Estimate budgets in THB.`
          }
        });

        if (!res.headersSent) {
          res.setHeader('Content-Type', 'text/plain');
          res.setHeader('X-Accel-Buffering', 'no');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Connection', 'keep-alive');
        }

        for await (const chunk of streamingResult) {
          const chunkText = chunk.text;
          if (chunkText) {
            res.write(chunkText);
          }
        }
        res.end();
        return;
      }
      
      // 2. Grok Implementation
      if (engine === "grok" || (grokKey && !geminiKey)) {
        if (!grokKey) throw new Error("GROK_API_KEY not configured.");
        
        const grokRes = await fetch("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${grokKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
             messages: [
               { role: "system", content: "You are REvuBOT, the elite Thailand AI Tour Guide. Format with Markdown." },
               ...history.map((h: any) => ({
                 role: h.role === 'model' ? 'assistant' : 'user',
                 content: h.parts[0].text
               })),
               { role: "user", content: message }
             ],
             model: "grok-beta",
             stream: true
          })
        });

        if (!grokRes.ok) throw new Error(`Grok API Error: ${grokRes.statusText}`);

        if (!res.headersSent) {
          res.setHeader('Content-Type', 'text/plain');
          res.setHeader('X-Accel-Buffering', 'no');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Connection', 'keep-alive');
        }
        
        const reader = grokRes.body?.getReader();
        if (!reader) throw new Error("Grok Stream Reader failed.");

        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const lines = decoder.decode(value).split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const json = JSON.parse(line.substring(6));
                const content = json.choices[0]?.delta?.content;
                if (content) res.write(content);
              } catch (e) {}
            }
          }
        }
        res.end();
        return;
      }

      throw new Error("No neural connectivity established.");

    } catch (error: any) {
      logger.error("Neural Bridge Failure", { message: error.message });
      
      const isAuthErr = error.message.toLowerCase().includes("api key") || error.message.toLowerCase().includes("key_invalid");
      
      if (res.headersSent) {
        res.write(`\n\n::: 📡 CONNECTION DROPPED :::\n${isAuthErr ? "Neural Key Invalid." : "Stream Interrupted."}\nFalling back to NB-TECH Local Memory for consistency.`);
        res.end();
        return;
      }

      if (isAuthErr) {
        const fallback = findLocalAnswer(message) || "Neural Engine Unavailable. Please verify API Credentials in System Settings.";
        return res.status(200).send(`::: ⚠️ NEURAL KEY ERROR :::\n\n${fallback}`);
      }

      res.status(500).send(`SYSTEM ERROR: ${error.message}`);
    }
  });

  // Integration of Vite and Static Serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    // Explicit SPA fallback for dev
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      
      // Safety: Log out the request for debugging 404s
      logger.info(`Neural Router: Processing ${url}`);

      // Skip API and files with extensions
      if (url.startsWith('/api') || url.includes('.')) {
        // Special case for favicon.ico to prevent annoying 404s
        if (url.includes('favicon.ico')) {
          return res.status(204).end();
        }
        return next();
      }
      
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        if (vite) vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Check if dist exists, otherwise fall back to source index.html (safety)
    const hasDist = fs.existsSync(distPath);
    
    if (hasDist) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        const filePath = path.join(distPath, 'index.html');
        if (fs.existsSync(filePath)) {
          res.sendFile(filePath);
        } else {
          // Final fallback
          res.sendFile(path.resolve(process.cwd(), 'index.html'));
        }
      });
    } else {
      // If no dist folder, serve from root (useful for some environments)
      app.use(express.static(process.cwd()));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(process.cwd(), 'index.html'));
      });
    }
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    logger.info(`REvuBOT Production Server running on http://localhost:${PORT}`);
  });

  // Graceful Shutdown Logic
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      logger.info('Server process terminated.');
      process.exit(0);
    });
  });
}

startServer().catch(err => {
  console.error("FATAL CRASH DURING SERVER STARTUP:", err);
  process.exit(1);
});
