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
    userId: '',
    password: ''
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
      userId: student.userId,
      password: ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // First update the student's basic info
      const response = await fetch('http://localhost:4000/api/admin/update-student', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentId: editingStudent._id,
          name: editForm.name,
          email: editForm.email,
          class: editForm.class,
          userId: editForm.userId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update student');
      }

      // If password is provided, update it separately
      if (editForm.password) {
        const passwordResponse = await fetch('http://localhost:4000/api/admin/student/password', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            studentId: editingStudent._id,
            newPassword: editForm.password
          })
        });

        if (!passwordResponse.ok) {
          const errorData = await passwordResponse.json();
          throw new Error(errorData.message || 'Failed to update password');
        }
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
        <h1>Students</h1>
        <div className="header-actions">
          <button className="add-student-btn" onClick={() => navigate('/admin/add-student')}>
            Add Student
          </button>
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="class-grid">
        {uniqueClasses.map((cls) => (
          <div key={cls} className="class-card" onClick={() => handleClassClick(cls)}>
            <h2>Class {cls}</h2>
            <p>{studentsByClass[cls]?.length || 0} Students</p>
          </div>
        ))}
      </div>

      {selectedClass && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Class {selectedClass} Students</h2>
              <button className="close-btn" onClick={handleCloseClassModal}>&times;</button>
            </div>
            <div className="students-table-container">
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
                      <td className="action-buttons">
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

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="modal">
          <div className="modal-content edit-modal-content">
            <div className="modal-header">
              <h2>Edit Student Information</h2>
              <button className="close-btn" onClick={() => setEditingStudent(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditSubmit} className="edit-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Class</label>
                    <select
                      value={editForm.class}
                      onChange={(e) => setEditForm({...editForm, class: e.target.value})}
                      required
                    >
                      {uniqueClasses.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>User ID</label>
                    <input
                      type="text"
                      value={editForm.userId}
                      onChange={(e) => setEditForm({...editForm, userId: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>New Password (Optional)</label>
                  <input
                    type="password"
                    value={editForm.password}
                    onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                    placeholder="Leave blank to keep current password"
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setEditingStudent(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Email Student Modal */}
      {emailingStudent && (
        <div className="modal">
          <div className="modal-content email-modal-content">
            <div className="modal-header">
              <div className="email-header-info">
                <h2>Send Email</h2>
                <p className="email-recipient">To: {emailingStudent.name}</p>
              </div>
              <button className="close-btn" onClick={() => setEmailingStudent(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEmailSubmit} className="email-form">
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                    placeholder="Enter email subject"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    value={emailForm.message}
                    onChange={(e) => setEmailForm({...emailForm, message: e.target.value})}
                    placeholder="Type your message here..."
                    rows="6"
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setEmailingStudent(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="send-btn">
                    Send Email
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
