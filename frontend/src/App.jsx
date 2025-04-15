import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./component/AdminPanel/AdminLayout";
import ForgotPassword from "./component/Login/ForgotPassword";
import Login from "./component/Login/login";
import ResetPassword from "./component/Login/ResetPassword";
import Signup from "./component/Login/Signup";
import VerifyEmail from "./component/Login/VerifyEmail";
import { QuizProvider } from './component/Pages/QuizContext';
import { StudentProvider } from './component/Pages/StudentContext';
import { ThemeProvider } from './context/ThemeContext';
import Attempt from './StudentPanel/Panel/Attempt';
import TakeTest from './StudentPanel/Panel/TakeTest';
import TestInstructions from './StudentPanel/Panel/TestInstructions';
import StudentDashboard from "./StudentPanel/StudentDashboard";
import StudentLayout from "./StudentPanel/StudentLayout";
import AttemptedTests from './StudentPanel/Panel/AttemptedTests';
import Result from './StudentPanel/Panel/Result';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <StudentProvider>
        <QuizProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify/:token" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Admin Routes */}
            <Route path="/admin/*" element={<AdminLayout />} />

            {/* Student Routes */}
            <Route path="/student" element={<StudentLayout />}>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="attempt" element={<Attempt />} />
              <Route path="attempted" element={<AttemptedTests />} />
              <Route path="result/:testId" element={<Result />} />
              <Route path="test-instructions/:testId" element={<TestInstructions />} />
              <Route path="take-test/:testId" element={<TakeTest />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>
          </Routes>
        </QuizProvider>
      </StudentProvider>
    </ThemeProvider>
  );
}

export default App;