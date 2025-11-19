import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
dotenv.config();

// Models
import User from "./models/User.js";
import Habit from "./models/Habit.js";

mongoose.connect(process.env.MONGO_URI);

async function seed() {
  await User.deleteMany({});
  await Habit.deleteMany({});

  const passwordHash = await bcrypt.hash("password123", 10);

  const users = await User.create([
    { name: "Jane Doe", email: "jane@example.com", passwordHash },
    { name: "John Smith", email: "john@example.com", passwordHash },
    { name: "Alice Johnson", email: "alice@example.com", passwordHash }
  ]);

  const categories = [
    "SDG 12 - Responsible Consumption & Production",
    "SDG 13 - Climate Action",
    "SDG 6 - Clean Water & Sanitation",
    "SDG 7 - Affordable & Clean Energy"
  ];

  // Generate 100 random habits
  const habits = [];
  for (let i = 0; i < 100; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const titleOptions = [
      "Use reusable bags",
      "Recycle plastics",
      "Turn off unused lights",
      "Reduce water usage",
      "Take public transport",
      "Plant trees",
      "Compost kitchen waste",
      "Avoid single-use plastics",
      "Use solar panels",
      "Buy local products"
    ];
    const title = titleOptions[Math.floor(Math.random() * titleOptions.length)];
    const date = new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000);

    habits.push({ userId: user._id, title, category, date });
  }

  await Habit.insertMany(habits);
  console.log("Atlas DB seeded successfully!");
  mongoose.disconnect();
}

seed();
