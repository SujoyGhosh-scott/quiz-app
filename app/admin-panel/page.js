"use client";

import axios from "axios";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
// import AddQuetsionForm from "../components/AddQuetsionForm";
const AddQuetsionForm = dynamic(() => import("../components/AddQuetsionForm"), {
  ssr: false,
});

export default function AdminPanelPage() {
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [password, setPassword] = useState("");
  const [topic, setTopic] = useState("");
  const [id, setId] = useState("");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (isLogin) return;

    axios
      .get(`/api/data`, {
        params: { _t: Date.now() }, // Adding a unique timestamp
      })
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
      .post(`/api/data`, {
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
}
