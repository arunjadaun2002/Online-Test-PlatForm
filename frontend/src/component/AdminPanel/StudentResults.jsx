import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentResults.css';

// API base URL - adjust this to match your backend URL
const API_BASE_URL = 'http://localhost:4000'; // Backend server runs on port 4000

const StudentResults = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentResults, setStudentResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to view student results');
      return;
    }
  }, []);

  // Array of classes from 1 to 12
  const classes = Array.from({ length: 12 }, (_, i) => i + 1);

  // Fetch students when class is selected
  useEffect(() => {
    if (selectedClass) {
      fetchStudentsByClass(selectedClass);
    }
  }, [selectedClass]);

  // Fetch student results when a student is selected
  useEffect(() => {
    if (selectedStudent) {
      fetchStudentResults(selectedStudent._id);
    }
  }, [selectedStudent]);

  // Get auth token with validation
  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found. Please login again.');
      navigate('/login');
      return null;
    }
    return token;
  };

  // Fetch students by class
  const fetchStudentsByClass = async (classNumber) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      if (!token) return;

      console.log('Fetching students for class:', classNumber);
      console.log('Using URL:', `${API_BASE_URL}/api/admin/students/class/${classNumber}`);

      const response = await axios.get(`${API_BASE_URL}/api/admin/students/class/${classNumber}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Full API Response:', response);
      
      if (response.data.success) {
        const studentsData = response.data.data || [];
        console.log('Students data:', studentsData);
        setStudents(studentsData);
        
        if (studentsData.length === 0) {
          console.log('No students found for class:', classNumber);
        }
      } else {
        throw new Error(response.data.message || 'Failed to fetch students');
      }
    } catch (error) {
      console.error('Error details:', error);
      let errorMessage = 'Error fetching students. ';
      
      if (error.response) {
        console.error('Response error:', error.response.data);
        errorMessage += error.response.data.message || error.response.statusText;
        
        if (error.response.status === 401) {
          errorMessage = 'Your session has expired. Please login again.';
          handleLogout();
        }
      } else if (error.request) {
        console.error('Request error:', error.request);
        errorMessage += 'Could not connect to server. Please check your internet connection.';
      } else {
        console.error('Setup error:', error.message);
        errorMessage += error.message;
      }
      
      setError(errorMessage);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Fetch student results
  const fetchStudentResults = async (studentId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/api/admin/student/results`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        params: {
          userId: studentId
        }
      });
      
      console.log('Student Results Response:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setStudentResults(response.data);
      } else {
        setStudentResults([]);
        setError('No results found for this student');
      }
    } catch (error) {
      console.error('Error fetching student results:', error);
      setError('Failed to fetch student results');
      setStudentResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle student selection
  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  return (
    <div className="student-results-container">
      <h2>Student Results Dashboard</h2>
      
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
      
      {/* Class Selection Dropdown */}
      <div className="class-selection">
        <select 
          value={selectedClass} 
          onChange={(e) => setSelectedClass(e.target.value)}
          className="class-dropdown"
        >
          <option value="">Select Class</option>
          {classes.map((classNum) => (
            <option key={classNum} value={classNum}>
              Class {classNum}
            </option>
          ))}
        </select>
      </div>

      {/* Students List */}
      {selectedClass && (
        <div className="students-list">
          <h3>Students in Class {selectedClass}</h3>
          {loading ? (
            <div className="loading-message">Loading students...</div>
          ) : (
            <div className="students-grid">
              {students && students.length > 0 ? (
                students.map((student) => (
                  <div
                    key={student._id}
                    className={`student-card ${selectedStudent?._id === student._id ? 'selected' : ''}`}
                    onClick={() => handleStudentClick(student)}
                  >
                    <h4>{student.name}</h4>
                    <p><strong>Email:</strong> {student.email}</p>
                    <p><strong>User ID:</strong> {student.userId}</p>
                    <p><strong>Class:</strong> {student.class}</p>
                  </div>
                ))
              ) : (
                <div className="no-data-message">
                  No students found in Class {selectedClass}
                  <br />
                  <small>
                    If this seems incorrect, please try logging out and back in.
                    <button onClick={handleLogout} className="logout-button">
                      Logout
                    </button>
                  </small>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Student Results */}
      {selectedStudent && (
        <div className="results-section">
          <h3>Results for {selectedStudent.name}</h3>
          {loading ? (
            <div className="loading-message">Loading results...</div>
          ) : (
            <div className="results-grid">
              {studentResults && studentResults.length > 0 ? (
                studentResults.map((result) => (
                  <div key={result._id} className="result-card">
                    <div className="test-name">
                      <h4>{result.testName}</h4>
                      <span className="test-score">{result.score}</span>
                    </div>
                    
                    <div className="score-section">
                      <div className="score">{result.correctAnswers}/{result.totalQuestions}</div>
                      <div className="percentage">
                        <span className={`status-indicator ${result.percentage >= 50 ? 'status-passed' : 'status-failed'}`}></span>
                        {result.percentage}%
                      </div>
                    </div>
                    
                    <div className="result-info">
                      <p><strong>Total:</strong> {result.totalQuestions}</p>
                      <p><strong>Correct:</strong> {result.correctAnswers}</p>
                      <p><strong>Wrong:</strong> {result.wrongAnswers}</p>
                      <p><strong>Duration:</strong> {Math.floor(result.testDuration / 60)}m {result.testDuration % 60}s</p>
                    </div>
                    
                    <p className="result-date">
                      <strong>Date:</strong> {new Date(result.date).toLocaleDateString()}
                    </p>
                    
                    <button 
                      className="view-details-btn"
                      onClick={() => window.open(`/student/test-results/${result._id}`, '_blank')}
                    >
                      View Details
                    </button>
                  </div>
                ))
              ) : (
                <div className="no-data-message">No test results found for this student.</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentResults; 