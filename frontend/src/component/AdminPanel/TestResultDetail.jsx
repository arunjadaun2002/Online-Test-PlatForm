import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './TestResultDetail.css';

const API_BASE_URL = 'http://localhost:4000';

const TestResultDetail = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { resultId } = useParams();

  useEffect(() => {
    fetchTestResult();
  }, [resultId]);

  const fetchTestResult = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/admin/test-result/${resultId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error fetching test result:', error);
      setError('Failed to fetch test result details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-message">Loading test result details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!result) {
    return <div className="no-data-message">No result found</div>;
  }

  return (
    <div className="test-result-detail">
      <div className="result-header">
        <h2>{result.testId?.title || 'Test Result'}</h2>
        <div className="score-badge">
          Score: {result.totalMarks}
        </div>
      </div>

      <div className="result-sections">
        {/* Overview Section */}
        <section className="result-section">
          <h3>Overview</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Total Questions</label>
              <span>{result.totalQuestions}</span>
            </div>
            <div className="info-item">
              <label>Correct Answers</label>
              <span className="correct">{result.correctAnswers}</span>
            </div>
            <div className="info-item">
              <label>Wrong Answers</label>
              <span className="wrong">{result.wrongAnswers}</span>
            </div>
            <div className="info-item">
              <label>Percentage</label>
              <span className={result.percentage >= 50 ? 'pass' : 'fail'}>
                {result.percentage}%
              </span>
            </div>
          </div>
        </section>

        {/* Test Details Section */}
        <section className="result-section">
          <h3>Test Details</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Duration</label>
              <span>{Math.floor(result.testDuration / 60)}m {result.testDuration % 60}s</span>
            </div>
            <div className="info-item">
              <label>Tab Switches</label>
              <span className={result.tabSwitchCount > 0 ? 'warning' : 'good'}>
                {result.tabSwitchCount}
              </span>
            </div>
            <div className="info-item">
              <label>Submitted At</label>
              <span>{new Date(result.submittedAt).toLocaleString()}</span>
            </div>
            <div className="info-item">
              <label>Test Status</label>
              <span className={result.percentage >= 50 ? 'pass' : 'fail'}>
                {result.percentage >= 50 ? 'Passed' : 'Failed'}
              </span>
            </div>
          </div>
        </section>

        {/* Answers Section */}
        {result.answers && (
          <section className="result-section">
            <h3>Question-wise Analysis</h3>
            <div className="answers-list">
              {Object.entries(result.answers).map(([questionNumber, answer], index) => (
                <div key={questionNumber} className="answer-item">
                  <div className="question-number">Q{parseInt(questionNumber) + 1}</div>
                  <div className="answer-details">
                    <p><strong>Selected Answer:</strong> {answer.selectedOption}</p>
                    <p><strong>Correct Answer:</strong> {answer.correctOption}</p>
                    <p className={answer.isCorrect ? 'correct' : 'wrong'}>
                      {answer.isCorrect ? '✓ Correct' : '✗ Wrong'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default TestResultDetail; 