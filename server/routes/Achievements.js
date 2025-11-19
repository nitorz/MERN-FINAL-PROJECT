import express from "express";
import Achievement from "../models/Achievement.js";
import Habit from "../models/Habit.js";
import User from "../models/User.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// GET user achievements
router.get("/", auth, async (req, res) => {
  const items = await Achievement.find({ userId: req.user.id }).sort({ unlockedAt: -1 });
  res.json(items);
});

// Internal function to evaluate and unlock achievements
export async function evaluateAchievementsForUser(userId, io = null) {
  // load user habits counts
  const habits = await Habit.find({ userId });
  const totalCompleted = habits.reduce((s, h) => s + (h.completedDates?.length || 0), 0);
  const uniqueHabits = habits.length;

  // define thresholds
  const candidates = [
    { key: "starter", title: "Getting Started", desc: "Created your first habit", rule: () => uniqueHabits >= 1 },
    { key: "10_actions", title: "10 Actions", desc: "Completed 10 habit actions", rule: () => totalCompleted >= 10 },
    { key: "50_actions", title: "50 Actions", desc: "Completed 50 habit actions", rule: () => totalCompleted >= 50 },
    { key: "habit_maker", title: "Habit Maker", desc: "Created 5 different habits", rule: () => uniqueHabits >= 5 }
  ];

  for (const c of candidates) {
    const exists = await Achievement.findOne({ userId, key: c.key });
    if (!exists && c.rule()) {
      const a = await Achievement.create({ userId, key: c.key, title: c.title, description: c.desc });
      // emit via socket if available
      if (io) io.emit("achievement:unlocked", { userId, achievement: a });
    }
  }
}

export default router;
