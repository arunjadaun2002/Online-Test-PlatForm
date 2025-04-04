import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./component/AdminPanel/Dashboard";
import Header from "./component/AdminPanel/Header";
import Sidebar from "./component/AdminPanel/Sidebar";
import Login from "./component/Login/login";
import CreateTest from "./component/Pages/CreateTest";
import Quiz from "./component/Pages/Quiz";
import { QuizProvider } from './component/Pages/QuizContext';
import Reports from "./component/Pages/Reports";
import Settings from "./component/Pages/Settings";
import { StudentProvider } from './component/Pages/StudentContext';
import Students from "./component/pages/students";
import TopStudents from "./component/Pages/TopStudents";



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
          {/* Add other admin routes here */}
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <StudentProvider>
      <QuizProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/create-test" element={<CreateTest />} />
          <Route path="/quiz" element={<Quiz />} />
        </Routes>
      </QuizProvider>
    </StudentProvider>
  );
}

export default App;