import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getNewsHeadlines } from "../services/news.js";
import { analyzeSentiment } from "../services/groq.js";

const router = Router();

router.get("/:symbol", authMiddleware, async (req, res) => {
  try {
    const { symbol } = req.params;
    const headlines = await getNewsHeadlines(symbol);
    const analysis = await analyzeSentiment(headlines);
    return res.json({
      symbol,
      headlines,
      sentiment: analysis,
    });
  } catch (e) {
    return res.status(500).json({ error: "news_failed" });
  }
});

export default router;
