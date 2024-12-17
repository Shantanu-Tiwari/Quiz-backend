const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [
    {
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: Number, required: true },
    },
  ],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  leaderboard: [
    {
      username: String,
      score: Number,
    },
  ],
});

module.exports = mongoose.model("Quiz", QuizSchema);
