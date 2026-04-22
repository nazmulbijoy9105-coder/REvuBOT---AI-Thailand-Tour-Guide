import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

// Note: Environment variables like GEMINI_API_KEY are managed by AI Studio.
// Grok API Key can be added to Secrets and accessed via process.env.GROK_API_KEY.

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "REvuBOT API is running" });
  });

  // Proxy for AI Chat to hide keys if necessary, or manage Grok integration
  app.post("/api/chat", async (req, res) => {
    const geminiKey = process.env.GEMINI_API_KEY;
    const grokKey = process.env.GROK_API_KEY;

    console.log(`[REvuBOT] Chat Request Received. GeminiKey: ${geminiKey ? "PRESENT" : "MISSING"}, GrokKey: ${grokKey ? "PRESENT" : "MISSING"}`);

    try {
      const { message, history, language, imageData, mimeType } = req.body;
      
      if (geminiKey) {
        console.log("[REvuBOT] Initializing Gemini Neural Engine...");
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

        const stream = await ai.models.generateContentStream({
          model: "gemini-3-flash-preview",
          contents,
          config: {
            systemInstruction: `You are REvuBOT, a helpful Thailand tour guide. 
            Support languages: English, Thai, Hindi, Sinhala. 
            Always prioritize the user's selected language: ${language}.
            Be professional, high-intelligence, and safety-conscious.`
          }
        });
        
        res.setHeader('Content-Type', 'text/plain');
        for await (const chunk of stream) {
          const chunkText = chunk.text;
          if (chunkText) {
            res.write(chunkText);
          }
        }
        res.end();
        return;
      }
      
      if (grokKey) {
        // Implementation for Grok if requested
        const grokRes = await fetch("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${grokKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
             messages: [
               { role: "system", content: `You are REvuBOT, a helpful Thailand tour guide. Support languages: English, Thai, Hindi, Sinhala. Current user language preference: ${language}` },
               ...history,
               { role: "user", content: message }
             ],
             model: "grok-beta" // or specific version
          })
        });
        const data = await grokRes.json();
        return res.json({ reply: data.choices[0].message.content });
      }

      // If no keys found
      console.warn("[REvuBOT] No valid API keys found in environment.");
      res.status(401).json({ 
        error: "GEMINI_API_KEY is missing or invalid. Please configure it in your environment variables.",
        tip: "In AI Studio, ensure the Gemini API key is enabled in settings." 
      });

    } catch (error: any) {
      console.error("[REvuBOT] Chat Engine Error:", error);
      res.status(500).json({ 
        error: error.message || "Internal server error during neural processing",
        details: error.stack
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
      // Skip API and files with extensions
      if (url.startsWith('/api') || url.includes('.')) return next();
      
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`REvuBOT server running on http://localhost:${PORT}`);
  });
}

startServer();
