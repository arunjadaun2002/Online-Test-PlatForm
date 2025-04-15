// 📁 Pages/CreateTest.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateTest.css';

function CreateTest() {
  const navigate = useNavigate();

  const [testData, setTestData] = useState({
    title: '',
    description: '',
    totalQuestions: '',
    timeInMinutes: '',
    perQuestionMark: '',
    class: ''
  });

  const [questions, setQuestions] = useState([]);
  const [manualQuestion, setManualQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: ''
  });

  const handleTestDataChange = (e) => {
    const { name, value } = e.target;
    setTestData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target.result;
          const parsedQuestions = parseQuestionsFromFile(content);
          setQuestions(prev => [...prev, ...parsedQuestions]);
        } catch {
          alert('Error parsing file. Please check the format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const parseQuestionsFromFile = (content) => {
    const lines = content.split('\n');
    const parsedQuestions = [];
    let currentQuestion = null;

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      if (!line.startsWith('A)') && !line.startsWith('B)') && !line.startsWith('C)') && !line.startsWith('D)') && !line.startsWith('Answer:')) {
        if (currentQuestion) {
          parsedQuestions.push(currentQuestion);
        }
        currentQuestion = {
          question: line,
          options: ['', '', '', ''],
          correctAnswer: ''
        };
      } else if (line.startsWith('A)')) {
        currentQuestion.options[0] = line.substring(2).trim();
      } else if (line.startsWith('B)')) {
        currentQuestion.options[1] = line.substring(2).trim();
      } else if (line.startsWith('C)')) {
        currentQuestion.options[2] = line.substring(2).trim();
      } else if (line.startsWith('D)')) {
        currentQuestion.options[3] = line.substring(2).trim();
      } else if (line.startsWith('Answer:')) {
        currentQuestion.correctAnswer = line.substring(7).trim();
      }
    }
    if (currentQuestion) {
      parsedQuestions.push(currentQuestion);
    }
    return parsedQuestions;
  };

  const handleManualQuestionChange = (e) => {
    const { name, value } = e.target;
    if (name === 'question') {
      setManualQuestion(prev => ({ ...prev, question: value }));
    } else if (name.startsWith('option')) {
      const optionIndex = parseInt(name.replace('option', ''));
      setManualQuestion(prev => ({
        ...prev,
        options: prev.options.map((opt, i) => i === optionIndex ? value : opt)
      }));
    } else if (name === 'correctAnswer') {
      setManualQuestion(prev => ({ ...prev, correctAnswer: value }));
    }
  };

  const addManualQuestion = () => {
    if (!manualQuestion.question || !manualQuestion.correctAnswer || 
        manualQuestion.options.some(opt => !opt)) {
      alert('Please fill all fields');
      return;
    }

    // Validate that correct answer matches one of the options
    if (!manualQuestion.options.includes(manualQuestion.correctAnswer)) {
      alert('Correct answer must match one of the options');
      return;
    }

    setQuestions(prev => [...prev, { ...manualQuestion }]);
    setManualQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!testData.title) {
      alert('Please enter a test title');
      return;
    }

    if (!testData.class) {
      alert('Please select a class');
      return;
    }

    if (!testData.timeInMinutes) {
      alert('Please enter the time duration');
      return;
    }

    if (!testData.perQuestionMark) {
      alert('Please enter marks per question');
      return;
    }

    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    try {
      const newQuiz = {
        title: testData.title,
        description: testData.description || '',
        totalQuestion: questions.length,
        rightMarks: parseInt(testData.perQuestionMark),
        wrongMarks: 0,
        subject: 'General',
        sectionId: Date.now().toString(),
        class: testData.class,
        timeInMinutes: parseInt(testData.timeInMinutes),
        questions: questions.map(q => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer
        }))
      };

      console.log('Sending quiz data:', newQuiz);

      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to create a quiz');
        return;
      }

      const response = await fetch('http://localhost:4000/api/test/typedtest/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newQuiz)
      });

      const data = await response.json();
      console.log('Response from server:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create quiz');
      }

      if (data.success) {
        alert('Quiz created successfully!');
        navigate('/admin/quiz');
      } else {
        throw new Error(data.message || 'Failed to create quiz');
      }
    } catch (err) {
      console.error('Error creating quiz:', err);
      alert(err.message || 'Failed to create quiz. Please try again.');
    }
  };

  return (
    <div className="create-test-container">
      {/* Test Details Form */}
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

          <div className="form-group">
            <label>Class</label>
            <select
              name="class"
              value={testData.class}
              onChange={handleTestDataChange}
              required
            >
              <option value="">Select Class</option>
              <option value="Class 1">Class 1</option>
              <option value="Class 2">Class 2</option>
              <option value="Class 3">Class 3</option>
              <option value="Class 4">Class 4</option>
              <option value="Class 5">Class 5</option>
              <option value="Class 6">Class 6</option>
              <option value="Class 7">Class 7</option>
              <option value="Class 8">Class 8</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
              <option value="Class 11">Class 11</option>
              <option value="Class 12">Class 12</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">
            Create Test
          </button>
        </form>
      </div>

      {/* Question Addition Options */}
      <div className="question-options">
        <div className="option-card file-upload">
          <div className="card-content">
            <i className="fas fa-file-upload"></i>
            <h3>Add Questions via File</h3>
            <p>Upload a text file with questions</p>
            <input 
              type="file" 
              accept=".txt"
              onChange={handleFileUpload}
              style={{ marginTop: '10px' }}
            />
          </div>
        </div>

        <div className="option-card manual-entry">
          <div className="card-content">
            <i className="fas fa-question-circle"></i>
            <h3>Add Question Manually</h3>
            <div className="manual-question-form">
              <input
                type="text"
                name="question"
                value={manualQuestion.question}
                onChange={handleManualQuestionChange}
                placeholder="Enter question"
                className="question-input"
              />
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  type="text"
                  name={`option${index}`}
                  value={manualQuestion.options[index]}
                  onChange={handleManualQuestionChange}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  className="option-input"
                />
              ))}
              <input
                type="text"
                name="correctAnswer"
                value={manualQuestion.correctAnswer}
                onChange={handleManualQuestionChange}
                placeholder="Enter the correct answer text (must match one of the options)"
                className="correct-answer-input"
              />
              <button 
                type="button" 
                onClick={addManualQuestion}
                className="add-question-btn"
              >
                Add Question
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Display Added Questions */}
      {questions.length > 0 && (
        <div className="added-questions">
          <h3>Added Questions ({questions.length})</h3>
          <div className="questions-list">
            {questions.map((q, index) => (
              <div key={index} className="question-item">
                <p><strong>Q{index + 1}:</strong> {q.question}</p>
                <p><strong>Correct Answer:</strong> {q.correctAnswer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateTest;
