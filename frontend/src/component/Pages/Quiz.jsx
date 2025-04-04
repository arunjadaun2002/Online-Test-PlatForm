import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Quiz.css';
import { useQuizzes } from './QuizContext'; // Import the context

function Quiz() {
  const navigate = useNavigate();
  const { quizzes, deleteQuiz, deleteAllQuizzes } = useQuizzes(); // Get data and functions from context

  const handleAddQuiz = () => {
    navigate('/create-test');
  };

  const handleDelete = (id) => {
    deleteQuiz(id);
  };

  const handleDeleteAll = () => {
    deleteAllQuizzes();
  };

  const handleEdit = (id) => {
    // Implement edit functionality
    console.log('Edit quiz:', id);
  };

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="action-buttons">
          <button className="add-quiz-btn" onClick={handleAddQuiz}>
            Add Quiz
          </button>
          <button className="delete-all-btn" onClick={handleDeleteAll}>
            Delete All
          </button>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search ..." />
        </div>
      </div>

      <div className="quiz-table">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Quiz Title</th>
              <th>Description</th>
              <th>Per Question Mark</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz, index) => (
              <tr key={quiz.id}>
                <td>{index + 1}</td>
                <td>{quiz.title}</td>
                <td>{quiz.description}</td>
                <td>{quiz.perQuestionMark}</td>
                <td>{quiz.time}</td>
                <td className="action-buttons">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(quiz.id)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(quiz.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Quiz;
