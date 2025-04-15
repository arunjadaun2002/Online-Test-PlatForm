import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaGraduationCap, FaEdit, FaSave, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { studentAPI, getCurrentUser } from '../services/api';
import './StudentProfile.css';

const StudentProfile = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState({
    name: '',
    email: '',
    class: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'student') {
      navigate('/login');
      return;
    }

    // Fetch student data from API
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First try to get data from API
        const response = await studentAPI.getProfile();
        
        if (response.success) {
          const profileData = response.data;
          setStudentData({
            name: profileData.name || '',
            email: profileData.email || '',
            class: profileData.class || ''
          });
          setEditedData({
            name: profileData.name || '',
            email: profileData.email || '',
            class: profileData.class || ''
          });
        } else {
          // If API fails, use data from localStorage as fallback
          const userData = getCurrentUser();
          if (userData) {
            setStudentData({
              name: userData.name || '',
              email: userData.email || '',
              class: userData.class || ''
            });
            setEditedData({
              name: userData.name || '',
              email: userData.email || '',
              class: userData.class || ''
            });
          } else {
            setError('Failed to load student data');
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        
        // If API fails, use data from localStorage as fallback
        const userData = getCurrentUser();
        if (userData) {
          setStudentData({
            name: userData.name || '',
            email: userData.email || '',
            class: userData.class || ''
          });
          setEditedData({
            name: userData.name || '',
            email: userData.email || '',
            class: userData.class || ''
          });
        } else {
          setError(err.message || 'Failed to load student data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(studentData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call API to update profile
      const response = await studentAPI.updateProfile(editedData);
      
      if (response.success) {
        setStudentData(editedData);
        setIsEditing(false);
        
        // Update user data in localStorage
        const currentUser = getCurrentUser();
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            name: editedData.name,
            email: editedData.email,
            class: editedData.class
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      } else {
        setError('Failed to save changes');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear all student data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Navigate to login page
    navigate('/login');
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="student-profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <FaUser />
        </div>
        <h1>{studentData.name}</h1>
      </div>

      {error && <div className="profile-error">{error}</div>}

      <div className="profile-card">
        <div className="profile-info">
          <div className="info-item">
            <div className="info-icon">
              <FaUser />
            </div>
            <div className="info-content">
              <h3>Name</h3>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editedData.name}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              ) : (
                <p>{studentData.name}</p>
              )}
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <FaEnvelope />
            </div>
            <div className="info-content">
              <h3>Email</h3>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editedData.email}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              ) : (
                <p>{studentData.email}</p>
              )}
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <FaGraduationCap />
            </div>
            <div className="info-content">
              <h3>Class</h3>
              {isEditing ? (
                <input
                  type="text"
                  name="class"
                  value={editedData.class}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              ) : (
                <p>{studentData.class}</p>
              )}
            </div>
          </div>
        </div>

        <div className="profile-actions">
          {isEditing ? (
            <>
              <button className="save-btn" onClick={handleSave}>
                <FaSave /> Save Changes
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                <FaTimes /> Cancel
              </button>
            </>
          ) : (
            <button className="edit-btn" onClick={handleEdit}>
              <FaEdit /> Edit Profile
            </button>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile; 