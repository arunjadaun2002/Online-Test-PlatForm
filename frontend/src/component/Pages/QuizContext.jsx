// 📁 Pages/QuizContext.js

import React, { createContext, useContext, useState } from 'react';

const QuizContext = createContext();

export function QuizProvider({ children }) {
  const [quizzes, setQuizzes] = useState([
    {
      id: 1,
      title: "Demo Quiz",
      description: "This is Demo Test",
      perQuestionMark: 5,
      time: 30
    },
    {
      id: 2,
      title: "Java Test",
      description: "Java test",
      perQuestionMark: 10,
      time: 60
    },
    {
      id: 3,
      title: "Programming Test",
      description: "C/C++ Test",
      perQuestionMark: 20,
      time: 90
    }
  ]);

  const addQuiz = (newQuiz) => {
    setQuizzes(prev => [...prev, { ...newQuiz, id: Date.now() }]);
  };

  const deleteQuiz = (id) => {
    setQuizzes(prev => prev.filter(quiz => quiz.id !== id));
  };

  const deleteAllQuizzes = () => {
    setQuizzes([]);
  };

  const editQuiz = (id, updatedQuiz) => {
    setQuizzes(prev => prev.map(quiz =>
      quiz.id === id ? { ...quiz, ...updatedQuiz } : quiz
    ));
  };

  return (
    <QuizContext.Provider value={{
      quizzes,
      addQuiz,
      deleteQuiz,
      deleteAllQuizzes,
      editQuiz
    }}>
      {children}
    </QuizContext.Provider>
  );
}

// Custom hook to access QuizContext
export function useQuizzes() {
  return useContext(QuizContext);
}
