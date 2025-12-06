const mongoose = require("mongoose");
const Round = require("../models/Round");
const Question = require("../models/Question");

// Get all rounds
const getRounds = async (req, res) => {
  try {
    const rounds = await Round.find().sort({ roundNumber: 1 });
    res.json(rounds);
  } catch (error) {
    console.error("Error in getRounds:", error.message);
    res.status(500).json({ message: "Error fetching rounds" });
  }
};

// Get all questions for a round
const getRoundQuestions = async (req, res) => {
  try {
    const { id } = req.params;
    const round = await Round.findById(id);
    if (!round) return res.status(404).json({ message: "Round not found" });

    // ✅ Ensure correct ObjectId matching
    const questions = await Question.find({
      roundId: new mongoose.Types.ObjectId(id),
    }).sort({ order: 1 });

    res.json({ round, questions });
  } catch (error) {
    console.error("Error in getRoundQuestions:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Check if selected answer is correct
const checkAnswer = async (req, res) => {
  try {
    const { questionId, selectedOption } = req.body;
    const question = await Question.findById(questionId);

    if (!question)
      return res.status(404).json({ message: "Question not found" });

    const correct = question.correctAnswer === selectedOption;
    res.json({ correct });
  } catch (error) {
    console.error("Error in checkAnswer:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRounds,
  getRoundQuestions,
  checkAnswer,
};
