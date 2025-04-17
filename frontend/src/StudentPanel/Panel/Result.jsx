import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Result.css';

const Result = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchResult();
    }, [testId]);

    const fetchResult = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            console.log('Fetching result for submission ID:', testId);

            const response = await fetch(`http://localhost:4000/api/student/tests/${testId}/result`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch result');
            }

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch result');
            }

            console.log('Received result data:', data.data);
            setResult(data.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching result:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    const handleBackToTests = () => {
        navigate('/student/tests');
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (!result) return <div className="error">No result found</div>;

    return (
        <div className="result-page">
            <div className="result-header">
                <h1>Test Results</h1>
                <button className="back-button" onClick={handleBackToTests}>
                    Back to Tests
                </button>
            </div>

            <div className="result-container">
                <div className="test-summary">
                    <h2>Test Summary</h2>
                    <div className="summary-item">
                        <label>Test Title:</label>
                        <span>{result.testTitle}</span>
                    </div>
                    <div className="summary-item">
                        <label>Total Questions:</label>
                        <span>{result.totalQuestions}</span>
                    </div>
                    <div className="summary-item">
                        <label>Correct Answers:</label>
                        <span className="correct">{result.correctAnswers}</span>
                    </div>
                    <div className="summary-item">
                        <label>Wrong Answers:</label>
                        <span className="wrong">{result.wrongAnswers}</span>
                    </div>
                    <div className="summary-item">
                        <label>Total Marks:</label>
                        <span>{result.totalMarks}</span>
                    </div>
                    <div className="summary-item">
                        <label>Percentage:</label>
                        <span className="percentage">{result.percentage}%</span>
                    </div>
                </div>

                <div className="detailed-results">
                    <h2>Detailed Results</h2>
                    {result.questionResults.map((question, index) => (
                        <div key={index} className={`question-card ${question.isCorrect ? 'correct' : 'incorrect'}`}>
                            <div className="question-header">
                                <h3>Question {index + 1}</h3>
                                <span className={`status ${question.isCorrect ? 'correct' : 'incorrect'}`}>
                                    {question.isCorrect ? 'Correct' : 'Incorrect'}
                                </span>
                            </div>
                            <p className="question-text">{question.question}</p>
                            <div className="options">
                                {question.options.map((option, optIndex) => (
                                    <div 
                                        key={optIndex} 
                                        className={`option ${
                                            option === question.correctAnswer ? 'correct-answer' : ''
                                        } ${
                                            option === question.studentAnswer && !question.isCorrect ? 'wrong-answer' : ''
                                        }`}
                                    >
                                        <span className="option-label">
                                            {String.fromCharCode(65 + optIndex)})
                                        </span>
                                        <span className="option-text">{option}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="marks-info">
                                <span>Marks obtained: {question.marksObtained}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Result;