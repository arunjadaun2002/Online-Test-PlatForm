import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./component/AdminPanel/AdminLayout";
import Login from "./component/Login/login";
import Signup from "./component/Login/Signup";
import { QuizProvider } from './component/Pages/QuizContext';
import { StudentProvider } from './component/Pages/StudentContext';
import Attempt from './StudentPanel/Panel/Attempt';
import Attempted from './StudentPanel/Panel/Result';
import StudentDashboard from "./StudentPanel/StudentDashboard";
import StudentLayout from "./StudentPanel/StudentLayout";

function App() {
  return (
    <StudentProvider>
      <QuizProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminLayout />} />


          {/* Student Routes */}
          <Route path="/student" element={<StudentLayout />}>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="attempt" element={<Attempt />} />
            <Route path="attempted" element={<Attempted />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
        </Routes>
      </QuizProvider>
    </StudentProvider>
  );
}

export default App;