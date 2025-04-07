import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./component/AdminPanel/AdminLayout";
import Login from "./component/Login/login";
import { QuizProvider } from './component/Pages/QuizContext';
import { StudentProvider } from './component/Pages/StudentContext';
import StudentDashboard from "./StudentPanel/StudentDashboard";

function App() {
  return (
    <StudentProvider>
      <QuizProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminLayout />} />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
        </Routes>
      </QuizProvider>
    </StudentProvider>
  );
}

export default App;