import React from "react";
import { TypeAnimation } from "react-type-animation";

const TypingAnim = () => {
  return (
    <TypeAnimation
      sequence={[
        "Empower Your Learning with AI 🚀",
        1500,
        "Master Your Subjects with AI 📚",
        2000,
        "Quick PDF Summaries & Quizzes 📝",
        2000,
        "Your Personalized Study Buddy ✨",
        2000,
      ]}
      wrapper="span"
      speed={50}
      style={{
        fontSize: "clamp(1.5rem, 5vw, 3.5rem)",
        display: "inline-block",
        color: "white",
        fontWeight: 700,
        letterSpacing: "-0.01em",
      }}
      repeat={Infinity}
    />
  );
};

export default TypingAnim;
