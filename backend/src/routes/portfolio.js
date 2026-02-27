import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { mongoAvailable } from "../utils/db.js";
import { Portfolio } from "../models/Portfolio.js";
import { getCurrentPrice, getDailySeries } from "../services/marketData.js";

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

// Historical total value time series for portfolio growth
router.get("/:userId/history", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const days = Math.min(Number(req.query.days) || 30, 90);
    let data;
    if (mongoAvailable()) {
      data = await Portfolio.findOne({ userId });
      if (!data) data = { userId, holdings: [] };
    } else {
      data = memStore.get(userId) || { userId, holdings: [] };
    }
    const holdings = data?.holdings || [];
    if (holdings.length === 0) {
      return res.json({ series: [] });
    }

    // Fetch daily series for each unique symbol
    const symbols = [...new Set(holdings.map((h) => h.symbol))];
    const seriesMap = {};
    for (const s of symbols) {
      const series = await getDailySeries(s, days);
      seriesMap[s] = series; // [{ date,time,price }]
    }

    // Align by date (intersection of dates available)
    const allDates = Object.values(seriesMap)
      .flatMap((arr) => arr.map((d) => d.date || d.time))
      .filter(Boolean);
    const dateCounts = allDates.reduce((acc, d) => {
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {});
    const commonDates = Object.entries(dateCounts)
      .filter(([, count]) => count === symbols.length)
      .map(([d]) => d)
      .sort();
    if (commonDates.length === 0) {
      // Fallback: take union and fill missing with nearest previous value
      const unionDates = [...new Set(allDates)].sort();
      // Build simple map per symbol by date for quick lookup
      const mapByDate = {};
      for (const s of symbols) {
        mapByDate[s] = {};
        for (const row of seriesMap[s]) {
          const key = row.date || row.time;
          mapByDate[s][key] = row.price ?? row.close ?? 0;
        }
      }
      let lastPrice = {};
      const series = unionDates.map((date) => {
        let total = 0;
        for (const h of holdings) {
          const s = h.symbol;
          const p = mapByDate[s][date];
          if (p != null) lastPrice[s] = p;
          const price = lastPrice[s] ?? mapByDate[s][unionDates[0]] ?? h.buyPrice ?? 0;
          total += h.quantity * price;
        }
        return { date, time: date, price: Number(total.toFixed(2)) };
      });
      return res.json({ series });
    }

    // Sum values per date across holdings
    const priceBySymbolDate = {};
    for (const s of symbols) {
      priceBySymbolDate[s] = Object.fromEntries(
        seriesMap[s].map((d) => [d.date || d.time, d.price ?? d.close ?? 0])
      );
    }
    const series = commonDates.map((date) => {
      let total = 0;
      for (const h of holdings) {
        const p = priceBySymbolDate[h.symbol][date] ?? h.buyPrice ?? 0;
        total += h.quantity * p;
      }
      return { date, time: date, price: Number(total.toFixed(2)) };
    });

    return res.json({ series });
  } catch (e) {
    return res.status(500).json({ error: "portfolio_history_failed" });
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
    bySymbolValues: bySymbol,
    allocationPercentages,
    diversificationScore: Number(diversificationScore.toFixed(2)),
    riskScore: Number(riskScore.toFixed(2)),
  };
}

function total(v) {
  return v && Number.isFinite(v) && v !== 0;
}

export default router;
