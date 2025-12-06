const express = require("express");
const router = express.Router();   // <-- You forgot this line earlier
const questionSets = require("../data/questionSets");

// Your /seed route and other routes come below
router.get("/seed", async (req, res) => {
  try {
    const Round = require("../models/Round");
    const Question = require("../models/Question");

    const roundsData = [
      { roundNumber: 1, title: "World GK", numQuestions: 5 },
      { roundNumber: 2, title: "India GK", numQuestions: 5 },
      { roundNumber: 3, title: "Science & Technology", numQuestions: 5 },
    ];

    for (const r of roundsData) {
      let round = await Round.findOne({ roundNumber: r.roundNumber });
      if (!round) {
        round = await Round.create(r);
      }

      const count = await Question.countDocuments({ roundId: round._id });
      if (count === 0 && questionSets[r.roundNumber]) {
        for (let i = 0; i < r.numQuestions; i++) {
          const q = questionSets[r.roundNumber][i];
          await Question.create({
            roundId: round._id,
            questionType: "text",
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer,
            order: i + 1,
          });
        }
      }
    }

    res.json({ message: "✅ Questions seeded from external file successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Seed error" });
  }
});

// 🧹 Clear all rounds and questions
router.delete("/clear", async (req, res) => {
  try {
    const Round = require("../models/Round");
    const Question = require("../models/Question");

    await Round.deleteMany({});
    await Question.deleteMany({});

    res.json({ message: "🧹 All rounds and questions cleared successfully!" });
  } catch (err) {
    console.error("Error in /clear:", err.message);
    res.status(500).json({ message: "Error clearing data" });
  }
});

//If you want to save time while testing:
//Add a single route that clears and reseeds in one go 👇

router.get("/reset", async (req, res) => {
  try {
    const Round = require("../models/Round");
    const Question = require("../models/Question");
    const questionSets = require("../data/questionSets");

    await Round.deleteMany({});
    await Question.deleteMany({});

    const roundsData = [
      { roundNumber: 1, title: "World GK", numQuestions: 5 },
      { roundNumber: 2, title: "India GK", numQuestions: 5 },
      { roundNumber: 3, title: "Science & Technology", numQuestions: 5 },
    ];

    for (const r of roundsData) {
      const round = await Round.create(r);
      for (let i = 0; i < r.numQuestions; i++) {
        const q = questionSets[r.roundNumber][i];
        await Question.create({
          roundId: round._id,
          questionType: "text",
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          order: i + 1,
        });
      }
    }

    res.json({ message: "✅ Database reset and reseeded successfully!" });
  } catch (err) {
    console.error("Reset Error:", err.message);
    res.status(500).json({ message: "Error resetting database" });
  }
});



module.exports = router;





// const express = require("express");
// const router = express.Router();
// const adminController = require("../controllers/adminController");

// // create a round
// router.post("/rounds", adminController.createRound);

// // create a question
// router.post("/questions", adminController.createQuestion);

// // list all questions (admin)
// router.get("/questions", adminController.listAllQuestions);

// // optional: a simple seed endpoint (if you want)
// router.get("/seed", async (req, res) => {
//   try {
//     // minimal seed on demand: create round1 if not exists
//     const Round = require("../models/Round");
//     const Question = require("../models/Question");

//     let r1 = await Round.findOne({ roundNumber: 1 });
//     if (!r1) {
//       r1 = await Round.create({ roundNumber: 1, title: "Basics", numQuestions: 5 });
//     }

//     // create sample question if none
//     const qCount = await Question.countDocuments({ roundId: r1._id });
//     if (qCount === 0) {
//       await Question.create({
//         roundId: r1._id,
//         questionType: "text",
//         questionText: "What is the capital of India?",
//         options: ["Delhi", "Mumbai", "Kolkata", "Chennai"],
//         correctAnswer: "Delhi",
//         order: 1
//       });
//     }

//     res.json({ message: "Seed completed (idempotent)" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Seed error" });
//   }
// });

// module.exports = router;
