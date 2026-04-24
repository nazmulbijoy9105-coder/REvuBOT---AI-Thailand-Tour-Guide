import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

import { findLocalAnswer } from "./src/lib/knowledgeBase";

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
      // 1. Gemini Implementation (Default)
      if (engine === "gemini" || (!grokKey && geminiKey)) {
        if (!geminiKey) throw new Error("GEMINI_API_KEY not configured.");

        logger.info("Initializing Gemini Neural Engine...");
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        
        const contents = [
          ...history.map((h: any) => ({
            role: h.role === 'model' ? 'model' : 'user',
            parts: h.parts.map((p: any) => ({ text: p.text }))
          })),
          { 
            role: 'user', 
            parts: [
              { text: message },
              ...(imageData ? [{ inlineData: { data: imageData, mimeType } }] : [])
            ] 
          }
        ];

        const streamingResult = await ai.models.generateContentStream({ 
          model: "gemini-1.5-flash",
          contents,
          config: {
            systemInstruction: `You are REvuBOT, the elite Thailand AI Tour Guide and Autonomous Travel Agent.
            
            Core Directives:
            1. SPECIALIZATION: You provide structured, custom-made tour plans for:
               - SOLO: Budget/Safety-focused, high social discovery.
               - COUPLE: Romantic, luxury, private and intimate experiences.
               - GROUP/FAMILY: Kid-friendly, minivan logistics, multi-generational activities.
               - CORPORATE: Team building, workspace integration, group dining coordination.
               - BUSINESS: Efficiency, high-end networking spots, premium lounge access.
            2. LANGUAGE: Support English, Thai, Hindi, Sinhala, and BANGLA.
            3. AGENT KPI:
               - SMART PLANNING: Generate 1-14 day itineraries with exact THB budget estimates.
               - SCAM ADVISORY: Warn about "Grand Palace Closed", "Fast Meters", and Jet Ski damage scams.
               - PROHIBITED ACTIONS: Emphasize penalties for Vaping (30k THB fine) and Lèse-majesté laws.
            4. TONE: Professional, "Agent-like", elite, and safety-conscious.
            5. FORMATTING: Use clean Markdown. Provide Booking-Ready data (Destination, Transport, Budget).`
          }
        });
        
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('X-Accel-Buffering', 'no'); // Disable Nginx buffering
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        
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

        logger.info("Initializing Grok Neural Link...");
        
        const grokRes = await fetch("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${grokKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
             messages: [
               { 
                 role: "system", 
                 content: `You are REvuBOT, the elite Thailand AI Tour Guide. Current user language preference: ${language}.
                 Expertise: Hotels, transport, Thai culture, and safety.
                 Tone: Professional, high-intelligence. Format with Markdown.` 
               },
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

        if (!grokRes.ok) {
          const err = await grokRes.json();
          throw new Error(`Grok API Error: ${JSON.stringify(err)}`);
        }

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('X-Accel-Buffering', 'no');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        
        const reader = grokRes.body?.getReader();
        if (!reader) throw new Error("Grok Stream Reader failed.");

        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          
          for (const line of lines) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const json = JSON.parse(line.substring(6));
                const content = json.choices[0].delta.content;
                if (content) res.write(content);
              } catch (e) {
                // Ignore partial JSON
              }
            }
          }
        }
        res.end();
        return;
      }

      throw new Error("No neural engine available.");

    } catch (error: any) {
      logger.error("Chat Engine Critical Error", { message: error.message, stack: error.stack });
      
      let clientError = "Internal neural processing error";
      let statusCode = 500;

      const errorMsg = String(error.message || "").toLowerCase();
      
      if (errorMsg.includes("api key not valid") || errorMsg.includes("api_key_invalid") || errorMsg.includes("invalid api key")) {
        clientError = "INVALID API KEY: The Gemini API Key provided is rejected by Google. Please check your AI Studio Settings and ensure GEMINI_API_KEY is correct.";
        statusCode = 401;

        // Try to provide a local answer instead of just returning an error if headers haven't been sent
        const offlineAnswer = findLocalAnswer(message);
        if (offlineAnswer && !res.headersSent) {
           logger.info("Serving Local Knowledge Answer as Fallback due to API Error");
           return res.status(200).send(offlineAnswer);
        }
      } else if (errorMsg.includes("quota") || errorMsg.includes("limit") || errorMsg.includes("429")) {
        clientError = "BANDS SATURATED: Neural quota exceeded. (Google API Quota reached)";
        statusCode = 429;
      } else if (errorMsg.includes("safety") || errorMsg.includes("blocked")) {
        clientError = "PROTOCOL VIOLATION: Request blocked by safety filters.";
        statusCode = 400;
      }

      if (res.headersSent) {
        logger.warn("Headers already sent, cannot send JSON error. Writing error suffix to stream.");
        res.write(`\n\n[NEURAL ERROR: ${clientError}]`);
        res.end();
      } else {
        res.status(statusCode).json({ 
          error: clientError,
          requestId: Math.random().toString(36).substring(7)
        });
      }
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
        let template = await (await import('fs')).readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
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
    const fs = await import('fs');
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

startServer();
