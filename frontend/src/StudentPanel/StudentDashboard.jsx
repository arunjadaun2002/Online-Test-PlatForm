import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';

const StudentDashboard = () => {
    const [allTests, setAllTests] = useState([]);
    const [attemptedTests, setAttemptedTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTests();
        fetchAttemptedTests();
    }, []);

    const fetchTests = async () => {
        try {
            const token = localStorage.getItem('token');
            const studentInfo = JSON.parse(localStorage.getItem('user'));
            if (!studentInfo) {
                throw new Error('Student information not found');
            }

            const response = await fetch('http://localhost:4000/api/student/tests', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch tests');
            }

            const data = await response.json();
            console.log('Fetched tests:', data); // Debug log
            if (data.success) {
                setAllTests(data.data || []);
            } else {
                setAllTests([]);
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching tests:', err);
            setError(err.message);
            setAllTests([]); // Set empty array on error
            setLoading(false);
        }
    };

    const fetchAttemptedTests = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/student/attempted-tests', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch attempted tests');
            }
            const data = await response.json();
            console.log('Fetched attempted tests:', data); // Debug log
            if (data.success) {
                const formattedTests = data.data.map(submission => ({
                    _id: submission.testId?._id,
                    title: submission.testId?.title || 'Untitled Test',
                    totalQuestion: submission.testId?.totalQuestion,
                    rightMarks: submission.testId?.rightMarks,
                    class: submission.testId?.class,
                    submittedAt: submission.submittedAt,
                    totalMarks: submission.totalMarks,
                    correctAnswers: submission.correctAnswers,
                    wrongAnswers: submission.wrongAnswers
                }));
                setAttemptedTests(formattedTests);
            } else {
                setAttemptedTests([]);
            }
        } catch (err) {
            console.error('Error fetching attempted tests:', err);
            setAttemptedTests([]); // Set empty array on error
        }
    };

    const handleStartTest = (testId) => {
        navigate(`/student/test-instructions/${testId}`);
    };

    if (loading) {
        return <div className="loading">Loading tests...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="content-wrapper">
                {/* Banner Image */}
                <div className="banner">
                    <img src="/assets/images/onlinetest.jpg" alt="Online Test Banner" />
                </div>

                {/* Test Sections */}
                <div className="test-sections">
                    {/* Today's Tests Section */}
                    <div className="test-section todays-tests">
                        <div className="section-header">
                            <span className="icon">📝</span>
                            <h2>Today's Tests</h2>
                        </div>
                        <div className="test-list">
                            {!Array.isArray(allTests) || allTests.length === 0 ? (
                                <div className="no-tests">No tests available</div>
                            ) : (
                                allTests.map((test, index) => (
                                    <div key={test._id || index} className="test-item">
                                        <span className="test-name">
                                            {index + 1}. {test.title || 'Untitled Test'}
                                        </span>
                                        <button 
                                            className="start-test"
                                            onClick={() => handleStartTest(test._id)}
                                        >
                                            <span className="arrow">→</span>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Recently Attempted Tests Section */}
                    <div className="test-section attempted-tests">
                        <div className="section-header">
                            <span className="icon">✓</span>
                            <h2>Recently Attempted Tests</h2>
                        </div>
                        <div className="test-list">
                            {!Array.isArray(attemptedTests) || attemptedTests.length === 0 ? (
                                <div className="no-tests">No attempted tests yet</div>
                            ) : (
                                attemptedTests.map((test, index) => (
                                    <div key={test._id || index} className="test-item">
                                        <span className="test-name">
                                            {index + 1}. {test.title || 'Untitled Test'}
                                        </span>
                                        <span className="completed-icon">✓</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;