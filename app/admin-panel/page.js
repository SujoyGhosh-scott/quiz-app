"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddQuetsionForm = ({ addQuestion }) => {
  const [question, setQuestion] = useState("");
  //   const [order, setOrder] = useState(null);
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [explaination, setExplaination] = useState("");

  const handleSubmit = () => {
    if (!question) {
      alert("question required!");
      return;
    }
    if (!optionA || !optionB || !optionC || !optionD) {
      alert("all 4 options required!");
      return;
    }
    if (!correctAnswer) {
      alert("correct option required!");
      return;
    }
    if (!["A", "a", "B", "b", "C", "c", "D", "d"].includes(correctAnswer)) {
      alert("correct choice has to be A or B or C or D");
      return;
    }
    if (!explaination) {
      alert("Answer Explaination required!");
      return;
    }

    const questionData = {
      question,
      options: {
        A: optionA,
        B: optionB,
        C: optionC,
        D: optionD,
      },
      correctAnswer: correctAnswer.toUpperCase(),
      explaination,
    };

    addQuestion(questionData);

    setQuestion("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setCorrectAnswer("");
    setExplaination("");
  };

  return (
    <div className="p-6 pt-4 md:p-12 md:pt-8 bg-gray-50">
      <h1 className="text-3xl font-semibold mb-5">Add New Question</h1>
      <label className="text-xl font-medium">Question</label>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="border w-full p-2 px-4 mt-1 mb-4 outline-0"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Choice A</label>
          <input
            value={optionA}
            onChange={(e) => setOptionA(e.target.value)}
            className="border w-full p-2 px-4 mt-1 mb-4 outline-0"
          />
        </div>
        <div>
          <label>Choice B</label>
          <input
            value={optionB}
            onChange={(e) => setOptionB(e.target.value)}
            className="border w-full p-2 px-4 mt-1 mb-4 outline-0"
          />
        </div>
        <div>
          <label>Choice C</label>
          <input
            value={optionC}
            onChange={(e) => setOptionC(e.target.value)}
            className="border w-full p-2 px-4 mt-1 mb-4 outline-0"
          />
        </div>
        <div>
          <label>Choice D</label>
          <input
            value={optionD}
            onChange={(e) => setOptionD(e.target.value)}
            className="border w-full p-2 px-4 mt-1 mb-4 outline-0"
          />
        </div>
      </div>
      <label>Answer Explaination</label>
      <div className="bg-white mt-1 mb-4">
        <ReactQuill
          theme="snow"
          value={explaination}
          onChange={(html) => setExplaination(html)}
          preserveWhitespace={true}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Correct Choice(A,B,C or D)</label>
          <input
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            className="border w-full p-2 px-4 mt-1 outline-0"
          />
        </div>
        {/* <div>
          <label>Order of appearance</label>
          <input
            type="number"
            min={1}
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="border w-full bg-gray-50 p-2 px-4 mt-1 outline-0"
          />
        </div> */}
        <div className="flex items-end">
          <button
            onClick={handleSubmit}
            className="rounded-sm shadow w-full py-3 h-fit bg-blue-400"
          >
            Add question
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [password, setPassword] = useState("");
  const [topic, setTopic] = useState("");
  const [id, setId] = useState("");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (isLogin) return;

    axios
      .get(`/api/data`)
      .then((resp) => {
        console.log("data: ", resp.data);
        setTopic(resp.data.data.topic);
        setId(resp.data.data._id);
        setQuestions(resp.data.data.questions);
        setLoading(false);
      })
      .catch((error) => {
        console.log("error: ", error);
        setLoading("error");
      });
  }, [isLogin]);

  const deleteQuestion = (orderToDelete) => {
    setQuestions((prevQuestions) => {
      // Filter out the question with the given order
      const updatedQuestions = prevQuestions
        .filter((q) => q.order !== orderToDelete)
        .map((q, index) => ({
          ...q,
          order: index + 1, // Reassign sequential order to remaining questions
        }));
      return updatedQuestions;
    });
  };

  const addQuestion = (questionData) => {
    setQuestions([
      ...questions,
      { ...questionData, order: questions.length + 1 },
    ]);
  };

  const updateQuiz = () => {
    if (questions.length === 0) {
      alert("No questions added");
      return;
    }
    if (!topic) {
      alert("Quiz Topic Required!");
      return;
    }

    axios
      .put(`/api/data`, {
        _id: id,
        topic,
        questions,
        pass: "1234",
      })
      .then((resp) => {
        console.log(resp.data);
        alert("Updated sucessfully!!!");
      })
      .catch((error) => {
        console.log("data update error: ", error);
        alert("Something went wrong. Please try again later");
      });
  };

  if (isLogin)
    return (
      <div className="h-screen w-screen flex justify-center items-center rounded">
        <div className="bg-gray-50 p-6 rounded">
          <label>Password</label>
          <br />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="w-96 mt-2 mb-6 p-3 outline-0"
            placeholder="type here"
          />
          <br />
          <button
            onClick={() => {
              if (password === process.env.NEXT_PUBLIC_PASS) setIsLogin(false);
              else alert("Invalid Password");
            }}
            className="bg-blue-400 p-3 w-full rounded-md hover:bg-blue-500"
          >
            Login
          </button>
        </div>
      </div>
    );

  if (loading === "error") return "Something went wrong";

  if (loading) return "Loading...";

  return (
    <main className="pb-28">
      <div className="pt-10 px-12 flex items-center gap-6">
        <h1 className="text-2xl font-semibold">Quiz Topic</h1>
        <input
          className="bg-gray-50 flex-1 p-4 border outline-0 rounded-md"
          placeholder="Write Quiz Topic Here"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>
      <div className="px-12 py-10">
        {questions.length === 0 ? (
          <p className="text-center py-8">No questions added yet</p>
        ) : null}
        {questions.map((el, i) => (
          <div className={`bg-gray-50 p-6 mb-6 rounded-md relative`} key={i}>
            <button
              onClick={() => deleteQuestion(el.order)}
              className="absolute top-0 right-0 bg-red-500 rounded-sm text-white font-bold px-4 py-1"
            >
              Remove
            </button>
            <p className="text-xl font-semibold mb-4">
              {el.order}. {el.question}
            </p>
            <div className="grid grid-cols-2">
              {Object.keys(el.options).map((option) => (
                <button
                  className={`btn mt-2 text-left ${
                    option === el.correctAnswer
                      ? "font-semibold text-blue-600"
                      : ""
                  }`}
                  key={option}
                >
                  {option}. {el.options[option]}{" "}
                  {option === el.correctAnswer ? "(Correct)" : null}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <h1 className="font-semibold">Answer Explaination: </h1>
              <div
                className="mt-1"
                dangerouslySetInnerHTML={{ __html: el.explaination }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <AddQuetsionForm addQuestion={addQuestion} />
      <div className="fixed bottom-0 w-full bg-white border-t p-6 flex justify-end">
        <button
          disabled={questions.length === 0}
          className={`w-40 p-6 rounded-md shadow font-bold text-white ${
            questions.length ? "bg-blue-400" : "bg-gray-600"
          }`}
          onClick={updateQuiz}
        >
          Save Changes
        </button>
      </div>
    </main>
  );
};

export default AdminPanel;
