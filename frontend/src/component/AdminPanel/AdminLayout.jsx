import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AddStudent from '../Pages/AddStudent';
import CreateTest from '../Pages/CreateTest';
import Quiz from '../Pages/Quiz';
import Reports from '../Pages/Reports';
import Settings from '../Pages/Settings';
import Students from '../Pages/Students';
import TopStudents from '../Pages/TopStudents';
import './AdminLayout.css';
import Dashboard from './Dashboard';
import Sidebar from './Sidebar';

const AdminLayout = () => {
    const [showProfile, setShowProfile] = useState(false);
    const [adminName, setAdminName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminName = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch('http://localhost:4000/api/admin/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch admin data');
                }

                const data = await response.json();
                if (data.success && data.data) {
                    localStorage.setItem('adminName', data.data.name);
                    setAdminName(data.data.name);
                }
            } catch (error) {
                console.error('Error fetching admin name:', error);
                const storedName = localStorage.getItem('adminName');
                setAdminName(storedName || 'Admin');
            }
        };

        fetchAdminName();
    }, [navigate]);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('adminName');
        window.location.href = 'http://localhost:5173/login';
    };

    // Close profile when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showProfile && !event.target.closest('.profile-dropdown') && !event.target.closest('.profile-btn')) {
                setShowProfile(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showProfile]);

    const currentAdminName = adminName || localStorage.getItem('adminName') || 'Admin';

    return (
        <div className="admin-layout">
            <Sidebar />
            <div className="main-content">
                {/* Header Section */}
                <header className="admin-header">
                    <div className="profile-container">
                        <button className="profile-btn" onClick={() => setShowProfile(!showProfile)}>
                            <div className="avatar-small">{currentAdminName.charAt(0).toUpperCase()}</div>
                            <span className="admin-name">{currentAdminName}</span>
                        </button>

                        {showProfile && (
                            <div className="profile-dropdown">
                                <div className="dropdown-header">
                                    <div className="avatar-large">{currentAdminName.charAt(0).toUpperCase()}</div>
                                    <div className="admin-info">
                                        <span className="admin-name">{currentAdminName}</span>
                                        <span className="admin-role">Administrator</span>
                                    </div>
                                </div>
                                <div className="dropdown-divider"></div>
                                <button className="dropdown-item" onClick={handleSignOut}>
                                    <span className="item-icon">🚪</span>
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="content-area">
                    <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="students" element={<Students />} />
                        <Route path="add-student" element={<AddStudent />} />
                        <Route path="quiz" element={<Quiz />} />
                        <Route path="create-test" element={<CreateTest />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="top-students" element={<TopStudents />} />
                        <Route path="settings" element={<Settings />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout; 