import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './TestInstructions.css';

const TestInstructions = () => {
    const navigate = useNavigate();
    const { testId } = useParams();
    const [isChecked, setIsChecked] = useState(false);

    const handleStartTest = async () => {
        if (!isChecked) {
            alert('Please read and accept the instructions before starting the test.');
            return;
        }

        try {
            // Request fullscreen mode
            if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                await document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                await document.documentElement.msRequestFullscreen();
            }

            // Store test start time in localStorage
            localStorage.setItem('testStartTime', Date.now());
            localStorage.setItem('tabSwitchCount', '0');

            // Navigate to test page
            navigate(`/student/take-test/${testId}`);
        } catch (err) {
            console.error('Error entering fullscreen:', err);
            alert('Please allow fullscreen mode to start the test.');
        }
    };

    return (
        <div className="instructions-page">
            <div className="instructions-container">
                <h1>Test Instructions</h1>
                <div className="instruction-content">
                    <h2>Please Read The Instructions Carefully Before Starting The Test</h2>
                    
                    <div className="instruction-list">
                        <div className="instruction-item">
                            <p>1. The test will open in fullscreen mode. Do not switch tabs or windows.</p>
                        </div>
                        <div className="instruction-item">
                            <p>2. Switching tabs more than 3 times will result in automatic test submission.</p>
                        </div>
                        <div className="instruction-item">
                            <p>3. The test will be automatically submitted when the time is up.</p>
                        </div>
                        <div className="instruction-item">
                            <p>4. Do not use any external resources or applications during the test.</p>
                        </div>
                        <div className="instruction-item">
                            <p>5. Your screen will be monitored for any suspicious activity.</p>
                        </div>
                        <div className="instruction-item">
                            <p>6. Click Start Test On Bottom Of Your Screen To Begin The Test.</p>
                        </div>
                        <div className="instruction-item">
                            <p>7. The Clock Has Been Set At Server And Count Down Timer At The Top Right Side Of The Screen Will Display Left Out Time To Closure From Where You Can Monitor.</p>
                        </div>
                        <div className="instruction-item">
                            <p>8. Click One Of The Answer Simply Click The Desired Option Button.</p>
                        </div>
                        <div className="instruction-item">
                            <p>9. Candidate Can Change Their Response Of Attempted Answer Anytime During Examination Slot Time By Clicking Another Answer Which Candidates Want To Change An Answer. Click To Remove Incorrect Answer, Click The Desired Option Button.</p>
                        </div>
                        <div className="instruction-item">
                            <p>10. Click On Next To Save The Answer And Move To The Next Question. The Next Question Will Automatically Be Displayed.</p>
                        </div>
                        <div className="instruction-item">
                            <p>11. Click On Mark For Review To Review You Answer At Later Stage.</p>
                        </div>
                        <div className="instruction-item">
                            <p>12. To Select A Question, Click On The Question Number On The Right Side Of The Screen.</p>
                        </div>
                    </div>

                    <div className="confirmation-section">
                        <div className="checkbox-container">
                            <input 
                                type="checkbox" 
                                id="instructions-checkbox"
                                checked={isChecked}
                                onChange={(e) => setIsChecked(e.target.checked)}
                            />
                            <label htmlFor="instructions-checkbox">
                                I have read and understood all the instructions. I agree to take the test in fullscreen mode and understand that switching tabs more than 3 times will result in automatic submission.
                            </label>
                        </div>
                        <button 
                            className="start-test-btn"
                            onClick={handleStartTest}
                            disabled={!isChecked}
                        >
                            Start Test
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestInstructions; 