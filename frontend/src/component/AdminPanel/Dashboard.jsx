import React from 'react';
import { useStudents } from '../Pages/StudentContext';
import './Dashboard.css';

function Dashboard() {
  const { studentCount } = useStudents();

  const stats = [
    {
      title: "Total Students",
      count: studentCount,
      color: "#B4D147",
      icon: "fas fa-user-plus"
    },
    {
      title: "Total Quiz",
      count: 42,
      color: "#E74C3C",
      icon: "fas fa-question"
    },
    {
      title: "Total Question",
      count: 52,
      color: "#2ECC71",
      icon: "fas fa-question-circle"
    }
  ];

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stats-row">
          <div 
            className="stat-card" 
            style={{ backgroundColor: stats[0].color }}
          >
            <div className="stat-info">
              <h2>{stats[0].count}</h2>
              <h3>{stats[0].title}</h3>
            </div>
            <i className={`stat-icon ${stats[0].icon}`}></i>
            <button className="more-info">
              More Info <i className="fas fa-arrow-right"></i>
            </button>
          </div>

          <div 
            className="stat-card" 
            style={{ backgroundColor: stats[1].color }}
          >
            <div className="stat-info">
              <h2>{stats[1].count}</h2>
              <h3>{stats[1].title}</h3>
            </div>
            <i className={`stat-icon ${stats[1].icon}`}></i>
            <button className="more-info">
              More Info <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>

        <div className="stats-row">
          <div 
            className="stat-card" 
            style={{ backgroundColor: stats[2].color }}
          >
            <div className="stat-info">
              <h2>{stats[2].count}</h2>
              <h3>{stats[2].title}</h3>
            </div>
            <i className={`stat-icon ${stats[2].icon}`}></i>
            <button className="more-info">
              More Info <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;