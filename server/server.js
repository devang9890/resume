import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // ✅ Connect to MongoDB
    await connectDB();
    console.log("✅ MongoDB connected successfully");

    // ✅ Middlewares
    app.use(express.json());
    app.use(cors());

    // ✅ Routes
    app.get("/", (req, res) => res.send("Server is live 🚀"));
    app.use("/api/users", userRouter);
    app.use("/api/resumes", resumeRouter);
    app.use("/api/ai", aiRouter);

    // ✅ Start Server
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

// ✅ Initialize server
startServer();
