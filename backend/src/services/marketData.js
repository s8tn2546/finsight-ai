import axios from "axios";

export async function getCurrentPrice(symbol) {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) return mockPrice(symbol);
  
  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(
      symbol
    )}&apikey=${apiKey}`;
    const r = await axios.get(url, { timeout: 8000 });
    const quote = r?.data?.["Global Quote"];
    const price = parseFloat(quote?.["05. price"]);
    if (!isNaN(price)) return price;
    return mockPrice(symbol);
  } catch {
    return mockPrice(symbol);
  }
}

export async function getLastTwoCloses(symbol) {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) return [mockPrice(symbol) * 0.98, mockPrice(symbol)];

  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(
      symbol
    )}&apikey=${apiKey}`;
    const r = await axios.get(url, { timeout: 10000 });
    const timeSeries = r?.data?.["Time Series (Daily)"];
    if (!timeSeries) return [mockPrice(symbol) * 0.98, mockPrice(symbol)];

    const dates = Object.keys(timeSeries).sort().reverse();
    if (dates.length >= 2) {
      const last = parseFloat(timeSeries[dates[0]]["4. close"]);
      const prev = parseFloat(timeSeries[dates[1]]["4. close"]);
      return [prev, last];
    }
    return [mockPrice(symbol) * 0.98, mockPrice(symbol)];
  } catch {
    return [mockPrice(symbol) * 0.98, mockPrice(symbol)];
  }
}

function mockPrice(symbol) {
  let seed = 0;
  for (let i = 0; i < symbol.length; i++) seed += symbol.charCodeAt(i);
  const base = 50 + (seed % 100);
  const noise = ((seed % 7) - 3) * 0.5;
  return Math.max(5, base + noise);
}
