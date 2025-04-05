import React, { useEffect, useState } from 'react';
import { useStudents } from '../Pages/StudentContext';
import './Dashboard.css';

function Dashboard() {
  const [quizCount, setQuizCount] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const { studentCount } = useStudents();

  useEffect(() => {
    // Get quizzes from localStorage
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    setQuizCount(quizzes.length);

    // Calculate total questions from all quizzes
    const totalQuestions = quizzes.reduce((total, quiz) => {
      return total + (quiz.questions ? quiz.questions.length : 0);
    }, 0);
    setQuestionCount(totalQuestions);
  }, []);

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stats-row">
          {/* Total Students Card */}
          <div className="stat-card" style={{ backgroundColor: '#B4D147' }}>
            <div className="stat-content">
              <div className="stat-number">{studentCount}</div>
              <div className="stat-title">Total Students</div>
              <div className="stat-icon">
                <i className="fas fa-user-plus"></i>
              </div>
            </div>
            <div className="more-info">
              More Info <i className="fas fa-arrow-right"></i>
            </div>
          </div>

          {/* Total Quiz Card */}
          <div className="stat-card" style={{ backgroundColor: '#E74C3C' }}>
            <div className="stat-content">
              <div className="stat-number">{quizCount}</div>
              <div className="stat-title">Total Quiz</div>
              <div className="stat-icon">
                <i className="fas fa-question"></i>
              </div>
            </div>
            <div className="more-info">
              More Info <i className="fas fa-arrow-right"></i>
            </div>
          </div>
        </div>

        <div className="stats-row">
          {/* Total Question Card */}
          <div className="stat-card" style={{ backgroundColor: '#2ECC71' }}>
            <div className="stat-content">
              <div className="stat-number">{questionCount}</div>
              <div className="stat-title">Total Question</div>
              <div className="stat-icon">
                <i className="fas fa-question-circle"></i>
              </div>
            </div>
            <div className="more-info">
              More Info <i className="fas fa-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;