import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import examIcon from '../../assets/images/exam-icon.jpeg';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Add your API call here
      const response = await fetch('your-api-endpoint/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      if (data.success) {
        // Handle successful login
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-header">
        <h1>Online Test</h1>
      </div>

      <div className="login-container">
        <div className="login-left">
          <div className="image-container">
            <img src={examIcon} alt="Online Exam System" />
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-container">
            <h2>Admin Login</h2>
            
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Username or Email ID"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter Password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="button-group">
                <button type="button" className="btn sign-in">
                  Sign In <span>→</span>
                </button>
                <button type="submit" className="btn login">
                  Login <span>→</span>
                </button>
              </div>

              <div className="forgot-password">
                <a href="/forgot-password">Forget Password</a>
              </div>

              <div className="role-buttons">
                <button 
                  type="button" 
                  className="role-btn admin"
                  onClick={() => navigate('/admin')}
                >
                  Admin
                </button>
                <button 
                  type="button" 
                  className="role-btn student"
                  onClick={() => navigate('/student')}
                >
                  Student
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <footer className="login-footer">
        <p>ScrollAR4U technology</p>
      </footer>
    </div>
  );
};

export default Login;