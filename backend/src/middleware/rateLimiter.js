const buckets = new Map();

export function rateLimiter({ windowMs = 60000, max = 60 } = {}) {
  return function (req, res, next) {
    const key = req.ip || "global";
    const now = Date.now();
    let b = buckets.get(key);
    if (!b || now - b.start >= windowMs) {
      b = { start: now, count: 0 };
      buckets.set(key, b);
    }
    b.count += 1;
    if (b.count > max) {
      return res.status(429).json({ error: "rate_limited" });
    }
    return next();
  };
}
