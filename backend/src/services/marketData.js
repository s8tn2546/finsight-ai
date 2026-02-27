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

export async function getDailySeries(symbol, days = 30) {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) return mockDailySeries(symbol, days);

  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(
      symbol
    )}&apikey=${apiKey}`;
    const r = await axios.get(url, { timeout: 10000 });
    const timeSeries = r?.data?.["Time Series (Daily)"];
    if (!timeSeries) return mockDailySeries(symbol, days);

    const dates = Object.keys(timeSeries).sort().reverse().slice(0, days);
    return dates.map((date) => {
      const o = timeSeries[date];
      return {
        date,
        time: date,
        open: parseFloat(o["1. open"]) || 0,
        high: parseFloat(o["2. high"]) || 0,
        low: parseFloat(o["3. low"]) || 0,
        close: parseFloat(o["4. close"]) || 0,
        price: parseFloat(o["4. close"]) || 0,
      };
    }).reverse();
  } catch {
    return mockDailySeries(symbol, days);
  }
}

function mockDailySeries(symbol, days) {
  const base = mockPrice(symbol);
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const date = d.toISOString().slice(0, 10);
    const price = base + (i * 0.5) + Math.sin(i / 3) * 2;
    return { date, time: date, open: price - 1, high: price + 1, low: price - 1, close: price, price };
  });
}

function mockPrice(symbol) {
  let seed = 0;
  for (let i = 0; i < symbol.length; i++) seed += symbol.charCodeAt(i);
  const base = 50 + (seed % 100);
  const noise = ((seed % 7) - 3) * 0.5;
  return Math.max(5, base + noise);
}
