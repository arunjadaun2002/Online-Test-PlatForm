import React from 'react';
import './Dashboard.css';

function Dashboard() {
  const stats = [
    {
      title: "Total Students",
      count: 4,
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
      <div className="stats-container">
        {stats.map((stat, index) => (
          <div 
            className="stat-card" 
            key={index}
            style={{ backgroundColor: stat.color }}
          >
            <div className="stat-info">
              <h2>{stat.count}</h2>
              <h3>{stat.title}</h3>
            </div>
            <i className={`stat-icon ${stat.icon}`}></i>
            <button className="more-info">
              More Info <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;