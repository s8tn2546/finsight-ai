import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { predictStock } from "../services/mlClient.js";
import { getLastTwoCloses } from "../services/marketData.js";
import { comparePredictions } from "../utils/comparePredictions.js";
import { hybridScore } from "../utils/hybridScore.js";
import { getNewsHeadlines } from "../services/news.js";
import { analyzeSentiment } from "../services/groq.js";
import axios from "axios";

const router = Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { symbol, userPrediction } = req.body || {};
    if (!symbol || !userPrediction) {
      return res.status(400).json({ error: "symbol_and_userPrediction_required" });
    }

    // 1. ML Prediction
    const ml = await predictStock(symbol);

    // 2. News Sentiment
    const headlines = await getNewsHeadlines(symbol);
    const sentiment = await analyzeSentiment(headlines, { symbol });

    // 3. Market Move
    const [prev, last] = await getLastTwoCloses(symbol);
    const diff = last - prev;
    const pct = prev ? diff / prev : 0;
    const actual = Math.abs(pct) < 0.002 ? "SIDEWAYS" : pct > 0 ? "UP" : "DOWN";

    // 4. Comparison & Hybrid Score
    const comparison = comparePredictions(ml.prediction, userPrediction, actual);
    const hybrid = hybridScore(ml.confidence, sentiment.sentiment_score);

    // 5. LLM Explanation (NEW)
    let aiExplanation = "Analysis pending...";
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
      try {
        const prompt = `
          Stock: ${symbol}
          AI Prediction: ${ml.prediction} (Confidence: ${ml.confidence})
          User Prediction: ${userPrediction}
          Actual Market Move: ${actual}
          Sentiment Score: ${sentiment.sentiment_score}
          Comparison Case: ${comparison.case}
          Dominant Signal: ${hybrid.dominantSignal}

          As a financial analyst, provide a short, professional 2-3 sentence explanation of this outcome. 
          Mention the "Dominant Signal" and why there might be a "Gap" between AI and User if they differ.
        `;
        const groqRes = await axios.post(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
          },
          { headers: { Authorization: `Bearer ${groqKey}` }, timeout: 10000 }
        );
        aiExplanation = groqRes.data.choices[0].message.content;
      } catch (err) {
        aiExplanation = `The market moved ${actual}. AI suggested ${ml.prediction} while you predicted ${userPrediction}. The dominant signal was ${hybrid.dominantSignal}.`;
      }
    }

    return res.json({
      symbol,
      ai: ml,
      marketMove: { prev, last, pct, actual },
      comparison,
      hybrid,
      sentiment,
      explanation: aiExplanation
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "predict_failed" });
  }
});

export default router;
