import { evaluateAchievementsForUser } from "./Achievements.js"; // same folder
import express from "express";
import Habit from "../models/Habit.js";
import jwt from "jsonwebtoken";

const router = express.Router();

/** 🔐 JWT Middleware */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token format" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

/** 📌 GET user habits */
router.get("/", verifyToken, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(habits);
  } catch {
    res.status(500).json({ error: "Failed to fetch habits" });
  }
});

/** ➕ CREATE habit */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const habit = await Habit.create({
      userId: req.user.id,
      title,
      category,
    });

    const io = req.app.get("io");

    io.to(req.user.id).emit("habit:created", { habit });

    const achievements = await evaluateAchievementsForUser(req.user.id, io);

    res.status(201).json({ habit, achievements });
  } catch (error) {
    res.status(500).json({ error: "Failed to create habit" });
  }
});

/** ✅ COMPLETE habit */
router.patch("/:id/complete", verifyToken, async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!habit) return res.status(404).json({ error: "Not found" });

    const today = new Date().toISOString().split("T")[0];

    const alreadyDone = habit.completedDates.some(d =>
      d.toISOString().startsWith(today)
    );

    if (alreadyDone) {
      return res.json({ message: "Already marked today", habit });
    }

    habit.completedDates.push(new Date());
    await habit.save();

    const io = req.app.get("io");

    const achievements = await evaluateAchievementsForUser(req.user.id, io);

    io.to(req.user.id).emit("habit:completed", {
      habitId: habit._id,
      habit,
      achievements,
    });

    res.json({ message: "Habit marked complete", habit, achievements });
  } catch {
    res.status(500).json({ error: "Failed to complete habit" });
  }
});

/** 🗑 DELETE habit */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!habit) return res.status(404).json({ error: "Habit not found" });

    const io = req.app.get("io");
    io.to(req.user.id).emit("habit:deleted", { habitId: habit._id });

    res.json({ message: "Habit deleted", habit });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
