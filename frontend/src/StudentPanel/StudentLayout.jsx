import React, { useState } from 'react';
import { FaBook, FaHistory, FaHome, FaSignOutAlt, FaUser, FaMoon, FaSun } from 'react-icons/fa';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './StudentLayout.css';

const StudentLayout = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { darkMode, toggleDarkMode } = useTheme();

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsDropdownOpen(false);
        navigate('/login');
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleThemeToggle = () => {
        toggleDarkMode();
        setIsDropdownOpen(false);
    };

    const handleProfileClick = () => {
        setIsDropdownOpen(false);
        navigate('/student/profile');
    };

    return (
        <div className={`dashboard-container ${darkMode ? 'dark' : ''}`}>
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
                {/* Top Profile Section */}
                <div className="top-profile">
                    <div className="profile-container">
                        <button onClick={toggleDropdown} className="profile-link">
                            <div className="profile-icon">👤</div>
                            <span className="profile-name">{user.name || 'Student'}</span>
                        </button>
                        {isDropdownOpen && (
                            <div className="profile-dropdown">
                                <div className="user-info">
                                    <div className="user-name">{user.name || 'Student'}</div>
                                    <div className="user-email">{user.email || 'student@example.com'}</div>
                                </div>
                                <button onClick={handleProfileClick} className="dropdown-item">
                                    <FaUser /> Profile Settings
                                </button>
                                <button onClick={handleThemeToggle} className="dropdown-item">
                                    {darkMode ? <FaSun /> : <FaMoon />}
                                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                                </button>
                                <div className="dropdown-divider"></div>
                                <button onClick={handleLogout} className="dropdown-item logout">
                                    <FaSignOutAlt /> Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <Outlet />
            </div>
        </div>
    );
};

export default StudentLayout; 