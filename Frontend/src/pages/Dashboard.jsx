import React, { useEffect, useState } from "react";
import { api } from "../api/quizApi";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [rounds, setRounds] = useState([]);
  const [unlockedRound, setUnlockedRound] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch rounds
  useEffect(() => {
    const fetchRounds = async () => {
      const res = await api.get("/rounds");
      setRounds(res.data);
    };
    fetchRounds();
  }, []);

  // Restore progress
  useEffect(() => {
    const saved = localStorage.getItem("unlockedRound");
    if (saved) setUnlockedRound(Number(saved));
  }, []);

  // Unlock next round if completed
  useEffect(() => {
    const state = location.state;
    if (state?.completedRound) {
      const nextRound = state.completedRound + 1;
      setUnlockedRound(nextRound);
      localStorage.setItem("unlockedRound", nextRound);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const resetProgress = () => {
    localStorage.removeItem("unlockedRound");
    setUnlockedRound(1);
    alert("Progress reset!");
  };

  return (
    <div className="dashboard-container">
      <h2>🎮 Quiz Rounds</h2>
      <p>Complete each round to unlock the next!</p>

      <button className="reset-btn" onClick={resetProgress}>
        🔄 Reset Progress
      </button>

      <div className="round-list">
        {rounds.map((round) => {
          const isUnlocked = round.roundNumber <= unlockedRound;
          return (
            <div
              key={round._id}
              className={`round-card ${isUnlocked ? "unlocked" : "locked"}`}
              onClick={() => {
                if (isUnlocked) navigate(`/round/${round._id}`);
              }}
            >
              <h3>{round.title}</h3>
              <p>Questions: {round.numQuestions}</p>
              {!isUnlocked && <p className="locked-label">🔒 Locked</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
