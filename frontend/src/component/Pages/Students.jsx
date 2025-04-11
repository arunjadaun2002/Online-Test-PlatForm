import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Students.css';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [emailingStudent, setEmailingStudent] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    section: '',
    verified: false
  });
  const [emailForm, setEmailForm] = useState({
    subject: '',
    message: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/admin/students', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      
      const data = await response.json();
      setStudents(data.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/admin/students/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete student');
      }

      // Refresh the student list
      fetchStudents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setEditForm({
      name: student.name,
      email: student.email,
      section: student.section || '',
      verified: student.verified
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/admin/students/${editingStudent._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) {
        throw new Error('Failed to update student');
      }

      // Refresh the student list and close the edit form
      fetchStudents();
      setEditingStudent(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMail = (student) => {
    setEmailingStudent(student);
    setEmailForm({
      subject: '',
      message: ''
    });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/admin/send-email', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: emailingStudent.email,
          subject: emailForm.subject,
          message: emailForm.message
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      // Close the email modal
      setEmailingStudent(null);
      alert('Email sent successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="students-container">
      <div className="students-header">
        <h2>Students</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="students-table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>User ID</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.userId}</td>
                <td>
                  <span className={`status-badge ${student.verified ? 'verified' : 'pending'}`}>
                    {student.verified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td>
                  <button 
                    className="action-btn mail"
                    onClick={() => handleMail(student)}
                  >
                    Mail
                  </button>
                  <button 
                    className="action-btn edit"
                    onClick={() => handleEdit(student)}
                  >
                    Edit
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDelete(student._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingStudent && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h3>Edit Student</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Section:</label>
                <input
                  type="text"
                  value={editForm.section}
                  onChange={(e) => setEditForm({...editForm, section: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={editForm.verified}
                    onChange={(e) => setEditForm({...editForm, verified: e.target.checked})}
                  />
                  Verified
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">Save</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setEditingStudent(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {emailingStudent && (
        <div className="email-modal">
          <div className="email-modal-content">
            <h3>Send Email to {emailingStudent.name}</h3>
            <form onSubmit={handleEmailSubmit}>
              <div className="form-group">
                <label>Subject:</label>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Message:</label>
                <textarea
                  value={emailForm.message}
                  onChange={(e) => setEmailForm({...emailForm, message: e.target.value})}
                  required
                  rows="5"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="send-btn">Send</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setEmailingStudent(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
