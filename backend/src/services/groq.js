import axios from "axios";

export async function analyzeSentiment(headlines) {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    return fallbackSentiment(headlines);
  }
  try {
    const prompt = [
      "Analyze these finance headlines and return JSON with fields sentiment_score (-1..1), impact_strength (1..10), summary.",
      ...headlines.map((h, i) => `${i + 1}. ${h}`),
    ].join("\n");
    const r = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a financial news analyst." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        timeout: 12000,
      }
    );
    const content = r?.data?.choices?.[0]?.message?.content || "";
    try {
      const parsed = JSON.parse(content);
      return {
        sentiment_score: Number(parsed.sentiment_score ?? 0),
        impact_strength: Number(parsed.impact_strength ?? 5),
        summary: String(parsed.summary ?? ""),
      };
    } catch {
      return fallbackSentiment(headlines);
    }
  } catch {
    return fallbackSentiment(headlines);
  }
}

function fallbackSentiment(headlines) {
  const s = (headlines.join(" ").toLowerCase().includes("up") ? 0.2 : 0) - (headlines
    .join(" ")
    .toLowerCase()
    .includes("down")
    ? 0.2
    : 0);
  return {
    sentiment_score: s,
    impact_strength: 5,
    summary: "Neutral to mild sentiment based on headlines.",
  };
}
