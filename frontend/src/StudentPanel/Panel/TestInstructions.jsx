import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './TestInstructions.css';

const TestInstructions = () => {
    const navigate = useNavigate();
    const { testId } = useParams();
    const [isChecked, setIsChecked] = useState(false);

    const handleStartTest = () => {
        if (!isChecked) {
            alert('Please read and accept the instructions before starting the test.');
            return;
        }
        console.log('Starting test with ID:', testId); // Debug log
        navigate(`/student/take-test/${testId}`);
    };

    return (
        <div className="instructions-page">
            <div className="instructions-container">
                <h1>Test Instructions</h1>
                <div className="instruction-content">
                    <h2>Please Read The Instructions Carefully Before Starting The Test</h2>
                    
                    <div className="instruction-list">
                        <div className="instruction-item">
                            <p>1. Click Start Test On Bottom Of Your Screen To Begin The Test.</p>
                        </div>
                        <div className="instruction-item">
                            <p>2. The Clock Has Been Set At Server And Count Down Timer At The Top Right Side Of The Screen Will Display Left Out Time To Closure From Where You Can Monitor.</p>
                        </div>
                        <div className="instruction-item">
                            <p>3. Click One Of The Answer Simply Click The Desired Option Button.</p>
                        </div>
                        <div className="instruction-item">
                            <p>4. Candidate Can Change Their Response Of Attempted Answer Anytime During Examination Slot Time By Clicking Another Answer Which Candidates Want To Change An Answer. Click To Remove Incorrect Answer, Click The Desired Option Button.</p>
                        </div>
                        <div className="instruction-item">
                            <p>5. Click On Next To Save The Answer And Move To The Next Question. The Next Question Will Automatically Be Displayed.</p>
                        </div>
                        <div className="instruction-item">
                            <p>6. Click On Mark For Review To Review You Answer At Later Stage.</p>
                        </div>
                        <div className="instruction-item">
                            <p>7. To Select A Question, Click On The Question Number On The Right Side Of The Screen.</p>
                        </div>
                        <div className="instruction-item">
                            <p>8. The Colour Coded Diagram On The Left Side Of The Screen Shows The Status Of The Question:</p>
                            <div className="status-indicators">
                                <div className="status-item">
                                    <span className="status-dot not-visited"></span>
                                    <p>You Have Not Visited The Question Yet.</p>
                                </div>
                                <div className="status-item">
                                    <span className="status-dot not-answered"></span>
                                    <p>You Have Not Answered The Question.</p>
                                </div>
                                <div className="status-item">
                                    <span className="status-dot answered"></span>
                                    <p>You Have Answered The Question.</p>
                                </div>
                                <div className="status-item">
                                    <span className="status-dot marked-review"></span>
                                    <p>You Have NOT Answered The Question, But Have Marked The Question For Review.</p>
                                </div>
                                <div className="status-item">
                                    <span className="status-dot answered-marked"></span>
                                    <p>You Have Answered The Question, But Marked It For Review.</p>
                                </div>
                            </div>
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
                                The Computer Provided To Me Is In Proper Working Condition.
                                I Have Read And Understood The Instructions Given Above.
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