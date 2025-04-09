import React, { useState } from 'react';
import AddStudent from '../Pages/AddStudent';
import EditStudent from '../Pages/EditStudent';
import { useStudents } from '../Pages/StudentContext';
import './students.css';

function Students() {
  const { 
    students, 
    addStudent, 
    deleteStudent, 
    editStudent, 
    deleteAllStudents 
  } = useStudents();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phone.includes(searchTerm)
  );

  const handleEdit = (student) => {
    setEditingStudent(student);
  };

  return (
    <div className="students-page">
      <div className="students-header">
        <div className="action-buttons">
          <button 
            className="add-student-btn"
            onClick={() => setShowAddModal(true)}
          >
            Add Student
          </button>
          <button 
            className="delete-all-btn" 
            onClick={deleteAllStudents}
          >
            Delete All
          </button>
        </div>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search ..." 
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="students-table">
        <table>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Student Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.rollNo}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.phone}</td>
                <td>{student.role}</td>
                <td className="action-buttons">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(student)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteStudent(student.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <AddStudent
          onClose={() => setShowAddModal(false)}
          onAddStudent={(newStudent) => {
            addStudent(newStudent);
            setShowAddModal(false);
          }}
        />
      )}

      {editingStudent && (
        <EditStudent
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onEditStudent={(id, updatedData) => {
            editStudent(id, updatedData);
            setEditingStudent(null);
          }}
        />
      )}
    </div>
  );
}

export default Students;
