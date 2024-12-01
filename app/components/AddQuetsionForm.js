"use client";

import React, { useState } from "react";
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
  const [image, setImage] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please choose a file to upload.");
      return;
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > 5) {
      alert("File size should be less than 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log("data: ", data);

      if (data.success) {
        console.log("setting: ", data.imgUrl.url);
        setImage(data.imgUrl.url);
      } else {
        alert("Failed to upload file. Please try again.");
      }
    } catch (error) {
      console.log("image upload error: ", error);
      alert("Something went wrong! Please try again later.");
    } finally {
      setUploading(false);
    }
  };

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
      image,
    };

    addQuestion(questionData);

    setQuestion("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setImage("");
    setFile(null);
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
      <label className="w-full">
        <div className="label">
          <span className="label-text">
            Question Image (To insert image in question select the file and
            upload)
          </span>
        </div>
        <input
          type="file"
          className="file-input file-input-bordered w-full max-w-xs"
          accept="image/png, image/jpg, image/jpeg"
          onChange={handleFileChange}
        />
        <button onClick={handleUpload} className="bg-green-300 px-4 py-2">
          Upload Image
        </button>
      </label>
      <div className="flex mb-6">
        <input
          className="py-2 px-4 flex-1 outline-none"
          readOnly
          value={
            uploading
              ? "Uploading image. Please wait..."
              : image
              ? `Image uploaded: ${image}`
              : "No image uploaded"
          }
        />
        <button
          onClick={() => {
            setImage("");
            setFile(null);
          }}
          className="bg-red-400 px-4 py-2"
        >
          Remove Image
        </button>
      </div>
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

export default AddQuetsionForm;
