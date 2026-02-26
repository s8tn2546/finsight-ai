export function comparePredictions(ai, user, actual) {
  if (actual === "SIDEWAYS") {
    return { case: "sideways", explanation: "sideways" };
  }
  const aiCorrect = ai === actual;
  const userCorrect = user === actual;
  if (aiCorrect && userCorrect) {
    return { case: "both_correct", explanation: "both_correct" };
  }
  if (aiCorrect && !userCorrect) {
    return { case: "ai_correct", explanation: "ai_correct" };
  }
  if (!aiCorrect && userCorrect) {
    return { case: "user_correct", explanation: "user_correct" };
  }
  return { case: "both_wrong", explanation: "both_wrong" };
}
