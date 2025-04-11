import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentTests.css';

function StudentTests() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:4000/api/student/tests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch tests');
      }

      const data = await response.json();
      console.log('Fetched tests:', data.data);
      setTests(data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tests:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAttemptTest = (testId) => {
    navigate(`/student/attempt-test/${testId}`);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="student-tests-container">
      <h2>Available Tests</h2>
      {tests.length === 0 ? (
        <div className="no-tests">
          <p>No tests available for your class at the moment.</p>
        </div>
      ) : (
        <div className="tests-grid">
          {tests.map((test) => (
            <div key={test._id} className="test-card">
              <h3>{test.title}</h3>
              <p className="description">{test.description}</p>
              <div className="test-details">
                <p><strong>Total Questions:</strong> {test.totalQuestion}</p>
                <p><strong>Marks per Question:</strong> {test.rightMarks}</p>
                <p><strong>Class:</strong> {test.class}</p>
              </div>
              <button 
                className="attempt-btn"
                onClick={() => handleAttemptTest(test._id)}
              >
                Attempt Test
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentTests; 