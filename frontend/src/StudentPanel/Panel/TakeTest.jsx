import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './TakeTest.css';

const TakeTest = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [markedForReview, setMarkedForReview] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [remainingTime, setRemainingTime] = useState(null);

    useEffect(() => {
        fetchTestData();
    }, [testId]);

    useEffect(() => {
        if (remainingTime !== null && remainingTime > 0) {
            const timer = setInterval(() => {
                setRemainingTime(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleSubmitTest();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [remainingTime]);

    const fetchTestData = async () => {
        try {
            console.log('Fetching test with ID:', testId); // Debug log
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`http://localhost:4000/api/student/tests/${testId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch test data');
            }

            const data = await response.json();
            console.log('Received test data:', data); // Debug log

            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch test data');
            }

            if (!data.data.questions || !Array.isArray(data.data.questions)) {
                throw new Error('Invalid test data format');
            }

            setTest(data.data);
            // Convert duration to seconds if it exists, otherwise use a default duration
            const duration = data.data.totalTime || 180; // Default to 180 minutes if not specified
            setRemainingTime(duration * 60);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching test:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionIndex, selectedOption) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: selectedOption
        }));
    };

    const handleMarkForReview = () => {
        if (!markedForReview.includes(currentQuestion)) {
            setMarkedForReview(prev => [...prev, currentQuestion]);
        } else {
            setMarkedForReview(prev => prev.filter(q => q !== currentQuestion));
        }
    };

    const handleClearResponse = () => {
        setAnswers(prev => {
            const newAnswers = { ...prev };
            delete newAnswers[currentQuestion];
            return newAnswers;
        });
    };

    const handleSaveAndNext = () => {
        if (currentQuestion < test.questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const handleSubmitTest = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:4000/api/test/${testId}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ answers })
            });

            if (!response.ok) {
                throw new Error('Failed to submit test');
            }

            navigate('/student/attempted');
        } catch (err) {
            console.error('Error submitting test:', err);
            setError(err.message);
        }
    };

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const getQuestionStatus = (index) => {
        if (markedForReview.includes(index)) {
            return answers[index] ? 'answered-marked' : 'marked-review';
        }
        if (answers[index]) return 'answered';
        if (index === currentQuestion) return 'current';
        return 'not-answered';
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (!test) return <div className="error">Test not found</div>;

    return (
        <div className="take-test-page">
            <div className="test-header">
                <h1>{test.title}</h1>
                <div className="test-info">
                    <div className="timer">
                        Remaining Time: {formatTime(remainingTime)}
                    </div>
                    <button className="report-error">Report An Error</button>
                </div>
            </div>

            <div className="test-content">
                <div className="question-section">
                    <div className="question-header">
                        <h2>Question {currentQuestion + 1}</h2>
                        <div className="marks-info">
                            <span>Marks for Correct Response: {test.rightMarks}</span>
                            <span>Negative Marking: {test.negativeMarks || 0}</span>
                        </div>
                    </div>

                    <div className="question-content">
                        <p>{test.questions[currentQuestion].question}</p>
                        <div className="options-list">
                            {test.questions[currentQuestion].options.map((option, index) => (
                                <div 
                                    key={index} 
                                    className={`option ${answers[currentQuestion] === index ? 'selected' : ''}`}
                                    onClick={() => handleAnswerSelect(currentQuestion, index)}
                                >
                                    <input 
                                        type="radio" 
                                        checked={answers[currentQuestion] === index}
                                        onChange={() => handleAnswerSelect(currentQuestion, index)}
                                    />
                                    <label>{option}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="question-actions">
                        <button 
                            className="mark-review-btn"
                            onClick={handleMarkForReview}
                        >
                            Mark For Review & Next
                        </button>
                        <button 
                            className="clear-response-btn"
                            onClick={handleClearResponse}
                        >
                            Clear Response
                        </button>
                        <button 
                            className="save-next-btn"
                            onClick={handleSaveAndNext}
                        >
                            Save & Next
                        </button>
                        <button 
                            className="submit-btn"
                            onClick={handleSubmitTest}
                        >
                            Submit
                        </button>
                    </div>
                </div>

                <div className="question-palette">
                    <div className="palette-header">
                        <h3>Choose a Question</h3>
                    </div>
                    <div className="question-grid">
                        {test.questions.map((_, index) => (
                            <button
                                key={index}
                                className={`question-number ${getQuestionStatus(index)}`}
                                onClick={() => setCurrentQuestion(index)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                    <div className="legend">
                        <div className="legend-item">
                            <span className="status-dot not-visited"></span>
                            <p>Not Visited</p>
                        </div>
                        <div className="legend-item">
                            <span className="status-dot not-answered"></span>
                            <p>Not Answered</p>
                        </div>
                        <div className="legend-item">
                            <span className="status-dot answered"></span>
                            <p>Answered</p>
                        </div>
                        <div className="legend-item">
                            <span className="status-dot marked-review"></span>
                            <p>Marked for Review</p>
                        </div>
                        <div className="legend-item">
                            <span className="status-dot answered-marked"></span>
                            <p>Answered & Marked for Review</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TakeTest; 