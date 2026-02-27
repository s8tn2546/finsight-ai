import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { mongoAvailable } from "../utils/db.js";
import { Portfolio } from "../models/Portfolio.js";
import { getNewsHeadlines } from "../services/news.js";
import { analyzeSentiment } from "../services/groq.js";
import axios from "axios";

const router = Router();
const memStore = new Map();

router.post("/chat", authMiddleware, async (req, res) => {
  try {
    const { message, userId } = req.body || {};
    if (!message || !userId) {
      return res.status(400).json({ error: "message_and_userId_required" });
    }
    let p;
    if (mongoAvailable()) {
      p = await Portfolio.findOne({ userId });
    } else {
      p = memStore.get(userId) || { userId, holdings: [] };
    }
    const symbols = [...new Set((p?.holdings || []).map((h) => h.symbol))].slice(0, 3);
    const newsMap = {};
    for (const s of symbols) newsMap[s] = await getNewsHeadlines(s);
    const headlines = Object.entries(newsMap).flatMap(([s, list]) =>
      list.map((t) => `${s}: ${t}`)
    );
    const sentiment = await analyzeSentiment(headlines, { symbol: "PORTFOLIO" });
    const context = [
      "You are an intelligent financial advisor. Be concise, educational, and non-promissory.",
      `User portfolio: ${JSON.stringify(p || { holdings: [] })}`,
      `Recent sentiment: ${JSON.stringify(sentiment)}`,
      `User message: ${message}`,
      "Provide a friendly reply with risk notes and next steps.",
    ].join("\n");

    const key = process.env.GROQ_API_KEY;
    let reply = "";
    if (key) {
      try {
        const r = await axios.post(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: "You are a financial advisor." },
              { role: "user", content: context },
            ],
            temperature: 0.4,
          },
          {
            headers: {
              Authorization: `Bearer ${key}`,
              "Content-Type": "application/json",
            },
            timeout: 15000,
          }
        );
        reply = r?.data?.choices?.[0]?.message?.content || "";
      } catch {
        reply =
          "Considering your holdings and recent neutral sentiment, diversify gradually and set clear risk limits.";
      }
    } else {
      reply =
        "Considering your holdings and recent neutral sentiment, diversify gradually and set clear risk limits.";
    }
    return res.json({
      reply,
      confidenceLevel: Math.max(0.3, Math.min(0.9, 0.5 + (sentiment.sentiment_score || 0) * 0.3)),
      keyInsights: [
        "Diversification and risk controls matter",
        "Monitor news-driven volatility",
        "Align positions with time horizon",
      ],
    });
  } catch (e) {
    return res.status(500).json({ error: "advisor_failed" });
  }
});

export default router;
