import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ResultPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const currentRound = state?.round?.roundNumber || 0;
  const totalRounds = 3;

  const handleNext = () => {
    if (currentRound < totalRounds) {
      // Go back to dashboard and unlock next round
      navigate("/", { state: { completedRound: currentRound } });
    } else {
      alert("🏆 Congratulations! You passed all rounds!");
      navigate("/");
    }
  };

  if (!state?.success)
    return <h3 style={{ textAlign: "center" }}>No result available</h3>;

  return (
    <motion.div
      style={{ textAlign: "center", marginTop: "50px" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h2>🎉 Congratulations! You cleared {state.round.title}!</h2>
      <h3>Your Score: {state.score}</h3>

      {currentRound < totalRounds ? (
        <button
          onClick={handleNext}
          style={{
            marginTop: "20px",
            padding: "10px 25px",
            borderRadius: "8px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Go to Next Round ({currentRound + 1})
        </button>
      ) : (
        <h2>🏆 Congratulations! You passed the full test! 🏆</h2>
      )}
    </motion.div>
  );
};

export default ResultPage;
