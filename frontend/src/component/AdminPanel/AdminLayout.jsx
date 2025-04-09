import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CreateTest from '../Pages/CreateTest';
import Quiz from '../Pages/Quiz';
import Reports from '../Pages/Reports';
import Settings from '../Pages/Settings';
import Students from '../Pages/Students';
import TopStudents from '../Pages/TopStudents';
import './AdminLayout.css';
import Dashboard from './Dashboard';
import Header from './Header';
import Sidebar from './Sidebar';

const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <Sidebar />
            <div className="main-content">
                <Header />
                <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="students" element={<Students />} />
                    <Route path="quiz" element={<Quiz />} />
                    <Route path="create-test" element={<CreateTest />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="top-students" element={<TopStudents />} />
                    <Route path="settings" element={<Settings />} />
                </Routes>
            </div>
        </div>
    );
};

export default AdminLayout; 