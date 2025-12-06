const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    roundId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Round",
      required: true,
    },
    questionType: { type: String, default: "text" },
    questionText: { type: String, required: true },
    imageUrl: { type: String, default: null },
    videoUrl: { type: String, default: null },
    options: [String],
    correctAnswer: String,
    order: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", QuestionSchema);
