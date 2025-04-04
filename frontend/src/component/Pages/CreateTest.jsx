// 📁 Pages/CreateTest.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizzes } from './QuizContext'; // ✅ Make sure this path is correct
import './CreateTest.css';

function CreateTest() {
  const navigate = useNavigate();
  const { addQuiz } = useQuizzes(); // ✅ Destructure it properly

  const [testData, setTestData] = useState({
    title: '',
    description: '',
    totalQuestions: '',
    timeInMinutes: '',
    perQuestionMark: ''
  });

  const handleTestDataChange = (e) => {
    const { name, value } = e.target;
    setTestData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newQuiz = {
      title: testData.title,
      description: testData.description,
      time: parseInt(testData.timeInMinutes),
      perQuestionMark: parseInt(testData.perQuestionMark),
      totalQuestions: parseInt(testData.totalQuestions)
    };

    addQuiz(newQuiz);
    navigate('/quiz');
  };

  return (
    <div className="create-test-container">
      <div className="test-details-form">
        <h2>Create New Test</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Test Title</label>
            <input
              type="text"
              name="title"
              value={testData.title}
              onChange={handleTestDataChange}
              placeholder="Enter test title"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={testData.description}
              onChange={handleTestDataChange}
              placeholder="Enter test description"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Total Questions</label>
              <input
                type="number"
                name="totalQuestions"
                value={testData.totalQuestions}
                onChange={handleTestDataChange}
                placeholder="Enter total questions"
                required
              />
            </div>

            <div className="form-group half">
              <label>Time (in minutes)</label>
              <input
                type="number"
                name="timeInMinutes"
                value={testData.timeInMinutes}
                onChange={handleTestDataChange}
                placeholder="Enter time duration"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Marks Per Question</label>
            <input
              type="number"
              name="perQuestionMark"
              value={testData.perQuestionMark}
              onChange={handleTestDataChange}
              placeholder="Enter marks per question"
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Create Test
          </button>
        </form>
      </div>

      <div className="question-options">
        <div className="option-card file-upload" onClick={() => {}}>
          <div className="card-content">
            <i className="fas fa-file-upload"></i>
            <h3>Add Question</h3>
            <p>Using File</p>
          </div>
        </div>

        <div className="option-card manual-entry" onClick={() => {}}>
          <div className="card-content">
            <i className="fas fa-question-circle"></i>
            <h3>Add Question</h3>
            <p>Manually</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTest;
