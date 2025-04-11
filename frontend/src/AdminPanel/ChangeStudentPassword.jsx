import React, { useState } from 'react';
import './ChangeStudentPassword.css';

const ChangeStudentPassword = () => {
    const [formData, setFormData] = useState({
        studentId: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        // Validate passwords match
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Validate password strength
        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/admin/student/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    studentId: formData.studentId,
                    newPassword: formData.newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to change password');
            }

            setMessage('Password changed successfully');
            setFormData({
                studentId: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="change-password-container">
            <h2>Change Student Password</h2>
            <form onSubmit={handleSubmit} className="change-password-form">
                <div className="form-group">
                    <label htmlFor="studentId">Student ID</label>
                    <input
                        type="text"
                        id="studentId"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        required
                        placeholder="Enter student ID"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                        placeholder="Enter new password"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Confirm new password"
                    />
                </div>

                {error && <div className="error-message">{error}</div>}
                {message && <div className="success-message">{message}</div>}

                <button type="submit" className="submit-btn">
                    Change Password
                </button>
            </form>
        </div>
    );
};

export default ChangeStudentPassword; 