import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopStudents.css';

const API_BASE_URL = 'http://localhost:4000';

const TopStudents = () => {
  const [students, setStudents] = useState([]);
  const [studentResults, setStudentResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTest, setSelectedTest] = useState('');
  const [availableTests, setAvailableTests] = useState([]);
  const navigate = useNavigate();

  // Array of classes from 1 to 12
  const classes = Array.from({ length: 12 }, (_, i) => i + 1);

  useEffect(() => {
    if (selectedClass) {
      fetchStudentsByClass(selectedClass);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedClass && selectedTest) {
      fetchTestResults(selectedClass, selectedTest);
    }
  }, [selectedClass, selectedTest]);

  const fetchStudentsByClass = async (classNumber) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to view top students');
        return;
      }

      // Fetch students for selected class
      const response = await axios.get(`${API_BASE_URL}/api/admin/students/class/${classNumber}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setStudents(response.data.data);
        // Fetch available tests for this class
        fetchAvailableTests(classNumber);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTests = async (classNumber) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/admin/tests/class/${classNumber}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setAvailableTests(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  const fetchTestResults = async (classNumber, testId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/admin/test/results`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          class: classNumber,
          testId: testId
        }
      });

      if (response.data.success) {
        // Sort results by score in descending order
        const sortedResults = response.data.data.sort((a, b) => b.score - a.score);
        setStudentResults(sortedResults);
      } else {
        setStudentResults([]);
        setError(response.data.message || 'No results found');
      }
    } catch (error) {
      console.error('Error fetching test results:', error);
      setError('Failed to fetch test results');
      setStudentResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="top-students-container">
      <h2>Top Students Dashboard</h2>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          {(error.includes('login') || error.includes('session')) && (
            <button onClick={() => navigate('/login')} className="login-button">
              Login Again
            </button>
          )}
        </div>
      )}

      <div className="selection-filters">
        <div className="filter-group">
          <label htmlFor="class-select">Select Class:</label>
          <select
            id="class-select"
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedTest('');
              setStudentResults([]);
            }}
            className="filter-dropdown"
          >
            <option value="">Select Class</option>
            {classes.map((classNum) => (
              <option key={classNum} value={classNum}>
                Class {classNum}
              </option>
            ))}
          </select>
        </div>

        {selectedClass && (
          <div className="filter-group">
            <label htmlFor="test-select">Select Test:</label>
            <select
              id="test-select"
              value={selectedTest}
              onChange={(e) => setSelectedTest(e.target.value)}
              className="filter-dropdown"
            >
              <option value="">Select Test</option>
              {availableTests.map((test) => (
                <option key={test._id} value={test._id}>
                  {test.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading-message">Loading results...</div>
      ) : selectedClass && selectedTest && studentResults.length > 0 ? (
        <div className="results-section">
          <h3>Results for Class {selectedClass} - {availableTests.find(t => t._id === selectedTest)?.title}</h3>
          <div className="results-grid">
            {studentResults.map((result, index) => (
              <div key={result._id} className="student-result-card">
                <div className="rank-badge">#{index + 1}</div>
                <div className="student-info">
                  <h4>{result.studentName}</h4>
                  <p><strong>User ID:</strong> {result.userId}</p>
                </div>
                <div className="score-section">
                  <div className="score">{result.correctAnswers}/{result.totalQuestions}</div>
                  <div className="percentage">
                    <span className={`status-indicator ${result.percentage >= 50 ? 'status-passed' : 'status-failed'}`}></span>
                    {result.percentage}%
                  </div>
                </div>
                <div className="result-info">
                  <p><strong>Score:</strong> {result.score}</p>
                  <p><strong>Correct:</strong> {result.correctAnswers}</p>
                  <p><strong>Wrong:</strong> {result.wrongAnswers}</p>
                  <p><strong>Duration:</strong> {Math.floor(result.testDuration / 60)}m {result.testDuration % 60}s</p>
                </div>
                <p className="result-date">
                  <strong>Date:</strong> {new Date(result.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : selectedClass && selectedTest ? (
        <div className="no-results">No results found for the selected test.</div>
      ) : null}
    </div>
  );
};

export default TopStudents;
