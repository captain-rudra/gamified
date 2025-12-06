const Round = require("../models/Round");
const Question = require("../models/Question");

// POST /api/admin/rounds    -> create a round
exports.createRound = async (req, res) => {
  try {
    const { roundNumber, title, numQuestions } = req.body;
    if (roundNumber === undefined) {
      return res.status(400).json({ message: "roundNumber is required" });
    }
    const round = new Round({ roundNumber, title, numQuestions });
    await round.save();
    res.status(201).json(round);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/admin/questions  -> create a question
exports.createQuestion = async (req, res) => {
  try {
    const { roundId, questionType, questionText, imageUrl, options, correctAnswer, order } = req.body;

    if (!roundId || !questionText || !options || !correctAnswer) {
      return res.status(400).json({ message: "roundId, questionText, options, correctAnswer are required" });
    }

    // ensure options is array of 4
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: "options must be an array (recommended 4 items)" });
    }

    const q = new Question({
      roundId,
      questionType: questionType || "text",
      questionText,
      imageUrl: imageUrl || null,
      options,
      correctAnswer,
      order: order || 0
    });

    await q.save();
    res.status(201).json(q);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/questions   -> list all questions (for admin listing)
exports.listAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate("roundId", "roundNumber title").sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
