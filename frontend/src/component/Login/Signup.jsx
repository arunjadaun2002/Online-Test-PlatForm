import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import examIcon from '../../assets/images/exam-icon.jpeg';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to register the user
    // For now, we'll just navigate to the login page
    navigate('/login');
  };

  return (
    <div className="signup-page">
      <div className="container">
        <h1 className="heading">Create Account</h1>

        <div className="signup-container">
          <div className="signup-left">
            <img src={examIcon} alt="Exam Icon" className="exam-icon" />
          </div>

          <div className="signup-right">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
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
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="button-group">
                <button type="submit" className="signup-btn">
                  Sign Up
                </button>
              </div>

              <div className="login-link">
                Already have an account?{' '}
                <button 
                  type="button" 
                  className="link-btn"
                  onClick={() => navigate('/login')}
                >
                  Sign In
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

export default Signup; 