const mongoose = require("mongoose");

const RoundSchema = new mongoose.Schema({
  roundNumber: { type: Number, required: true, unique: true },
  title: { type: String, default: "Round" },
  numQuestions: { type: Number, default: 5 }
}, { timestamps: true });

module.exports = mongoose.model("Round", RoundSchema);
