import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import http from "http";
import { Server as IOServer } from "socket.io";

// Routers
import habitRoutes from "./routes/habitRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import achievementsRouter from "./routes/Achievements.js";
import leaderboardRoutes from "./routes/leaderboard.js";

dotenv.config();

const app = express();

// =======================
// MIDDLEWARE
// =======================
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// =======================
// SOCKET.IO SERVER
// =======================
const PORT = process.env.PORT || 5000;
const httpServer = http.createServer(app);

const io = new IOServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  },
});

// Store socket instance globally
app.set("io", io);

// Handle socket connections
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Optional: Identify user room
  const userId = socket.handshake.auth?.userId;
  if (userId) socket.join(userId);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// =======================
// API ROUTES
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/achievements", achievementsRouter);
app.use("/api/leaderboard", leaderboardRoutes);

// Health check endpoint
app.get("/health", (req, res) => res.json({ status: "OK", server: "Running" }));

// =======================
// SERVE REACT (PRODUCTION)
// =======================
const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "../client/build", "index.html"))
  );
}

// =======================
// DATABASE + LAUNCH SERVER
// =======================
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sdg-tracker")
  .then(() => {
    console.log("✔ MongoDB Connected");
    httpServer.listen(PORT, () =>
      console.log(`🚀 Server + WebSockets running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
