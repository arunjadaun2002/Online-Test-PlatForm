import React, { createContext, useContext, useState } from 'react';

const StudentContext = createContext();

export function StudentProvider({ children }) {
  const [students, setStudents] = useState([
    {
      id: 1,
      rollNo: "1",
      name: "Yaman",
      email: "user1@gmail.com",
      phone: "70884554564",
      role: "Student"
    },
    {
      id: 2,
      rollNo: "2",
      name: "Ayush",
      email: "ayush1@gmail.com",
      phone: "99343434333",
      role: "Student"
    },
    {
      id: 3,
      rollNo: "3",
      name: "Lahudi",
      email: "rahul@gmail.com",
      phone: "70344555064",
      role: "Student"
    }
  ]);

  const getNextRollNumber = () => {
    if (students.length === 0) return "1";
    const maxRollNo = Math.max(...students.map(s => parseInt(s.rollNo)));
    return String(maxRollNo + 1);
  };

  const addStudent = (newStudent) => {
    const nextRollNo = getNextRollNumber();
    setStudents(prev => [...prev, {
      ...newStudent,
      rollNo: nextRollNo,
      id: Date.now()
    }]);
  };

  const deleteStudent = (id) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const editStudent = (id, updatedData) => {
    setStudents(prev => prev.map(student => 
      student.id === id ? { ...student, ...updatedData } : student
    ));
  };

  const deleteAllStudents = () => {
    setStudents([]);
  };

  return (
    <StudentContext.Provider value={{
      students,
      addStudent,
      deleteStudent,
      editStudent,
      deleteAllStudents,
      studentCount: students.length
    }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudents() {
  return useContext(StudentContext);
}
