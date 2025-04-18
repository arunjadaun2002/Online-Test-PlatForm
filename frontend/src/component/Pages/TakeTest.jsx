const handleAnswerSelect = (questionIndex, selectedOption) => {
  // Get the actual value of the selected option
  const selectedValue = testData.questions[questionIndex].options[selectedOption];
  
  setAnswers((prev) => {
    const newAnswers = { ...prev, [questionIndex]: selectedValue };
    return newAnswers;
  });
}; 