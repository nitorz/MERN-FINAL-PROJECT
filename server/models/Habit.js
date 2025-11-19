import mongoose from "mongoose";

const HabitSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    category: { type: String, default: "general" },
    completedDates: { type: [Date], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Habit", HabitSchema);
