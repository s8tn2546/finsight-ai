import axios from "axios";

export async function predictStock(symbol) {
  const base = process.env.ML_SERVICE_URL || "http://127.0.0.1:8001";
  try {
    const r = await axios.post(
      `${base}/predict-stock`,
      { symbol },
      { timeout: 8000 }
    );
    const data = r.data || {};
    return {
      prediction: data.prediction || "UP",
      confidence: Number(data.confidence || 0.6),
      indicators: data.indicators || {},
    };
  } catch {
    return {
      prediction: "UP",
      confidence: 0.55,
      indicators: {},
    };
  }
}
