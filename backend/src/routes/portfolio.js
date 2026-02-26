import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { mongoAvailable } from "../utils/db.js";
import { Portfolio } from "../models/Portfolio.js";
import { getCurrentPrice } from "../services/marketData.js";

const router = Router();
const memStore = new Map();

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { userId, holding } = req.body || {};
    if (!userId || !holding) {
      return res.status(400).json({ error: "userId_and_holding_required" });
    }
    if (mongoAvailable()) {
      let p = await Portfolio.findOne({ userId });
      if (!p) p = await Portfolio.create({ userId, holdings: [] });
      p.holdings.push(holding);
      await p.save();
      return res.json(p);
    } else {
      const key = userId;
      const existing = memStore.get(key) || { userId, holdings: [] };
      existing.holdings.push(holding);
      memStore.set(key, existing);
      return res.json(existing);
    }
  } catch (e) {
    return res.status(500).json({ error: "portfolio_add_failed" });
  }
});

router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    let data;
    if (mongoAvailable()) {
      data = await Portfolio.findOne({ userId });
      if (!data) data = { userId, holdings: [] };
    } else {
      data = memStore.get(userId) || { userId, holdings: [] };
    }
    const analytics = await computeAnalytics(data);
    return res.json({ ...data, analytics });
  } catch (e) {
    return res.status(500).json({ error: "portfolio_get_failed" });
  }
});

async function computeAnalytics(p) {
  const prices = {};
  for (const h of p.holdings) {
    if (!prices[h.symbol]) prices[h.symbol] = await getCurrentPrice(h.symbol);
  }
  const totalInvestment = p.holdings.reduce(
    (s, h) => s + h.quantity * h.buyPrice,
    0
  );
  const currentValue = p.holdings.reduce(
    (s, h) => s + h.quantity * (prices[h.symbol] || 0),
    0
  );
  const profitLoss = currentValue - totalInvestment;
  const bySymbol = {};
  for (const h of p.holdings) {
    bySymbol[h.symbol] = (bySymbol[h.symbol] || 0) + h.quantity * (prices[h.symbol] || 0);
  }
  const allocationPercentages = Object.fromEntries(
    Object.entries(bySymbol).map(([sym, val]) => [
      sym,
      total(currentValue) ? val / currentValue : 0,
    ])
  );
  const diversificationScore = Object.keys(bySymbol).length > 5 ? 0.8 : 0.4 + 0.08 * Object.keys(bySymbol).length;
  const riskScore = Math.max(
    0.1,
    1 -
      Math.min(
        0.9,
        Object.values(allocationPercentages).reduce(
          (m, v) => Math.max(m, v),
          0
        )
      )
  );
  return {
    totalInvestment,
    currentValue,
    profitLoss,
    allocationPercentages,
    diversificationScore: Number(diversificationScore.toFixed(2)),
    riskScore: Number(riskScore.toFixed(2)),
  };
}

function total(v) {
  return v && Number.isFinite(v) && v !== 0;
}

export default router;
