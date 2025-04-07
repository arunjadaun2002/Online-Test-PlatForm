import React from 'react';
import './Result.css';

const Result = () => {
    // Mock data for attempted tests - replace with actual API data later
    const attemptedTests = [
        {
            id: 1,
            title: "JavaScript Fundamentals",
            date: "2024-03-15",
            duration: "60 minutes",
            totalQuestions: 30,
            score: 85,
            status: "Completed"
        },
        {
            id: 2,
            title: "React Components and Props",
            date: "2024-03-14",
            duration: "45 minutes",
            totalQuestions: 25,
            score: 92,
            status: "Completed"
        },
        {
            id: 3,
            title: "CSS Grid and Flexbox",
            date: "2024-03-13",
            duration: "30 minutes",
            totalQuestions: 20,
            score: 78,
            status: "Completed"
        }
    ];

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="result-page">
            <div className="result-header">
                <h1>Your Test Results</h1>
            </div>

            <div className="result-container">
                <h2>Recently Attempted Tests</h2>
                <div className="result-cards">
                    {attemptedTests.map((test) => (
                        <div key={test.id} className="result-card">
                            <div className="test-info">
                                <h3>{test.title}</h3>
                                <div className="test-details">
                                    <p><strong>Date:</strong> {formatDate(test.date)}</p>
                                    <p><strong>Duration:</strong> {test.duration}</p>
                                    <p><strong>Total Questions:</strong> {test.totalQuestions}</p>
                                    <p><strong>Status:</strong> {test.status}</p>
                                </div>
                            </div>
                            <div className="result-meta">
                                <div className="score-tag">
                                    Score: {test.score}%
                                </div>
                                <button className="view-result-btn">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Result;
