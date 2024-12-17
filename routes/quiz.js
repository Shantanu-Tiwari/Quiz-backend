const express = require("express");
const Quiz = require("../models/Quiz");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// POST /quiz/create - Create a new quiz
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title, questions } = req.body;
    const newQuiz = new Quiz({
      title,
      questions,
      creator: req.user.id,
    });
    await newQuiz.save();
    res.status(201).json({ message: "Quiz created successfully", quiz: newQuiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /quiz/:id - Get a specific quiz by ID
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /quiz/:id/submit - Submit a score for the quiz leaderboard
router.post("/:id/submit", async (req, res) => {
  try {
    const { username, score } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    quiz.leaderboard.push({ username, score });
    quiz.leaderboard.sort((a, b) => b.score - a.score); // Sort leaderboard
    await quiz.save();

    res.json({ message: "Score submitted", leaderboard: quiz.leaderboard });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /quiz/:id/leaderboard - Get leaderboard for a specific quiz
router.get("/:id/leaderboard", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(quiz.leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /quiz - Get all quizzes
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find(); // Fetch all quizzes from the database
    res.json(quizzes); // Send the quizzes data as JSON
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
