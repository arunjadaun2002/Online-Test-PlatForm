import React from 'react';
import './Attempt.css';

const Attempt = () => {
    // Mock data for available tests
    const availableTests = [
        {
            id: 1,
            name: "Test On 66 KV",
            course: "Science",
            startTime: "Mar 28 2025 9:00AM",
            endTime: "Mar 28 2025 5:00PM",
            duration: "60 minutes"
        },
        {
            id: 2,
            name: "Test On DSA",
            course: "Computer Science",
            startTime: "Mar 29 2025 10:00AM",
            endTime: "Mar 29 2025 6:00PM",
            duration: "45 minutes"
        },
        {
            id: 3,
            name: "Test On JavaScript",
            course: "Web Development",
            startTime: "Mar 30 2025 9:00AM",
            endTime: "Mar 30 2025 5:00PM",
            duration: "90 minutes"
        }
    ];

    return (
        <div className="attempt-page">
            <div className="attempt-header">
                <h1>Available Test:</h1>
                <div className="search-container">
                    <h2>Search Test :</h2>
                    <div className="search-box">
                        <input 
                            type="text" 
                            placeholder="Search" 
                            className="search-input"
                        />
                        <button className="clear-search">×</button>
                    </div>
                </div>
            </div>

            <div className="test-list">
                <h2>Select Test :</h2>
                <div className="test-cards">
                    {availableTests.map((test) => (
                        <div key={test.id} className="test-card">
                            <div className="test-info">
                                <h3>{test.name}</h3>
                                <div className="test-details">
                                    <p>Start: {test.startTime}</p>
                                    <p>End: {test.endTime}</p>
                                    <p>Duration: {test.duration}</p>
                                </div>
                            </div>
                            <div className="test-meta">
                                <span className="course-tag">Course: {test.course}</span>
                                <button className="start-test-btn">Start Test</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Attempt; 