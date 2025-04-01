import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./component/AdminPanel/Dashboard";
import Header from "./component/AdminPanel/Header";
import Sidebar from "./component/AdminPanel/Sidebar";
import Login from "./component/Login/login";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
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