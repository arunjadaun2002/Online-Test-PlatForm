import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Attempt.css';

const Attempt = () => {
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studentClass, setStudentClass] = useState(null);

    useEffect(() => {
        fetchStudentData();
    }, []);

    const fetchStudentData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/student/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch student data');
            }

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch student data');
            }

            const studentClass = data.data.class;
            setStudentClass(studentClass);
            fetchTests(studentClass);
        } catch (err) {
            console.error('Error fetching student data:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    const fetchTests = async (studentClass) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:4000/api/student/tests`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch tests');
            }

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch tests');
            }

            setTests(data.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching tests:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    const handleStartTest = (testId) => {
        console.log('Navigating to instructions with test ID:', testId);
        navigate(`/student/test-instructions/${testId}`);
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="attempt-page">
            <div className="attempt-header">
                <h1>Available Tests for Class {studentClass}</h1>
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
                    {tests.length === 0 ? (
                        <div className="no-tests">
                            <p>No tests available for your class at the moment.</p>
                        </div>
                    ) : (
                        tests.map((test) => (
                            <div key={test._id} className="test-card">
                                <div className="test-info">
                                    <h3>{test.title}</h3>
                                    <div className="test-details">
                                        <p>Total Questions: {test.totalQuestion}</p>
                                        <p>Marks per Question: {test.rightMarks}</p>
                                        <p>Class: {test.class}</p>
                                    </div>
                                </div>
                                <div className="test-meta">
                                    <span className="course-tag">Subject: {test.subject || 'General'}</span>
                                    <button 
                                        className="start-test-btn"
                                        onClick={() => handleStartTest(test._id)}
                                    >
                                        Start Test
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Attempt; 