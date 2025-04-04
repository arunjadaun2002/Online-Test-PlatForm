import React from 'react';
import { useNavigate } from 'react-router-dom';
import examIcon from '../../assets/images/exam-icon.jpeg';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  const handleAdminClick = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div className="login-page">
      <div className="container">
        <h1 className="heading">Online Test</h1>
        
        <div className="login-container">
          <div className="login-left">
            <img src={examIcon} alt="Exam Icon" />
          </div>
          
          <div className="login-right">
            <h2>Admin Login</h2>
            <form>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Username or Email ID"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter Password"
                />
              </div>
              
              <div className="button-group">
                <button type="button" className="btn sign-in">
                  Sign In <span>→</span>
                </button>
              
              </div>
              
              <a href="#" className="forget-password">
                Forget Password
              </a>
              
              <div className="role-buttons">
                <button 
                  type="button" 
                  className="role-btn admin"
                  onClick={handleAdminClick}  // This will directly navigate to admin dashboard
                >
                  Admin Login
                </button>
                <button 
                  type="button" 
                  className="role-btn student"
                >
                  Student Login
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <footer>
          <p>ScrollAR4U technology</p>
        </footer>
      </div>
    </div>
  );
};

export default Login;