"use client";

import { useState, useEffect } from "react";
import { quizQuestions as data } from "./data";

export default function Home() {
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key.toUpperCase();
      if (!quizActive) {
        if (key === "S") setQuizActive(true); // Start quiz
        return;
      }

      if (key === "X") {
        // Exit quiz
        setQuizActive(false);
        setCurrentQuestionIndex(0);
        setFeedback("");
        return;
      }

      if (["A", "B", "C", "D"].includes(key)) {
        const currentQuestion = data[currentQuestionIndex];
        if (key === currentQuestion.correctAnswer) {
          setFeedback("Correct Answer!");
        } else {
          setFeedback("Incorrect Answer!");
        }

        // Move to next question after a short delay
        setTimeout(() => {
          if (currentQuestionIndex < data.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            setFeedback("");
          } else {
            setQuizActive(false); // End quiz if last question
            setFeedback("Quiz Completed! Well done.");
          }
        }, 1000);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [quizActive, currentQuestionIndex]);

  return (
    <div className="font-[family-name:var(--font-geist-sans)] p-20">
      <div className="mb-12">
        <h1 className="text-3xl text-center font-semibold text-gray-800">
          Brainy Quest
        </h1>
        <p className="text-gray-600 text-center mt-3">
          Press <strong>S</strong> to start the quiz and <strong>X</strong> to
          exit the quiz.
        </p>
        <p className="text-gray-600 text-center">
          Please use the <strong>A, B, C, D</strong> keys on your keyboard to
          answer.
        </p>
      </div>

      {quizActive ? (
        data.map((el, i) => (
          <div
            className={`${
              i === currentQuestionIndex ? "bg-green-50" : "bg-gray-50"
            } p-6 mb-6 rounded-md`}
            key={i}
          >
            <p className="text-xl font-semibold mb-4">
              {el.order}. {el.question}
            </p>
            <div className="grid grid-cols-2">
              {Object.keys(el.options).map((option) => (
                <button
                  className="btn mt-2 text-left"
                  key={option}
                  disabled={i !== currentQuestionIndex}
                >
                  {option}. {el.options[option]}
                </button>
              ))}
            </div>
            {i === currentQuestionIndex && feedback && (
              <p className="text-lg font-medium mt-4 text-blue-600">
                {feedback}
              </p>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600 mt-12">
          Press <strong>S</strong> to start the quiz.
        </p>
      )}
    </div>
  );
}
