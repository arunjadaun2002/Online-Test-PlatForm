import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./TakeTest.css";

const TakeTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [showQuestionPalette, setShowQuestionPalette] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [sections, setSections] = useState([]);
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState(0);

  useEffect(() => {
    fetchTestData();
    setupSecurityFeatures();
    return () => {
      cleanupSecurityFeatures();
    };
  }, [testId]);

  useEffect(() => {
    if (test && test.questions) {
      // Group questions into sections
      const groupedSections = test.questions.reduce((acc, question, index) => {
        const sectionIndex = Math.floor(index / 5); // 5 questions per section
        if (!acc[sectionIndex]) {
          acc[sectionIndex] = {
            startIndex: sectionIndex * 5,
            endIndex: Math.min((sectionIndex + 1) * 5, test.questions.length),
            questions: [],
          };
        }
        acc[sectionIndex].questions.push(question);
        return acc;
      }, []);
      setSections(groupedSections);
    }
  }, [test]);

  const setupSecurityFeatures = () => {
    // Add event listeners for fullscreen change
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    // Add event listeners for visibility change
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Add event listeners for blur/focus
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);
  };

  const cleanupSecurityFeatures = () => {
    document.removeEventListener("fullscreenchange", handleFullscreenChange);
    document.removeEventListener(
      "webkitfullscreenchange",
      handleFullscreenChange
    );
    document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
    document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("blur", handleWindowBlur);
    window.removeEventListener("focus", handleWindowFocus);
  };

  const handleFullscreenChange = () => {
    const isInFullscreen =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement;

    setIsFullscreen(!!isInFullscreen);

    if (!isInFullscreen) {
      setShowFullscreenWarning(true);
      setWarningCount((prev) => {
        const newCount = prev + 1;
        if (newCount >= 3) {
          handleSubmitTest();
        }
        return newCount;
      });
    }
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      incrementTabSwitchCount();
    }
  };

  const handleWindowBlur = () => {
    incrementTabSwitchCount();
  };

  const handleWindowFocus = () => {
    if (!isFullscreen) {
      enterFullscreen();
    }
  };

  const enterFullscreen = async () => {
    try {
      setShowFullscreenWarning(false);
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        await document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        await document.documentElement.msRequestFullscreen();
      }
    } catch (err) {
      console.error("Error entering fullscreen:", err);
    }
  };

  const incrementTabSwitchCount = () => {
    if (isTestSubmitted) return;

    const currentCount = parseInt(
      localStorage.getItem("tabSwitchCount") || "0"
    );
    const newCount = currentCount + 1;
    localStorage.setItem("tabSwitchCount", newCount.toString());

    if (newCount === 1) {
      setWarningMessage(
        "Warning: You have switched tabs 1 time. You have 2 attempts remaining."
      );
      setShowWarning(true);
    } else if (newCount === 2) {
      setWarningMessage(
        "Warning: You have switched tabs 2 times. You have 1 attempt remaining."
      );
      setShowWarning(true);
    } else if (newCount >= 3) {
      handleSubmitTest();
    }
  };

  const handleWarningConfirm = () => {
    setShowWarning(false);
    enterFullscreen();
  };

  const handleWarningCancel = () => {
    setShowWarning(false);
  };

  // Add keyboard event listener to prevent shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent F11, F12, Ctrl+R, Ctrl+Shift+R, Ctrl+W, Alt+Tab, etc.
      if (
        e.key === "F11" ||
        e.key === "F12" ||
        (e.ctrlKey && e.key === "r") ||
        (e.ctrlKey && e.shiftKey && e.key === "r") ||
        (e.ctrlKey && e.key === "w") ||
        (e.altKey && e.key === "Tab")
      ) {
        e.preventDefault();
        incrementTabSwitchCount();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Add context menu prevention
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  // Add copy/paste prevention
  useEffect(() => {
    const handleCopyPaste = (e) => {
      e.preventDefault();
    };

    document.addEventListener("copy", handleCopyPaste);
    document.addEventListener("paste", handleCopyPaste);
    document.addEventListener("cut", handleCopyPaste);
    return () => {
      document.removeEventListener("copy", handleCopyPaste);
      document.removeEventListener("paste", handleCopyPaste);
      document.removeEventListener("cut", handleCopyPaste);
    };
  }, []);

  useEffect(() => {
    let timer;
    if (remainingTime > 0 && !isTestSubmitted) {
      timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitTest();
            return 0;
          }
          // Show warning when 5 minutes remaining
          if (prev === 300) {
            setShowTimeWarning(true);
            setTimeout(() => setShowTimeWarning(false), 5000);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [remainingTime, isTestSubmitted]);

  const fetchTestData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log('Fetching test data for testId:', testId);

      const response = await fetch(
        `http://localhost:4000/api/student/tests/${testId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error('Error response from server:', data);
        throw new Error(data.message || "Failed to fetch test data");
      }

      if (!data.success) {
        console.error('Unsuccessful response:', data);
        throw new Error(data.message || "Failed to fetch test data");
      }

      if (!data.data || !data.data.questions || !Array.isArray(data.data.questions)) {
        console.error('Invalid data format:', data);
        throw new Error("Invalid test data format");
      }

      console.log('Successfully fetched test data:', {
        testId: data.data._id,
        questionCount: data.data.questions.length
      });

      setTest(data.data);
      const duration = data.data.timeInMinutes * 60;
      setRemainingTime(duration);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching test:", err);
      setError(err.message || "Failed to load test. Please try again later.");
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, selectedOption) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev, [questionIndex]: selectedOption };
      const answeredCount = Object.keys(newAnswers).length;
      setAnsweredQuestions(answeredCount);
      return newAnswers;
    });
  };

  const handleSectionNavigation = (direction) => {
    if (direction === "next" && currentSection < sections.length - 1) {
      setCurrentSection((prev) => prev + 1);
    } else if (direction === "prev" && currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
    }
  };

  const handleMarkForReview = () => {
    if (!markedForReview.includes(currentQuestion)) {
      setMarkedForReview((prev) => [...prev, currentQuestion]);
    } else {
      setMarkedForReview((prev) => prev.filter((q) => q !== currentQuestion));
    }
  };

  const handleClearResponse = () => {
    setAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[currentQuestion];
      return newAnswers;
    });
    setAnsweredQuestions(Object.keys(answers).length - 1);
  };

  const handleSaveAndNext = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handleSubmitTest = async () => {
    if (isTestSubmitted) return; // Prevent multiple submissions

    try {
      setIsTestSubmitted(true);

      // Convert answer indices to actual answer text
      const answerTexts = {};
      Object.keys(answers).forEach(questionIndex => {
        const selectedOptionIndex = answers[questionIndex];
        answerTexts[questionIndex] = test.questions[questionIndex].options[selectedOptionIndex];
      });

      // Prepare result data
      const resultData = {
        testId: testId,
        answers: answerTexts,
        tabSwitchCount: parseInt(localStorage.getItem("tabSwitchCount") || "0"),
        testDuration: test.timeInMinutes * 60 - remainingTime,
        testTitle: test.title,
        totalQuestions: test.questions.length,
        rightMarks: test.rightMarks,
        negativeMarks: test.negativeMarks || 0,
        questions: test.questions.map((q, index) => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          selectedAnswer: answerTexts[index] || null,
          isCorrect: answerTexts[index] === q.correctAnswer
        }))
      };

      console.log('Submitting test with data:', {
        testId,
        resultData
      });

      // Send result data to backend
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:4000/api/student/tests/${testId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(resultData)
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Submit test error response:', responseData);
        throw new Error(responseData.message || 'Failed to submit test');
      }

      console.log('Test submitted successfully:', responseData);
      
      // Show success message and navigate to attempted tests page
      alert('Test submitted successfully!');
      navigate("/student/attempted");
    } catch (err) {
      console.error("Error submitting test:", err);
      setError(err.message || 'Failed to submit test');
      setIsTestSubmitted(false); // Allow retry if submission fails
    }
  };

  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) return "00:00:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  const handleQuestionClick = (index) => {
    setCurrentQuestion(index);
    setSelectedQuestion(index);
  };

  const getQuestionStatus = (index) => {
    if (markedForReview.includes(index)) {
      return "marked";
    }
    if (answers[index]) {
      return "answered";
    }
    return "not-answered";
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!test) return <div className="error">Test not found</div>;

  return (
    <div className="test-container">
      {showInstructions ? (
        <div className="instructions-content">
          <h2>Test Instructions</h2>
          <div className="instructions-list">
            <p>Please read the following instructions carefully:</p>
            <ul>
              <li>Total Questions: {test?.questions?.length || 0}</li>
              <li>Time Duration: {test?.timeInMinutes || 0} minutes</li>
              <li>Each question carries {test?.rightMarks || 0} marks</li>
              <li>Negative marking: {test?.negativeMarks || 0} marks</li>
            </ul>
            <button 
              className="start-test-btn" 
              onClick={() => setShowInstructions(false)}
            >
              Start Test
            </button>
          </div>
        </div>
      ) : (
        <div className="test-content">
          <div className="test-header">
            <h2>{test?.title}</h2>
            <div className="test-info">
              <span>Time Remaining: {formatTime(remainingTime)}</span>
              <span>Questions: {currentQuestion + 1}/{test?.questions?.length || 0}</span>
            </div>
          </div>
          
          <div className="test-main-content">
            {/* Left side - Question and options */}
            <div className="question-section">
              {test?.questions && test.questions[currentQuestion] ? (
                <div className="question-content">
                  <h3>Question {currentQuestion + 1}</h3>
                  <p>{test.questions[currentQuestion].question}</p>
                  <div className="options-list">
                    {test.questions[currentQuestion].options.map((option, optionIndex) => (
                      <label 
                        key={`question-${currentQuestion}-option-${optionIndex}`} 
                        className="option-label"
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestion}`}
                          value={option}
                          checked={answers[currentQuestion] === option}
                          onChange={() => handleAnswerSelect(currentQuestion, option)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                  <div className="question-actions">
                    <button onClick={handleClearResponse}>Clear Response</button>
                    <button onClick={handleMarkForReview}>
                      {markedForReview.includes(currentQuestion)
                        ? "Unmark for Review"
                        : "Mark for Review"}
                    </button>
                    <button onClick={handleSaveAndNext}>Save & Next</button>
                  </div>
                </div>
              ) : (
                <div className="error">Question not found</div>
              )}
            </div>

            {/* Right side - Question Navigation Panel */}
            <div className="question-navigation-panel">
              <div className="navigation-header">
                <h3>Question Navigation</h3>
                <div className="navigation-legend">
                  <div className="legend-item">
                    <span className="legend-color not-answered"></span>
                    <span>Not Answered</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color answered"></span>
                    <span>Answered</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color marked"></span>
                    <span>Marked for Review</span>
                  </div>
                </div>
              </div>
              <div className="question-grid">
                {test?.questions?.map((_, index) => (
                  <button
                    key={`nav-question-${index}`}
                    className={`question-number ${getQuestionStatus(index)} ${
                      currentQuestion === index ? "current" : ""
                    }`}
                    onClick={() => handleQuestionClick(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button 
                className="submit-test-btn"
                onClick={handleSubmitTest}
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      )}

      {showWarning && (
        <div className="warning-modal">
          <div className="warning-content">
            <p>{warningMessage}</p>
            <div className="warning-buttons">
              <button onClick={handleWarningConfirm}>OK</button>
              <button onClick={handleWarningCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {showTimeWarning && (
        <div className="time-warning-modal">
          <div className="warning-content">
            <p>Only 5 minutes remaining! Please complete your test.</p>
          </div>
        </div>
      )}
      {showFullscreenWarning && (
        <div className="fullscreen-warning">
          <p>Please return to fullscreen mode to continue the test.</p>
          <p>Warning {warningCount}/3</p>
          <button onClick={enterFullscreen}>Return to Fullscreen</button>
        </div>
      )}
    </div>
  );
};

export default TakeTest;