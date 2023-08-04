import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { currentQuestionType, IQuestions, optionsType } from "./Types";

const App: React.FC = () => {
  // вопросы
  const [questions, setQuestions] = useState<IQuestions[]>([]);
  // порядковый номер ответа
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  // варианты ответов
  const [selectedOptions, setSelectedOptions] = useState<optionsType>([]);
  // процент верных ответов
  const [resultScore, setResultScore] = useState<any>({});
  // таймер
  const [timer, setTimer] = useState<number>(180);
  // показать результат
  const [showResult, setShowResult] = useState<boolean>(false);
  // показать таймер
  const [showTimer, setShowTimer] = useState<boolean>(false);


  // получение данных и обновление стейтов
  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:3003/questions');
      setQuestions(response.data);
      setSelectedOptions([]);
      setCurrentQuestion(0);
      setShowTimer(true);
      setShowResult(false);
      setResultScore(null);
      setTimer(180);
      startTimer();
    } catch (error) {
      console.error(error);
    }
  };

  // отправка правильных ответов
  const submitAnswers = useCallback(async () => {
    try {
      const response = await axios.post('http://localhost:3003/submit', {
        answers: selectedOptions,
      });
      setShowResult(true);
      setShowTimer(false);
      stopTimer();
      setResultScore(response.data);

    } catch (error) {
      console.error(error);
    }
  }, [selectedOptions])

  // массив с ответами
  const handleOptionSelect = (option: string) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestion] = option;
    setSelectedOptions(newSelectedOptions);
  };

  // переход на след вопрос
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  // переход на пред вопрос
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);
    return () => clearInterval(interval);
  };

  const stopTimer = () => {
    setTimer(0);
  };

  useEffect(() => {
    if (timer === 0 && !showResult) {
      submitAnswers();
    }
  }, [timer, showResult, submitAnswers]);

  return (
    <div>
      <h1>Тест</h1>
      {!showResult ?
        <div>
          {showTimer
            ? <>
              <h2>Осталось времени: {Math.floor(timer / 60)}:{timer % 60 < 10 ? "0" : ""}{timer % 60}</h2>
              <h2>Вопрос {currentQuestion + 1}</h2>
            </>
            : null
          }
          <p>{questions[currentQuestion]?.question}</p>
          {questions[currentQuestion]?.options.map((option: string, index: number) => (
            <div key={index}>
              <input
                type="radio"
                id={option}
                name="option"
                value={option}
                checked={selectedOptions[currentQuestion] === option}
                onChange={() => handleOptionSelect(option)}
              />
              <label htmlFor={option}>{option}</label>
            </div>
          ))}
        </div>
        :
        <div>
          <h2>Результат</h2>
          <p>Вы ответили правильно на {resultScore.percentage}% вопросов.</p>
          <ul>
            {resultScore.result.map((question: currentQuestionType) => {
              if (!question.isCorrect) {
                return (
                  <li>
                    {question.question} -
                    правильный ответ '{question.correctOption}'
                  </li>
                )
              }
            })}
          </ul>
        </div>
      }
      <br />
      {!showTimer ?
        <button onClick={fetchQuestions}>Начать тест</button>
        :
        <>
          <button onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
            Предыдущий
          </button>
          <button onClick={handleNextQuestion} disabled={currentQuestion === questions.length - 1}>
            Следующий
          </button>
          <button onClick={submitAnswers}>Завершить тест</button>
        </>
      }
    </div>
  );
};

export default App;
