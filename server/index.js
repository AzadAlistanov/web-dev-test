const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// получаем данные JSON 
const questions = require("./data/data-questions.json");

// роут получения вопросов
app.get('/questions', (req, res) => {
  res.json(questions);
});

// роут отправки ответов
app.post('/submit', (req, res) => {
  const { answers } = req.body;
  const result = calculateResult(questions, answers);
  res.json(result);
});

// подсчет процента правильных ответов
const calculateResult = (questions, answers) => {
  let correctAnswers = 0;
  const result = [];
  questions.forEach((question, index) => {
    const isCorrect = question.answer === answers[index];
    result.push({
      question: question.question,
      selectedOption: answers[index],
      correctOption: question.answer,
      isCorrect: isCorrect,
    });
    if (isCorrect) correctAnswers++;
  });

  return {
    totalQuestions: questions.length,
    correctAnswers: correctAnswers,
    percentage: ((correctAnswers / questions.length) * 100).toFixed(),
    result: result,
  };
};

const APP_PORT = 3003;
app.listen(APP_PORT, () => {
  console.log(`Сервер запущен, http://localhost:${APP_PORT}`);
});







