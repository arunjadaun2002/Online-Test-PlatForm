import React, { useEffect, useState } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [quizCount, setQuizCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch quiz count
      const quizResponse = await fetch('http://localhost:4000/api/admin/quizzes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!quizResponse.ok) {
        throw new Error('Failed to fetch quiz count');
      }

      const quizData = await quizResponse.json();
      setQuizCount(quizData.data.length);

      // Fetch student count
      const studentResponse = await fetch('http://localhost:4000/api/admin/students', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!studentResponse.ok) {
        throw new Error('Failed to fetch student count');
      }

      const studentData = await studentResponse.json();
      setStudentCount(studentData.data.length);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="dashboard-container">
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-book"></i>
          </div>
          <div className="stat-info">
            <h3>Total Quizzes</h3>
            <p>{quizCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>Total Students</h3>
            <p>{studentCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 