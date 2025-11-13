import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.js";
import taskRoutes from "./src/routes/tasks.js";

dotenv.config();

const app = express();

// // Middleware
// app.use(
//   cors({
//     origin: process.env.vercelUrl,
//     credentials: true,
//   })
// );
const allowedOrigins = [
  "http://localhost:5173",
  "https://taskmangerhously.vercel.app",
  // "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(" Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Database connection
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://krushna:PA09qEviOx5RG5fN@cluster0.mksdqnu.mongodb.net/TaskManager?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
