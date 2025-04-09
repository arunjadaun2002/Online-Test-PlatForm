import React from 'react';
import { FaBook, FaHistory, FaHome, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './StudentLayout.css';

const StudentLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <h2>Online Test</h2>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/student/dashboard" className="nav-item">
                        <FaHome /> Dashboard
                    </Link>
                    <Link to="/student/attempt" className="nav-item">
                        <FaBook /> Attempt Test
                    </Link>
                    <Link to="/student/attempted" className="nav-item">
                        <FaHistory /> Result
                    </Link>
                    <Link to="/student/profile" className="nav-item">
                        <FaUser /> Profile
                    </Link>
                </nav>
                <button onClick={handleLogout} className="logout-btn">
                    <FaSignOutAlt /> Log Out
                </button>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <Outlet />
            </div>
        </div>
    );
};

export default StudentLayout; 