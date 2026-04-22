import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";

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
    try {
      const { message, history, language } = req.body;
      
      // Default to Gemini (process.env.GEMINI_API_KEY is available server-side too)
      // Actually per instructions, I should call Gemini from frontend usually,
      // but for "Full Backend APIs" requested by user, I'll provide an endpoint.
      
      const grokKey = process.env.GROK_API_KEY;
      
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

      // If no Grok key, we emphasize that Gemini should be used on frontend 
      // or we can proxy here. But instructions say "Always call Gemini API from the frontend".
      // So I'll return a 404 or a prompt to use the frontend direct call if no Grok key.
      res.status(400).json({ error: "Grok API Key not configured. Please use GEMINI from frontend." });

    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Internal server error" });
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
    console.log(`REvuBOT server running on http://localhost:${PORT}`);
  });
}

startServer();
