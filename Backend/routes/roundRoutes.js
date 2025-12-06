const express = require("express");
const router = express.Router();
const { getRounds,
     getRoundQuestions, 
     checkAnswer } = require("../controllers/roundController");

router.get("/rounds", getRounds);
router.get("/rounds/:id/questions", getRoundQuestions);
router.post("/rounds/check-answer", checkAnswer);

module.exports = router;
