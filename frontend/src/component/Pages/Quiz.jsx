import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Quiz.css';

function Quiz() {
  const navigate = useNavigate();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);

  // Get quizzes from localStorage
  const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');

  const handleAddQuiz = () => {
    navigate('/admin/create-test');
  };

  const handleDelete = (id) => {
    const updatedQuizzes = quizzes.filter(quiz => quiz.id !== id);
    localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
    window.location.reload(); // Refresh to update the list
  };

  const handleDeleteAll = () => {
    localStorage.removeItem('quizzes');
    window.location.reload(); // Refresh to update the list
  };

  const handleEdit = (id) => {
    // Implement edit functionality
    console.log('Edit quiz:', id);
  };

  const handleViewQuestions = (quiz) => {
    setSelectedQuiz(quiz);
    setShowQuestionsModal(true);
  };

  const closeModal = () => {
    setShowQuestionsModal(false);
    setSelectedQuiz(null);
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
                    className="view-questions-btn"
                    onClick={() => handleViewQuestions(quiz)}
                  >
                    View Questions
                  </button>
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

      {/* Questions Modal */}
      {showQuestionsModal && selectedQuiz && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Questions for: {selectedQuiz.title}</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="questions-list">
              {selectedQuiz.questions.map((question, index) => (
                <div key={index} className="question-item">
                  <h3>Question {index + 1}: {question.question}</h3>
                  <div className="options">
                    {question.options.map((option, optIndex) => (
                      <div 
                        key={optIndex} 
                        className={`option ${question.correctAnswer === String.fromCharCode(65 + optIndex) ? 'correct' : ''}`}
                      >
                        {String.fromCharCode(65 + optIndex)}) {option}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;
