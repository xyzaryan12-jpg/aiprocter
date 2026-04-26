import asyncHandler from "express-async-handler";
import Result from "../models/resultModel.js";
import Question from "../models/quesModel.js";
import CodingQuestion from "../models/codingQuestionModel.js";

// @desc    Save exam result
// @route   POST /api/results
// @access  Private
const saveResult = asyncHandler(async (req, res) => {
  const { examId, answers } = req.body;

  if (!examId || !answers) {
    res.status(400);
    throw new Error("Please provide examId and answers");
  }

  const questions = await Question.find({ examId });

  let totalMarks = 0;
  let correctAnswers = 0;

  for (const question of questions) {
    const userAnswer = answers[question._id.toString()];
    if (userAnswer) {
      const correctOption = question.options.find((opt) => opt.isCorrect);
      if (correctOption && correctOption._id.toString() === userAnswer) {
        totalMarks += question.ansmarks || 1;
        correctAnswers++;
      }
    }
  }

  const totalQuestions = questions.length;
  const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

  const result = await Result.create({
    examId,
    userId: req.user._id,
    answers: new Map(Object.entries(answers)),
    totalMarks,
    percentage,
    showToStudent: false,
  });

  res.status(201).json({ success: true, data: result });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all results with full MCQ question+answer details (for teachers)
// @route   GET /api/results/all
// @access  Private (Teacher only)
const getAllResults = asyncHandler(async (req, res) => {
  if (req.user.role !== "teacher") {
    res.status(403);
    throw new Error("Not authorized");
  }

  const results = await Result.find()
    .populate("userId", "name email")
    .populate("gradedBy", "name")
    .sort({ createdAt: -1 });

  // For each result, pair the MCQ answers with question text + correct answer
  const enriched = await Promise.all(
    results.map(async (result) => {
      const obj = result.toObject();

      // Fetch all questions for this exam
      const questions = await Question.find({ examId: result.examId });

      // Build answer review: [{question, selectedOption, correctOption, isCorrect, marks}]
      const answersMap = obj.answers || {};
      const mcqReview = questions.map((q) => {
        const selectedOptionId = answersMap[q._id.toString()];
        const selectedOption = q.options.find(
          (o) => o._id.toString() === selectedOptionId
        );
        const correctOption = q.options.find((o) => o.isCorrect);
        return {
          questionId: q._id,
          questionText: q.question,
          options: q.options.map((o) => ({
            _id: o._id,
            optionText: o.optionText,
            isCorrect: o.isCorrect,
          })),
          selectedOptionId: selectedOptionId || null,
          selectedOptionText: selectedOption?.optionText || "Not answered",
          correctOptionText: correctOption?.optionText || "",
          isCorrect: selectedOption?.isCorrect || false,
          marks: q.ansmarks || 1,
        };
      });

      // Fetch coding submissions for this student
      const codingQuestions = await CodingQuestion.find({ examId: result.examId });
      const codingSubmissions = codingQuestions.map((q) => ({
        questionId: q._id,
        question: q.question,
        description: q.description,
        code: q.submittedAnswer?.code || "",
        language: q.submittedAnswer?.language || "",
        status: q.submittedAnswer?.status || "pending",
      }));

      return {
        ...obj,
        mcqReview,
        codingSubmissions,
      };
    })
  );

  res.status(200).json({ success: true, data: enriched });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Grade a result — teacher assigns coding marks + feedback
// @route   PUT /api/results/:resultId/grade
// @access  Private (Teacher only)
const gradeResult = asyncHandler(async (req, res) => {
  if (req.user.role !== "teacher") {
    res.status(403);
    throw new Error("Not authorized");
  }

  const { resultId } = req.params;
  const { codingMarks, feedback, releaseToStudent } = req.body;

  const result = await Result.findById(resultId);
  if (!result) {
    res.status(404);
    throw new Error("Result not found");
  }

  // Update grading fields
  if (codingMarks !== undefined) result.codingMarks = Number(codingMarks);
  if (feedback    !== undefined) result.feedback    = feedback;

  // Total score = auto MCQ marks + teacher-assigned coding marks
  result.totalScore = (result.totalMarks || 0) + (result.codingMarks || 0);

  // Release toggle
  if (releaseToStudent !== undefined) result.showToStudent = Boolean(releaseToStudent);

  result.gradedBy = req.user._id;
  result.gradedAt = new Date();

  await result.save();
  await result.populate("userId", "name email");

  res.status(200).json({ success: true, data: result });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get results for current user (student)
// @route   GET /api/results/user
// @access  Private
const getUserResults = asyncHandler(async (req, res) => {
  const results = await Result.find({ userId: req.user._id })
    .populate("examId", "examName duration")
    .sort({ createdAt: -1 });

  const resultsWithCoding = await Promise.all(
    results.map(async (result) => {
      const codingQuestions = await CodingQuestion.find({
        examId: result.examId?._id || result.examId,
        "submittedAnswer.code": { $exists: true, $ne: "" },
      }).select("question description submittedAnswer");

      return {
        ...result.toObject(),
        codingSubmissions: codingQuestions.map((q) => ({
          question: q.question,
          code: q.submittedAnswer?.code,
          language: q.submittedAnswer?.language,
          status: q.submittedAnswer?.status,
        })),
      };
    })
  );

  res.status(200).json({ success: true, data: resultsWithCoding });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Toggle showToStudent for a result
// @route   PUT /api/results/:resultId/toggle-visibility
// @access  Private (Teacher only)
const toggleResultVisibility = asyncHandler(async (req, res) => {
  const { resultId } = req.params;
  const result = await Result.findById(resultId);
  if (!result) {
    res.status(404);
    throw new Error("Result not found");
  }
  result.showToStudent = !result.showToStudent;
  await result.save();
  res.status(200).json({ success: true, data: result });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get results for a specific exam (for teachers)
// @route   GET /api/results/exam/:examId
// @access  Private
const getResultsByExamId = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  const results = await Result.find({ examId })
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: results });
});

export {
  saveResult,
  getAllResults,
  gradeResult,
  getUserResults,
  toggleResultVisibility,
  getResultsByExamId,
};
