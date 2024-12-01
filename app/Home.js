"use client";

import { useState, useEffect } from "react";
// import { quizQuestions as data } from "./data";

export default function Home({ data, topic }) {
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isLocked, setIsLocked] = useState(false); // Prevent multiple inputs during feedback

  useEffect(() => {
    if (typeof window === "undefined" && process.browswer) return;

    const handleKeyPress = (event) => {
      const key = event.key.toUpperCase();

      if (isLocked) return; // Ignore input if locked

      if (!quizActive) {
        if (key === "S") {
          // Start quiz and reset state
          setQuizActive(true);
          setCurrentQuestionIndex(0);
          setFeedback("");
          setIsLocked(false);
        }
        return;
      }

      if (key === "X") {
        // Exit quiz
        setQuizActive(false);
        setCurrentQuestionIndex(0);
        setFeedback("");
        setIsLocked(false);
        return;
      }

      if (["A", "B", "C", "D"].includes(key)) {
        const currentQuestion = data[currentQuestionIndex];

        if (!currentQuestion) return; // Guard against undefined question

        // Lock input during feedback display
        setIsLocked(true);

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
            setIsLocked(false); // Unlock input after delay
          } else {
            setQuizActive(false); // End quiz if last question
            setFeedback("Quiz Completed! Well done.");
            setIsLocked(false); // Ensure input is unlocked after quiz ends
          }
        }, 1000);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [quizActive, currentQuestionIndex, isLocked]);

  return (
    <div className="font-[family-name:var(--font-geist-sans)] bg-amber-100 min-h-screen ">
      <div className="py-6 font-bold text-lg bg-orange-300 text-center text-red-800 relative">
        <div className="absolute top-0 left-4 h-40">
          <img src="/logo.png" className="h-full object-contain" />
        </div>
        <h1 className="text-5xl font-extrabold mb-2">BOSE INSTITUTE</h1>
        <p>
          An Autonomous Institute under Department of Science and Technology
        </p>
        <p>Ministry of Science and Technology, Govt. of India</p>
      </div>
      <div className="my-12 text-red-800 text-xl">
        <h1 className="text-3xl text-center font-extrabold">{topic}</h1>
        <p className="text-center mt-3">
          Press <strong>S</strong> to start the quiz and <strong>X</strong> to
          exit the quiz.
        </p>
        <p className="text-center">
          Please use the <strong>A, B, C, D</strong> keys on your keyboard to
          answer.
        </p>
      </div>

      <div className="px-20 border border-orange-200">
        {quizActive ? (
          data.map((el, i) => (
            <div
              className={`${
                i === currentQuestionIndex ? "bg-orange-200" : ""
              } p-12 mb-6 rounded-3xl`}
              key={i}
            >
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-xl font-semibold mb-4 text-red-800">
                    {el.order}. {el.question}
                  </p>
                </div>
                {el.image ? (
                  <div className="flex-1 flex justify-center items-center">
                    <img
                      src={el.image}
                      alt=""
                      className="h-80 max-h-[320px] object-contain rounded-3xl border-2 border-red-800"
                    />
                  </div>
                ) : null}
              </div>
              <div className="grid grid-cols-4 gap-10">
                {Object.keys(el.options).map((option, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="text-3xl text-white bg-red-800 p-4 w-32 text-center font-extrabold rounded-3xl rounded-b-none">
                      {option}
                    </div>
                    <div className="text-center text-xl font-semibold text-red-800 w-full rounded-3xl bordder border-2 border-red-800 bg-orange-300 p-20">
                      {el.options[option]}
                    </div>
                  </div>
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
          <p className="text-center text-xl text-red-800 mt-12">
            Press <strong>S</strong> to start the quiz.
          </p>
        )}
        <p className="text-sm text-right pb-6 text-red-800">
          made by{" "}
          <strong>
            <a
              href="https://phenixlabs.in/"
              target="_blank"
              className="hover:underline decoration-2"
            >
              phenixLabs
            </a>
          </strong>
        </p>
      </div>
    </div>
  );
}
