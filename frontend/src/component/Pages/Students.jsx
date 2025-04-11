import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Students.css';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [emailingStudent, setEmailingStudent] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    class: '',
    userId: ''
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
      console.log('Fetched students:', data.data);
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
      class: student.class,
      userId: student.userId
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

      setEmailingStudent(null);
      alert('Email sent successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  // Get unique classes and group students by class
  const uniqueClasses = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  
  // Group students by their class
  const studentsByClass = students.reduce((acc, student) => {
    const studentClass = String(student.class).trim();
    if (!acc[studentClass]) {
      acc[studentClass] = [];
    }
    acc[studentClass].push(student);
    return acc;
  }, {});

  console.log('Students by class:', studentsByClass);

  const handleClassClick = (cls) => {
    console.log('Clicked class:', cls);
    console.log('Students in class:', studentsByClass[cls]);
    setSelectedClass(cls);
  };

  const handleCloseClassModal = () => {
    setSelectedClass(null);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.userId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = selectedClass === null || student.class === selectedClass;
    
    return matchesSearch && matchesClass;
  });

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="students-container">
      <div className="students-header">
        <h2>Students</h2>
        <div className="header-actions">
          <button 
            className="add-student-btn"
            onClick={() => navigate('/admin/add-student')}
          >
            Add Student
          </button>
          <div className="filters">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="class-sections">
        {uniqueClasses.map(cls => {
          const classStudents = studentsByClass[cls] || [];
          return (
            <div 
              key={`class-${cls}`}
              className={`class-section ${selectedClass === cls ? 'active' : ''}`}
              onClick={() => handleClassClick(cls)}
            >
              <h3>Class {cls}</h3>
              <span className="student-count">{classStudents.length} Students</span>
            </div>
          );
        })}
      </div>

      {selectedClass && (
        <div className="class-modal">
          <div className="class-modal-content">
            <div className="class-modal-header">
              <h3>Class {selectedClass} Students</h3>
              <button className="close-btn" onClick={handleCloseClassModal}>×</button>
            </div>
            <div className="class-students-table-container">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>User ID</th>
                    <th>Class</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsByClass[selectedClass]?.map((student) => (
                    <tr key={student._id}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.userId}</td>
                      <td>{student.class}</td>
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
          </div>
        </div>
      )}

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
                <label>User ID:</label>
                <input
                  type="text"
                  value={editForm.userId}
                  onChange={(e) => setEditForm({...editForm, userId: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Class:</label>
                <select
                  value={editForm.class}
                  onChange={(e) => setEditForm({...editForm, class: e.target.value})}
                  required
                >
                  <option value="">Select Class</option>
                  {uniqueClasses.map(cls => (
                    <option key={`edit-class-${cls}`} value={cls}>Class {cls}</option>
                  ))}
                </select>
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
