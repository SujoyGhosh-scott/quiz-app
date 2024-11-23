const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  topic: String,
  questions: [
    {
      order: Number,
      question: String,
      options: {
        A: String,
        B: String,
        C: String,
        D: String,
      },
      correctAnswer: { type: String, enum: ["A", "B", "C", "D"] },
      explaination: String,
      image: String,
    },
  ],
});

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
