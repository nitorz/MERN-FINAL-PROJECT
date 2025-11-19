import express from "express";
import Habit from "../models/Habit.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * GET /leaderboard
 * returns top N users by total completed habit actions
 */
router.get("/", async (req, res) => {
  // aggregate totals
  const agg = await Habit.aggregate([
    { $unwind: { path: "$completedDates", preserveNullAndEmptyArrays: true } },
    { $group: { _id: "$userId", totalCompleted: { $sum: 1 } } },
    { $sort: { totalCompleted: -1 } },
    { $limit: 10 }
  ]);

  // populate user names
  const result = await Promise.all(
    agg.map(async (r) => {
      const user = await User.findById(r._id).select("name email");
      return { userId: r._id, name: user?.name || "Unknown", totalCompleted: r.totalCompleted };
    })
  );

  res.json(result);
});

export default router;
