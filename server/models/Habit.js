import mongoose from "mongoose";

const HabitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  category: String,       
  completedDates: [Date],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Habit", HabitSchema);
