import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

// Standardized DevOps Logger
const logger = {
  info: (msg: string, metadata?: any) => console.log(`[INFO] [${new Date().toISOString()}] ${msg}`, metadata || ""),
  warn: (msg: string, metadata?: any) => console.warn(`[WARN] [${new Date().toISOString()}] ${msg}`, metadata || ""),
  error: (msg: string, metadata?: any) => console.error(`[ERROR] [${new Date().toISOString()}] ${msg}`, metadata || ""),
};

// Note: Environment variables like GEMINI_API_KEY are managed by AI Studio.
// Grok API Key can be added to Secrets and accessed via process.env.GROK_API_KEY.

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

  // Proxy for AI Chat to hide keys if necessary, or manage Grok integration
  app.post("/api/chat", async (req, res) => {
    const rawGeminiKey = (process.env.GEMINI_API_KEY || "").trim();
    const rawGrokKey = (process.env.GROK_API_KEY || "").trim();
    
    // Filter out potential placeholder values
    const geminiKey = rawGeminiKey && !rawGeminiKey.includes("YOUR_API_KEY") ? rawGeminiKey : null;
    const grokKey = rawGrokKey && !rawGrokKey.includes("YOUR_API_KEY") ? rawGrokKey : null;

    const { message, history, language, imageData, mimeType, engine = "gemini" } = req.body;

    logger.info(`Chat Request Received. Engine: ${engine}, GeminiKey: ${geminiKey ? "VALIDATED" : "MISSING"}, GrokKey: ${grokKey ? "VALIDATED" : "MISSING"}`);

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

        const response = await ai.models.generateContentStream({
          model: "gemini-3-flash-preview",
          contents,
          config: {
            systemInstruction: `You are REvuBOT, the elite Thailand AI Tour Guide and Autonomous Travel Agent.
            
            Core Directives:
            1. LANGUAGE: Prioritize ${language}. Support English, Thai, Hindi, Sinhala, and BANGLA (very important for Bangladesh-Thailand corridor).
            2. EXPERTISE:
               - SMART PLANNING: Generate 1-14 day itineraries with logic for budget (e.g. "under $200"), weather, and season.
               - LEGAL/SAFETY: Expert on Visa rules (specifically for South Asian/Bangladesh tourists). 
               - SCAM ADVISORY: Warn about "Grand Palace Closed" scams (commission-based shop traps), "Fixed Price" Taxis (insist on 35 THB start meter), "Fast Meters" in Taxis, and Jet Ski damage scams (fake damage demands).
               - PROHIBITED ACTIONS: Emphasize penalties for Vaping (up to 30,000 THB fine + prison), Lèse-majesté (insulting Monarchy = 3-15 years prison), and overstaying visas (500 THB/day fine + deportation/blacklist).
               - INSIDER INFO: Suggest "Hidden Gems" instead of generic tourist traps. Focus on "Soi" culture, local night markets, and non-Google spots.
            3. AGENT CAPABILITIES (Simulated):
               - Be ready to "execute" actions. If asked to book, provide clear instructions or deep links (e.g. to Agoda, Klook, Grab).
               - Recommend cheapest transit routes (BTS vs Grab vs Pink/Yellow lines).
            4. TONE: Professional, high-intelligence, "Agent-like", elite, and safety-conscious.
            5. FORMATTING: Use clean Markdown. Use bullet points for steps.
            
            Context: The user is likely an international tourist looking for zero-barrier entry into Thai culture.`
          }
        });
        
        res.setHeader('Content-Type', 'text/plain');
        for await (const chunk of response) {
          if (chunk.text) {
            res.write(chunk.text);
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

      if (error.message?.includes("API key not valid")) {
        clientError = "INVALID API KEY: The Gemini API Key provided in settings is rejected by Google. Please check your credentials.";
        statusCode = 401;
      }

      res.status(statusCode).json({ 
        error: clientError,
        requestId: Math.random().toString(36).substring(7)
      });
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
