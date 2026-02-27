import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getDailySeries } from "../services/marketData.js";

const router = Router();

router.get("/:symbol/daily", authMiddleware, async (req, res) => {
  try {
    const { symbol } = req.params;
    const days = Math.min(Number(req.query.days) || 30, 90);
    const series = await getDailySeries(symbol.toUpperCase(), days);
    return res.json({ symbol: symbol.toUpperCase(), series });
  } catch (e) {
    return res.status(500).json({ error: "market_data_failed" });
  }
});

export default router;
