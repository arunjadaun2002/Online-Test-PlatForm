import React from 'react';
import './StudentDashboard.css';

const StudentDashboard = () => {
    // Mock data for tests
    const todaysTests = [
        { id: 1, name: "C++" },
        { id: 2, name: "DSA" },
        { id: 3, name: "Ancient India 2" },
        { id: 4, name: "CLOUD" },
        { id: 5, name: "Ancient India 3" }
    ];

    const attemptedTests = [
        { id: 1, name: "Ancient India 1" },
        { id: 2, name: "MATH" },
        { id: 3, name: "JAVA" },
        { id: 4, name: "PROGRAMMING" },
        { id: 5, name: "Ancient India 8" }
    ];

    return (
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
                        {todaysTests.map((test, index) => (
                            <div key={test.id} className="test-item">
                                <span className="test-name">
                                    {index + 1}. {test.name}
                                </span>
                                <button className="start-test">
                                    <span className="arrow">→</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recently Attempted Tests Section */}
                <div className="test-section attempted-tests">
                    <div className="section-header">
                        <span className="icon">✓</span>
                        <h2>Recently Attempted Tests</h2>
                    </div>
                    <div className="test-list">
                        {attemptedTests.map((test, index) => (
                            <div key={test.id} className="test-item">
                                <span className="test-name">
                                    {index + 1}. {test.name}
                                </span>
                                <span className="completed-icon">✓</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;