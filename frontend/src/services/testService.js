import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found in localStorage');
        throw new Error('Authentication token not found');
    }
    return {
        Authorization: `Bearer ${token}`
    };
};

export const getTestResults = async (testId) => {
    try {
        const response = await axios.get(`/api/student/test-results/${testId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching test results:', error);
        throw error;
    }
};

export const getAllTestResults = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.get('/api/student/test-results', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('API Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching test results:', error);
        throw error;
    }
}; 