import React, { useState } from 'react';
import './AddStudent.css';

function AddStudent({ onClose, onAddStudent }) {
  const [studentData, setStudentData] = useState({
    name: '',
    userId: '',
    password: '',
    email: '',
    section: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/admin/register-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(studentData)
      });

      const data = await response.json();
      
      if (data.success) {
        onAddStudent(data.student);
        onClose();
      } else {
        setError(data.message || 'Failed to add student');
      }
    } catch (err) {
      setError('An error occurred while adding student');
      console.error('Add student error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-student-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Student</h2>
          <button className="back-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Student Name</label>
              <input
                type="text"
                name="name"
                value={studentData.name}
                onChange={handleChange}
                placeholder="Enter name"
                required
              />
            </div>

            <div className="form-group">
              <label>User ID</label>
              <input
                type="text"
                name="userId"
                value={studentData.userId}
                onChange={handleChange}
                placeholder="Enter user ID"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={studentData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={studentData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </div>

            <div className="form-group">
              <label>Section</label>
              <input
                type="text"
                name="section"
                value={studentData.section}
                onChange={handleChange}
                placeholder="Enter section"
                required
              />
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="modal-footer">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;