import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/exam-icon.png'; // Changed from image to images
import './Header.css';

function Header() {
  const [showProfile, setShowProfile] = useState(false);
  const [adminName, setAdminName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminName = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:4000/api/admin/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch admin data');
        }

        const data = await response.json();
        if (data.success && data.data) {
          // Store the admin name in localStorage for persistence
          localStorage.setItem('adminName', data.data.name);
          setAdminName(data.data.name);
        }
      } catch (error) {
        console.error('Error fetching admin name:', error);
        // Try to get name from localStorage as fallback
        const storedName = localStorage.getItem('adminName');
        setAdminName(storedName || 'Admin');
      }
    };

    fetchAdminName();
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminName');
    // Redirect to the login page with the full URL
    window.location.href = 'http://localhost:5173/login';
  };

  // Get the current admin name, with fallback to localStorage or 'Admin'
  const currentAdminName = adminName || localStorage.getItem('adminName') || 'Admin';

  // Close profile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfile && !event.target.closest('.profile-content') && !event.target.closest('.profile-btn')) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfile]);

  return (
    <>
      <header className="admin-header">
        <div className="header-left">
          <img src={logo} alt="Logo" className="header-logo" />
          <h1>Online Test</h1>
        </div>
        
        <nav className="header-nav">
          <Link to="/admin/about">About</Link>
          <Link to="/admin/features">Features</Link>
          <Link to="/admin/faqs">FAQs</Link>
          <Link to="/admin/gallery">Gallery</Link>
          <Link to="/admin/contact">Contact</Link>
        </nav>
        
        <div className="header-right">
          <button className="profile-btn" onClick={() => setShowProfile(!showProfile)}>
            Profile
          </button>
        </div>
      </header>

      {showProfile && (
        <div className="profile-overlay">
          <div className="profile-content dark-theme">
            <button className="close-btn" onClick={() => setShowProfile(false)}>✖</button>
            
            <div className="profile-header">
              <div className="avatar">
                {currentAdminName.charAt(0).toUpperCase()}
              </div>
              <div className="greeting">
                Hi, {currentAdminName}
              </div>
            </div>

            <div className="profile-options">
              <Link to="/admin/settings" className="profile-option" onClick={() => setShowProfile(false)}>
                <span className="option-emoji">⚙️</span>
                Settings
              </Link>
              <button className="profile-option" onClick={handleSignOut}>
                <span className="option-emoji">🚪</span>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
