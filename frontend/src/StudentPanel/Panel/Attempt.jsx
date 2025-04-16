import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Attempt.css';

const Attempt = () => {
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studentClass, setStudentClass] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredTests, setFilteredTests] = useState([]);

    useEffect(() => {
        fetchStudentData();
    }, []);

    useEffect(() => {
        // Filter tests whenever searchQuery or tests change
        const filtered = tests.filter(test => 
            test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            test.subject?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredTests(filtered);
    }, [searchQuery, tests]);

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
            setFilteredTests(data.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching tests:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    const handleStartTest = (testId) => {
        console.log('Navigating to instructions with test ID:', testId);
        navigate(`/student/test-instructions/${testId}`);
    };

    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minute${mins !== 1 ? 's' : ''}`;
        }
        return `${mins} minute${mins !== 1 ? 's' : ''}`;
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
                            placeholder="Search by test title or subject..." 
                            className="search-input"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        {searchQuery && (
                            <button 
                                className="clear-search"
                                onClick={clearSearch}
                                aria-label="Clear search"
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="test-list">
                <h2>Select Test :</h2>
                <div className="test-cards">
                    {filteredTests.length === 0 ? (
                        <div className="no-tests">
                            <p>No tests found matching your search.</p>
                        </div>
                    ) : (
                        filteredTests.map((test) => (
                            <div key={test._id} className="test-card">
                                <div className="test-info">
                                    <h3>{test.title}</h3>
                                    <div className="test-details">
                                        <p>Total Questions: {test.totalQuestion}</p>
                                        <p>Marks per Question: {test.rightMarks}</p>
                                        <p>Class: {test.class}</p>
                                        <p>Duration: {formatTime(test.timeInMinutes)}</p>
                                    </div>
                                </div>
                                <div className="test-meta">
                                   
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