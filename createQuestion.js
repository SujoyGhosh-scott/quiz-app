const mongoose = require("mongoose");
const Quiz = require("./models/quiz");

const createQuestion = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/quizapp", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB!");
    const quiz = new Quiz({
      topic: "Test topic",
      questions: [
        {
          order: 1,
          question: "What is the capital of France?",
          options: {
            A: "Berlin",
            B: "Madrid",
            C: "Paris",
            D: "Rome",
          },
          correctAnswer: "C",
          explaination: "explaination 1",
        },
        {
          order: 2,
          question: "Which planet is known as the Red Planet?",
          options: {
            A: "Earth",
            B: "Mars",
            C: "Jupiter",
            D: "Venus",
          },
          correctAnswer: "B",
          explaination: "explaination 2",
        },
      ],
    });

    await quiz.save();
  } catch (error) {
    console.error("Error creating:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

createQuestion();
