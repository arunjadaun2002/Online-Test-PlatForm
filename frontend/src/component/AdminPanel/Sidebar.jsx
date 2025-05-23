import React from 'react';
import { NavLink } from 'react-router-dom';
import AdminIcon from '../../assets/images/Admin-logo.png';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="admin-profile">
        <img src={AdminIcon} alt="Admin" className="admin-avatar" />
        <h3>Admin</h3>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/admin/dashboard" className="nav-item">
          <i className="fas fa-home"></i>
          DashBoard
        </NavLink>
        
        <NavLink to="/admin/students" className="nav-item">
          <i className="fas fa-users"></i>
          Student Information
        </NavLink>
        
        <NavLink to="/admin/quiz" className="nav-item">
          <i className="fas fa-question-circle"></i>
          Quiz
        </NavLink>
        
        <NavLink to="/admin/create-test" className="nav-item">
          <i className="fas fa-plus"></i>
          <span>Create Test</span>
        </NavLink>
        
        <NavLink to="/admin/reports" className="nav-item">
          <i className="fas fa-file-alt"></i>
          Student Report
        </NavLink>
        
        <NavLink to="/admin/top-students" className="nav-item">
          <i className="fas fa-trophy"></i>
          Top Student
        </NavLink>
        
        <NavLink to="/admin/settings" className="nav-item">
          <i className="fas fa-cog"></i>
          Setting
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;