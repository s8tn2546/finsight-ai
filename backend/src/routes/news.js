import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getNewsHeadlines } from "../services/news.js";
import { analyzeSentiment } from "../services/groq.js";

const router = Router();
const lastAlerts = new Map(); // symbol -> timestamp

router.get("/:symbol", authMiddleware, async (req, res) => {
  try {
    const { symbol } = req.params;
    const sym = String(symbol || "").toUpperCase();
    const headlines = await getNewsHeadlines(sym);
    const analysis = await analyzeSentiment(headlines, { symbol: sym });
    console.log("[/news]", { symbol: sym, headlinesCount: headlines.length, analysis });

    // Emit real-time alert if threshold breached
    const io = req.app.get("io");
    const highImpact =
      (analysis?.impact_strength ?? 0) >= 8 ||
      Math.abs(analysis?.sentiment_score ?? 0) > 0.6;
    if (io && highImpact) {
      const now = Date.now();
      const last = lastAlerts.get(sym) || 0;
      // de-duplicate: 60s cooldown per symbol
      if (now - last > 60_000) {
        lastAlerts.set(sym, now);
        const direction =
          (analysis?.sentiment_score ?? 0) > 0 ? "BULLISH" : "BEARISH";
        const message =
          `High-impact ${direction.toLowerCase()} news for ${sym} ` +
          `(impact ${analysis?.impact_strength ?? "?"}/10, score ${(analysis?.sentiment_score ?? 0).toFixed(2)}).`;
        io.emit("news_alert", {
          id: `${sym}-${now}`,
          symbol: sym,
          direction,
          impact: analysis?.impact_strength,
          score: analysis?.sentiment_score,
          message,
          ts: new Date().toISOString(),
        });
      }
    }
    return res.json({
      symbol: sym,
      headlines,
      sentiment: analysis,
    });
  } catch (e) {
    return res.status(500).json({ error: "news_failed" });
  }
});

export default router;
