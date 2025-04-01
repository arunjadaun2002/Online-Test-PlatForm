import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./component/AdminPanel/Dashboard";
import Header from "./component/AdminPanel/Header";
import Sidebar from "./component/AdminPanel/Sidebar";
import Login from "./component/Login/login";
import Students from "./component/Pages/Students"
import Quiz from "./component/Pages/Quiz";
import CreateTest from "./component/Pages/CreateTest";
import Reports from "./component/Pages/Reports";
import TopStudents from "./component/Pages/TopStudents";
import Settings from "./component/Pages/Settings";


const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students" element={<Students />} />
            <Route path="/admin/quiz" element={<Quiz />} />
            <Route path="/admin/create-test" element={<CreateTest />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/top-students" element={<TopStudents />} />
            <Route path="/admin/settings" element={<Settings />} />
          {/* Add other admin routes here */}
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/*" element={<AdminLayout />} />
    </Routes>
  );
}

export default App;