import axios from "axios";

export async function getNewsHeadlines(symbol) {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) {
    return mockNews(symbol);
  }
  try {
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(
      symbol
    )}&lang=en&max=5&token=${apiKey}`;
    const r = await axios.get(url, { timeout: 6000 });
    const articles = r?.data?.articles || [];
    const headlines = articles.slice(0, 5).map((a) => a.title);
    if (headlines.length === 0) return mockNews(symbol);
    return headlines;
  } catch {
    return mockNews(symbol);
  }
}

function mockNews(symbol) {
  return [
    `${symbol} sees steady investor interest`,
    `${symbol} announces product updates`,
    `${symbol} market shows mixed signals`,
  ];
}
