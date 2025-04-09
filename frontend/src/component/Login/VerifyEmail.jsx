import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './VerifyEmail.css';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your email...');
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        console.log('Verifying token:', token); // Debug log
        const response = await fetch(`http://localhost:4000/api/admin/verify/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        console.log('Verification response:', data); // Debug log

        if (data.success) {
          setMessage('Email verified successfully! You can now login.');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setError(data.message || 'Verification failed');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setError('An error occurred during verification. Please try again later.');
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setError('Invalid verification link');
    }
  }, [token, navigate]);

  return (
    <div className="verify-email-page">
      <div className="container">
        <div className="verification-box">
          <h1>Email Verification</h1>
          {error ? (
            <div className="error-message">
              {error}
              <button 
                className="retry-button"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="success-message">{message}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail; 