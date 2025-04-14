import React from "react";
import { useLocation } from "react-router-dom";

const StudentResult = () => {
  const location = useLocation();
  const { testId, testTitle, totalQuestions, rightMarks, negativeMarks } =
    location.state || {};

  return (
    <div>
      <h1>Test Results</h1>
      <p>Test ID: {testId}</p>
      <p>Test Title: {testTitle}</p>
      <p>Total Questions: {totalQuestions}</p>
      <p>Marks per Correct Answer: {rightMarks}</p>
      <p>Negative Marks: {negativeMarks}</p>
    </div>
  );
};

export default StudentResult;
