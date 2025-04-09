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
  const [isStudentLogin, setIsStudentLogin] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isStudentLogin ? 'student' : 'admin';
      const response = await fetch(`http://localhost:4000/api/${endpoint}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ 
          role: isStudentLogin ? 'student' : 'admin',
          name: email.split('@')[0]
        }));
        
        if (isStudentLogin) {
          navigate('/student/dashboard');
        } else {
          navigate('/admin/dashboard');
        }
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
    setIsStudentLogin(true);
    setError('');
  };

  const handleAdminClick = () => {
    setIsStudentLogin(false);
    setError('');
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
            <h2 className="login-title">
              {isStudentLogin ? 'Student Login' : 'Admin Login'}
            </h2>
            <form onSubmit={handleSignIn}>
              <div className="form-group">
                <label htmlFor="email">
                  {isStudentLogin ? 'User ID' : 'Email'}
                </label>
                <input
                  type={isStudentLogin ? 'text' : 'email'}
                  id="email"
                  placeholder={isStudentLogin ? 'Enter User ID' : 'Enter Email'}
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
                  className={`role-btn admin ${!isStudentLogin ? 'active' : ''}`}
                  onClick={handleAdminClick}
                >
                  Admin Login
                </button>
                <button
                  type="button"
                  className={`role-btn student ${isStudentLogin ? 'active' : ''}`}
                  onClick={handleStudentClick}
                >
                  Student Login
                </button>
              </div>

              {!isStudentLogin && (
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
              )}
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