import express from "express";
import Habit from "../models/Habit.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// GET all habits
router.get("/", verifyToken, async (req, res) => {
  const habits = await Habit.find({ userId: req.user.id });
  res.json(habits);
});

// CREATE habit
router.post("/", verifyToken, async (req, res) => {
  const { title, category } = req.body;
  const habit = await Habit.create({
    userId: req.user.id,
    title,
    category,
    completedDates: [],
  });
  res.json(habit);
});

// MARK habit as complete
router.patch("/:id/complete", verifyToken, async (req, res) => {
  const habit = await Habit.findById(req.params.id);
  if (!habit) return res.status(404).json({ error: "Habit not found" });
  habit.completedDates.push(new Date());
  await habit.save();
  res.json(habit);
});

export default router;
