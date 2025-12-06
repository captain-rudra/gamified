import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/quizApi";
import QuestionCard from "../components/QuestionCard";
import { motion } from "framer-motion";
import "../styles/RoundPage.css";

const RoundPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [roundInfo, setRoundInfo] = useState(null);
  const [stopped, setStopped] = useState(false);
  const [score, setScore] = useState(0);

  // ✅ Load round data from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get(`/rounds/${id}/questions`);
        setRoundInfo(res.data.round);
        setQuestions(res.data.questions);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuestions();
  }, [id]);

  // ✅ Load progress from localStorage (if exists)
  useEffect(() => {
    const savedProgress = JSON.parse(localStorage.getItem("quizProgress"));
    if (savedProgress && savedProgress.roundId === id) {
      setCurrentIndex(savedProgress.currentIndex || 0);
      setScore(savedProgress.score || 0);
    }
  }, [id]);

  // ✅ Save progress whenever question index or score changes
  useEffect(() => {
    if (roundInfo) {
      const progress = {
        roundId: id,
        currentIndex,
        score,
      };
      localStorage.setItem("quizProgress", JSON.stringify(progress));
    }
  }, [currentIndex, score, id, roundInfo]);

  // ✅ Handle answer selection
  const handleAnswer = async (selectedOption, questionId) => {
    try {
      const res = await api.post("/rounds/check-answer", {
        questionId,
        selectedOption,
      });

      if (res.data.correct) {
        const newScore = score + 10;
        setScore(newScore);

        if (currentIndex + 1 < questions.length) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          // ✅ Clear progress when round completed
          localStorage.removeItem("quizProgress");

          navigate("/result", {
            state: {
              success: true,
              round: roundInfo,
              score: newScore,
            },
          });
        }
      } else {
        setStopped(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Restart current round manually
  const restartRound = () => {
    setCurrentIndex(0);
    setScore(0);
    setStopped(false);
    localStorage.removeItem("quizProgress");
  };

  if (!questions.length) return <h3>Loading questions...</h3>;

  return (
    <div className="round-page">
      <h2>{roundInfo?.title}</h2>
      <p>
        Score: {score} | Question {currentIndex + 1} / {questions.length}
      </p>

      {!stopped ? (
        <QuestionCard
          question={questions[currentIndex]}
          onAnswer={handleAnswer}
        />
      ) : (
        <motion.div
          className="stop-container"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          <h3>❌ Wrong Answer! Try Again.</h3>
          <button onClick={restartRound}>Restart Round</button>
        </motion.div>
      )}
    </div>
  );
};

export default RoundPage;
