import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import examIcon from '../../assets/images/exam-icon.jpeg';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', data); // Debug log

      if (data.success) {
        // Store the token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ 
          role: 'admin', 
          name: email.split('@')[0] // Simple way to get a name from email
        }));
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentClick = () => {
    localStorage.setItem('user', JSON.stringify({ role: 'student', name: 'Student' }));
    navigate('/student/dashboard');
  };

  const handleDirectAdminClick = () => {
    localStorage.setItem('user', JSON.stringify({ role: 'admin', name: 'Admin' }));
    navigate('/admin/dashboard');
  };

  return (
    <div className="login-page">
      <div className="container">
        <h1 className="heading">Online Test</h1>

        <div className="login-container">
          <div className="login-left">
            <img src={examIcon} alt="Exam Icon" className="exam-icon" />
          </div>

          <div className="login-right">
            <h2 className="admin-login-title">Admin Login</h2>
            <form onSubmit={handleSignIn}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Username or Email ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="button-group">
                <button 
                  type="submit" 
                  className="Log-in-btn"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'LogIn'} <span>→</span>
                </button>
              </div>

              <a href="#" className="forget-password">
                Forget Password
              </a>

              <div className="role-buttons">
                <button
                  type="button"
                  className="role-btn admin"
                  onClick={handleDirectAdminClick}
                >
                  Admin Login
                </button>
                <button
                  type="button"
                  className="role-btn student"
                  onClick={handleStudentClick}
                >
                  Student Login
                </button>
              </div>

              <div className="signup-link">
                Don't have an account?{' '}
                <button 
                  type="button" 
                  className="link-btn"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
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