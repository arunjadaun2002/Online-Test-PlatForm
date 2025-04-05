import React, { useEffect, useState } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [quizCount, setQuizCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    // Get quiz count from localStorage
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    setQuizCount(quizzes.length);

    // Get student count from localStorage
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    setStudentCount(students.length);
  }, []);

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