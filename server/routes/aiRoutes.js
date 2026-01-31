import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  enhanceJobDescription,
  enhanceProfessionalSummary,
  uploadResume,
} from "../controllers/aiController.js";

const router = express.Router();

// ✅ Test endpoint
router.get("/test", protect, (req, res) => {
  res.json({ message: "AI routes working", userId: req.userId });
});

// ✅ Enhance professional summary
router.post("/enhance-pro-sum", protect, enhanceProfessionalSummary);

// ✅ Enhance job description
router.post("/enhance-job-desc", protect, enhanceJobDescription);

// ✅ Upload resume (AI-based extraction)
router.post("/upload-resume", protect, uploadResume);

export default router;
