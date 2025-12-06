import React from "react";
import { motion } from "framer-motion";
import "../styles/QuestionCard.css";

const QuestionCard = ({ question, onAnswer }) => {
  return (
    <motion.div
      className="question-card"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Image-based question */}
      {question.imageUrl && (
        <img src={question.imageUrl} alt="Question" className="question-image" />
      )}

      {/* Video-based question */}
      {question.videoUrl && (
        <video
          controls
          className="question-video"
          src={question.videoUrl}
        />
      )}

      {/* Text question */}
      <h3>{question.questionText}</h3>

      {/* Options */}
      <div className="options-container">
        {question.options.map((opt, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAnswer(opt, question._id)}
            className="option-btn"
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default QuestionCard;
