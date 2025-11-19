import express from "express";
import Habit from "../models/Habit.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/calendar", auth, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id }).select("completedDates -_id");

    const counts = {}; // { '2025-11-19': 3, ... }

    habits.forEach((h) => {
      (h.completedDates || []).forEach((d) => {
        const key = new Date(d).toISOString().slice(0, 10);
        counts[key] = (counts[key] || 0) + 1;
      });
    });

    // transform to array for frontend
    const result = Object.entries(counts).map(([date, count]) => ({ date, count }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load analytics" });
  }
});

export default router;
