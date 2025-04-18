import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AttemptedTests.css';

const AttemptedTests = () => {
    const navigate = useNavigate();
    const [attemptedTests, setAttemptedTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAttemptedTests();
    }, []);

    const fetchAttemptedTests = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            console.log('Fetching attempted tests with token:', token);
            const response = await fetch('http://localhost:4000/api/student/attempted-tests', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch attempted tests');
            }

            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch attempted tests');
            }

            if (!Array.isArray(data.data)) {
                console.error('Invalid data format received:', data);
                throw new Error('Invalid data format received from server');
            }

            const validatedTests = data.data.map(test => {
                if (!test || !test.testId || !test.testId._id) {
                    console.error('Invalid test data:', test);
                    return null;
                }
                return {
                    id: test.testId._id.toString(),
                    submissionId: test._id.toString(),
                    title: test.testId.title,
                    totalQuestion: test.testId.totalQuestion,
                    rightMarks: test.testId.rightMarks,
                    class: test.testId.class,
                    attemptedAt: test.submittedAt,
                    score: test.totalMarks,
                    correctAnswers: test.correctAnswers,
                    wrongAnswers: test.wrongAnswers
                };
            }).filter(test => test !== null);

            console.log('Validated tests:', validatedTests);
            setAttemptedTests(validatedTests);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching attempted tests:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    const handleViewResult = (submissionId) => {
        console.log('Viewing result for submission ID:', submissionId);
        if (!submissionId) {
            console.error('Invalid submission ID provided');
            setError('Invalid submission ID');
            return;
        }
        console.log('Navigating to result page with submission ID:', submissionId);
        navigate(`/student/result/${submissionId}`);
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="attempted-tests-page">
            <div className="attempted-tests-header">
                <h1>Attempted Tests</h1>
            </div>

            <div className="attempted-tests-list">
                {attemptedTests.length === 0 ? (
                    <div className="no-tests">
                        <p>You haven't attempted any tests yet.</p>
                    </div>
                ) : (
                    <div className="test-cards">
                        {attemptedTests.map((test) => (
                            <div key={test.id} className="test-card">
                                <div className="test-info">
                                    <h3>{test.title}</h3>
                                    <div className="test-details">
                                        <p>Total Questions: {test.totalQuestion}</p>
                                        <p>Marks per Question: {test.rightMarks}</p>
                                        <p>Class: {test.class}</p>
                                        <p>Attempted On: {new Date(test.attemptedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="test-meta">
                                    <span className="score-tag">
                                        Score: {test.score || 'Not evaluated yet'}
                                    </span>
                                    <button 
                                        className="view-result-btn"
                                        onClick={() => handleViewResult(test.submissionId)}
                                    >
                                        View Result
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttemptedTests; 