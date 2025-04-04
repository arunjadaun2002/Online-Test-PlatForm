import React, { useEffect, useState } from 'react';
import './AddStudent.css'; // We can reuse the same CSS

function EditStudent({ student, onClose, onEditStudent }) {
  const [studentData, setStudentData] = useState({
    name: student.name || '',
    userId: student.userId || '',
    password: student.password || '',
    phone: student.phone || '',
    email: student.email || '',
    class: student.class || '',
    address: student.address || ''
  });

  useEffect(() => {
    setStudentData(student);
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onEditStudent(student.id, studentData);
    onClose();
  };

  const handleReset = () => {
    setStudentData({
      name: student.name || '',
      userId: student.userId || '',
      password: student.password || '',
      phone: student.phone || '',
      email: student.email || '',
      class: student.class || '',
      address: student.address || ''
    });
  };

  return (
    <div className="add-student-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Student</h2>
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
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={studentData.phone}
                onChange={handleChange}
                placeholder="+1 800 123-34-45"
                required
              />
            </div>

            <div className="form-group">
              <label>User-ID</label>
              <input
                type="text"
                name="userId"
                value={studentData.userId}
                onChange={handleChange}
                placeholder="user id"
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
                placeholder="Enter your email"
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
                placeholder="Leave blank to keep current password"
              />
            </div>

            <div className="form-group">
              <label>Class</label>
              <input
                type="text"
                name="class"
                value={studentData.class}
                onChange={handleChange}
                placeholder="Enter Class Name"
                required
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Address</label>
            <textarea
              name="address"
              value={studentData.address}
              onChange={handleChange}
              placeholder="Student Address"
              required
            />
          </div>

          <div className="button-group">
            <button type="button" className="reset-btn" onClick={handleReset}>
              Reset
            </button>
            <button type="submit" className="add-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditStudent;
