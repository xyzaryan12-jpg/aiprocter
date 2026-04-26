import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  saveResult,
  getResultsByExamId,
  getUserResults,
  toggleResultVisibility,
  getAllResults,
  gradeResult,
} from "../controllers/resultController.js";

const resultRoutes = express.Router();
resultRoutes.use(protect);

resultRoutes.post("/results", saveResult);
resultRoutes.get("/results/all", getAllResults);
resultRoutes.get("/results/exam/:examId", getResultsByExamId);
resultRoutes.get("/results/user", getUserResults);
resultRoutes.put("/results/:resultId/toggle-visibility", toggleResultVisibility);

// ── NEW: teacher grading endpoint ──
resultRoutes.put("/results/:resultId/grade", gradeResult);

export default resultRoutes;
