import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { User } from "../models/User.js";

const router = Router();

/** Get User Profile */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.sub).select("-password -nonce");
    if (!user) return res.status(404).json({ error: "user_not_found" });
    return res.json(user);
  } catch (e) {
    return res.status(500).json({ error: "profile_get_failed" });
  }
});

/** Update User Profile Settings */
router.put("/", authMiddleware, async (req, res) => {
  try {
    const { name, profileImage, riskTolerance, preferredCurrency } = req.body || {};
    const user = await User.findById(req.user.sub);
    if (!user) return res.status(404).json({ error: "user_not_found" });

    if (name) user.name = name;
    if (profileImage) user.profileImage = profileImage;
    if (riskTolerance) user.riskTolerance = riskTolerance;
    if (preferredCurrency) user.preferredCurrency = preferredCurrency;

    await user.save();
    return res.json({ message: "profile_updated", user });
  } catch (e) {
    return res.status(500).json({ error: "profile_update_failed" });
  }
});

/** Complete a Lesson */
router.post("/lesson/:lessonId", authMiddleware, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const user = await User.findById(req.user.sub);
    if (!user) return res.status(404).json({ error: "user_not_found" });

    if (!user.completedLessons.includes(lessonId)) {
      user.completedLessons.push(lessonId);
      await user.save();
    }
    return res.json({ message: "lesson_completed", completedLessons: user.completedLessons });
  } catch (e) {
    return res.status(500).json({ error: "lesson_completion_failed" });
  }
});

export default router;
