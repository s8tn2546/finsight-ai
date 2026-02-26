export function hybridScore(mlConfidence, sentimentScore) {
  const s = Math.max(-1, Math.min(1, sentimentScore ?? 0));
  const m = Math.max(0, Math.min(1, mlConfidence ?? 0));
  const normalizedSentiment = (s + 1) / 2;
  const score = m * 0.7 + normalizedSentiment * 0.3;
  const dominantSignal = score >= 0.5 ? "UP" : "DOWN";
  return { hybridScore: score, dominantSignal };
}
