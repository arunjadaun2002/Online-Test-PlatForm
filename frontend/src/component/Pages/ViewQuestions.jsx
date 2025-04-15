import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ViewQuestions.css';

const ViewQuestions = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTestData();
  }, [testId]);

  const fetchTestData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/test/${testId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch test data');
      }

      const data = await response.json();
      setTest(data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!test) return <div className="error">Test not found</div>;

  return (
    <div className="view-questions-container">
      <div className="test-header">
        <h1>{test.title}</h1>
        <button className="back-btn" onClick={() => navigate('/admin/quiz')}>
          Back to Tests
        </button>
      </div>

      <div className="test-info">
        <p><strong>Description:</strong> {test.description}</p>
        <p><strong>Total Questions:</strong> {test.totalQuestion}</p>
        <p><strong>Marks per Question:</strong> {test.rightMarks}</p>
        <p><strong>Class:</strong> {test.class}</p>
        <p><strong>Time:</strong> {test.timeInMinutes} minutes</p>
      </div>

      <div className="questions-list">
        {test.questions.map((question, index) => (
          <div key={index} className="question-card">
            <h3>Question {index + 1}</h3>
            <p className="question-text">{question.question}</p>
            <div className="options-list">
              {question.options.map((option, optIndex) => (
                <div
                  key={optIndex}
                  className={`option ${option === question.correctAnswer ? 'correct-option' : ''}`}
                >
                  <span className="option-label">
                    {String.fromCharCode(65 + optIndex)})
                  </span>
                  <span className="option-text">{option}</span>
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
  );
};

export default ViewQuestions; 