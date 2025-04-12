import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Result.css';

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchResultData();
    }, []);

    const fetchResultData = async () => {
        try {
            const token = localStorage.getItem('token');
            const testId = location.state?.testId;

            if (!testId) {
                throw new Error('No test data found');
            }

            const response = await fetch(`http://localhost:4000/api/student/results/${testId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch result data');
            }

            const data = await response.json();
            setResult(data.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching result:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading results...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (!result) return <div className="error">No result data found</div>;

    const calculateTotalMarks = () => {
        return result.questions.reduce((total, q) => {
            return total + (q.isCorrect ? result.rightMarks : (result.negativeMarks || 0));
        }, 0);
    };

    const totalMarks = calculateTotalMarks();
    const totalQuestions = result.questions.length;
    const correctAnswers = result.questions.filter(q => q.isCorrect).length;
    const wrongAnswers = totalQuestions - correctAnswers;

    return (
        <div className="result-page">
            <div className="result-header">
                <h1>Test Results</h1>
                <button className="back-btn" onClick={() => navigate('/student/attempt')}>
                    Back to Tests
                </button>
            </div>

            <div className="result-summary">
                <div className="summary-card">
                    <h3>Test Summary</h3>
                    <div className="summary-details">
                        <div className="summary-item">
                            <span className="label">Test Title:</span>
                            <span className="value">{result.testTitle}</span>
                        </div>
                        <div className="summary-item">
                            <span className="label">Total Questions:</span>
                            <span className="value">{totalQuestions}</span>
                        </div>
                        <div className="summary-item">
                            <span className="label">Correct Answers:</span>
                            <span className="value correct">{correctAnswers}</span>
                        </div>
                        <div className="summary-item">
                            <span className="label">Wrong Answers:</span>
                            <span className="value wrong">{wrongAnswers}</span>
                        </div>
                        <div className="summary-item">
                            <span className="label">Total Marks:</span>
                            <span className="value marks">{totalMarks}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="detailed-results">
                <h2>Detailed Results</h2>
                <div className="questions-list">
                    {result.questions.map((question, index) => (
                        <div key={index} className={`question-result ${question.isCorrect ? 'correct' : 'wrong'}`}>
                            <div className="question-header">
                                <h3>Question {index + 1}</h3>
                                <span className={`status ${question.isCorrect ? 'correct' : 'wrong'}`}>
                                    {question.isCorrect ? 'Correct' : 'Wrong'}
                                </span>
                            </div>
                            <div className="question-content">
                                <p>{question.questionText}</p>
                                <div className="options">
                                    {question.options.map((option, optIndex) => (
                                        <div 
                                            key={optIndex} 
                                            className={`option ${optIndex === question.correctAnswer ? 'correct-answer' : ''} 
                                                      ${optIndex === question.selectedAnswer ? 'selected-answer' : ''}`}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="marks-info">
                                <span>Marks Obtained: {question.isCorrect ? result.rightMarks : (result.negativeMarks || 0)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Result;
