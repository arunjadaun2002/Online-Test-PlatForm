import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AttemptTest.css';

function AttemptTest() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentClass, setStudentClass] = useState(null);

  useEffect(() => {
    // Get student class from localStorage
    const userData = JSON.parse(localStorage.getItem('userData'));
    console.log('User Data from localStorage:', userData);
    
    if (userData && userData.class) {
      console.log('Student class from localStorage:', userData.class);
      setStudentClass(userData.class);
      fetchTests(userData.class);
    } else {
      fetchStudentData();
    }
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

      console.log('Student Profile Data:', data.data);
      const studentClass = data.data.class;
      console.log('Student Class:', studentClass, 'Type:', typeof studentClass);
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
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch tests');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch tests');
      }

      // Filter tests for the student's class
      const classTests = data.data.filter(test => test.class === `Class ${studentClass}`);
      console.log('Tests for Class', studentClass, ':', classTests);
      setTests(classTests);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tests:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleStartTest = (testId) => {
    navigate(`/student/test/${testId}`);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="attempt-test-container">
      <h2>Available Tests for Class {studentClass}</h2>
      {tests.length === 0 ? (
        <div className="no-tests">
          <p>No tests available for your class at the moment.</p>
        </div>
      ) : (
        <div className="tests-grid">
          {tests.map((test) => (
            <div key={test._id} className="test-card">
              <h3>{test.title}</h3>
              <p>{test.description}</p>
              <div className="test-details">
                <p>Total Questions: {test.totalQuestion}</p>
                <p>Marks per Question: {test.rightMarks}</p>
                <p>Class: {test.class}</p>
              </div>
              <button 
                className="start-test-btn"
                onClick={() => handleStartTest(test._id)}
              >
                Start Test
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AttemptTest; 