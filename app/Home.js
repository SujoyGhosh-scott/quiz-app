"use client";

import { useState, useEffect, useRef } from "react";

export default function Home({ data, topic }) {
  const [quizActive, setQuizActive] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isLocked, setIsLocked] = useState(false); // Prevent multiple inputs during feedback

  // Create refs for each question
  const questionRefs = useRef([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleKeyPress = (event) => {
      const key = event.key.toUpperCase();

      if (isLocked) return; // Ignore input if locked

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

        // Show modal with explanation
        setExplanation(
          currentQuestion.explaination || "No explanation provided."
        );
        setModalVisible(true);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentQuestionIndex, isLocked]);

  const handleCloseModal = () => {
    setModalVisible(false);
    setIsLocked(false);

    if (currentQuestionIndex < data.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      // Restart quiz from the beginning
      setCurrentQuestionIndex(0);
      setQuizActive(true);
    }
  };

  useEffect(() => {
    const handleKeyPress = () => {
      if (modalVisible) {
        handleCloseModal();
      }
    };

    if (modalVisible) {
      document.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [modalVisible]);

  // Scroll to the current question when it changes
  useEffect(() => {
    if (questionRefs.current[currentQuestionIndex]) {
      questionRefs.current[currentQuestionIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentQuestionIndex]);

  return (
    <div className="font-[family-name:var(--font-geist-sans)] bg-amber-100 min-h-screen">
      <div className="py-6 font-bold text-lg bg-orange-300 text-center text-red-800 min-h-[20vh] sticky top-0 w-full">
        <div className="absolute top-0 left-6 h-[20vh] flex items-center">
          <img src="/logo.png" className="h-4/5 object-contain" />
        </div>
        <h1 className="text-5xl font-extrabold mb-2">BOSE INSTITUTE</h1>
        <p>
          An Autonomous Institute under Department of Science and Technology
        </p>
        <p>Ministry of Science and Technology, Govt. of India</p>
        <p>
          Please use the <strong>A, B, C, D</strong> keys on your keyboard to
          answer.
        </p>
      </div>
      <div className="my-12 text-red-800 text-xl">
        <h1 className="text-3xl text-center font-extrabold">{topic}</h1>
      </div>

      <div className="px-20">
        {quizActive &&
          data.map((el, i) => (
            <div
              ref={(el) => (questionRefs.current[i] = el)} // Assign ref to each question
              className={`${
                i === currentQuestionIndex ? "bg-orange-200" : ""
              } p-12 mb-6 rounded-3xl min-h-[50vh]`}
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
            </div>
          ))}
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

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-amber-100 p-12 rounded-3xl w-[800px] mx-auto text-center border-2 border-red-800">
            <h2 className="text-4xl font-bold mb-4 text-red-800 uppercase">
              {feedback}
            </h2>
            <h1 className="text-2xl mt-2 mb-6 font-bold text-red-800">
              Because
            </h1>
            <div
              className="text-lg text-red-800 mb-6"
              dangerouslySetInnerHTML={{ __html: explanation }}
            ></div>
            <button
              // onClick={handleCloseModal}
              className="bg-orange-300 text-white px-8 py-4 rounded-2xl text-lg uppercase font-bold"
            >
              Press any key to continue.
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
