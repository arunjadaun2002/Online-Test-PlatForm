import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Quiz.css';

function Quiz() {
  const navigate = useNavigate();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/test/tests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quizzes');
      }

      const data = await response.json();
      console.log('Fetched quizzes data:', data); // Debug log

      if (data.success && data.data) {
        const formattedQuizzes = data.data.map(quiz => ({
          ...quiz,
          rightMarks: quiz.rightMarks || 0,
          timeInMinutes: quiz.timeInMinutes || 0,
          class: quiz.class || 'Not specified',
          description: quiz.description || 'No description'
        }));
        console.log('Formatted quizzes:', formattedQuizzes); // Debug log
        setQuizzes(formattedQuizzes);
      } else {
        throw new Error('Invalid response format');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAddQuiz = () => {
    navigate('/admin/create-test');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/admin/quizzes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete quiz');
      }

      // Refresh the quiz list
      fetchQuizzes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete all quizzes?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/admin/quizzes', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete all quizzes');
      }

      // Refresh the quiz list
      fetchQuizzes();
    } catch (err) {
      setError(err.message);
    }
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

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

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
              <th>Class</th>
              <th>Per Question Mark</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz, index) => (
              <tr key={quiz._id}>
                <td>{index + 1}</td>
                <td>{quiz.title}</td>
                <td>{quiz.description || 'No description'}</td>
                <td>{quiz.class || 'Not specified'}</td>
                <td>{quiz.rightMarks || 0}</td>
                <td>{quiz.timeInMinutes > 0 ? `${quiz.timeInMinutes} minutes` : 'Not specified'}</td>
                <td className="action-buttons">
                  <button 
                    className="view-questions-btn"
                    onClick={() => handleViewQuestions(quiz)}
                  >
                    View Questions
                  </button>
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(quiz._id)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(quiz._id)}
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
                        className={`option ${option === question.correctAnswer ? 'correct' : ''}`}
                      >
                        {String.fromCharCode(65 + optIndex)}) {option}
                      </div>
                    ))}
                  </div>
                  <div className="correct-answer">
                    <strong>Correct Answer:</strong> {question.correctAnswer}
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
