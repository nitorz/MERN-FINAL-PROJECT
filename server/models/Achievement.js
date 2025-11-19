import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: String,
    description: String,
    type: String, // e.g. "streak", "first_habit", etc
    earnedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Achievement", AchievementSchema);
