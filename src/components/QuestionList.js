import React, { useState, useEffect } from "react";
import QuestionForm from "./QuestionForm";


function QuestionList() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then(response => response.json())
      .then(data => setQuestions(data))
      .catch(error => console.error("Error fetching questions:", error));
  }, []);

  const handleAddQuestion = (newQuestion) => {
    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuestion),
    })
  .then(response => response.json())
    .then(data => setQuestions((prevQuestions) => [...prevQuestions, data]))
    .catch(error => console.error("Error adding question:", error));
};

const handleDeleteQuestion = (id) => {
  fetch(`http://localhost:4000/questions/${id}`, {
    method: "DELETE",
  })
    .then(() => {
      const updatedQuestions = questions.filter((question) => question.id !== id);
      setQuestions(updatedQuestions);
    })
    .catch((error) => console.error("Error deleting question:", error));
}

const handleUpdateQuestion = (id, correctIndex) => {
  fetch(`http://localhost:4000/questions/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ correctIndex: parseInt(correctIndex) }),
  }).
    then(() => {
      const updatedQuestions = questions.map(question =>
        question.id === id ? { ...question, correctIndex: parseInt(correctIndex) } : question);
      setQuestions(updatedQuestions);
    })
}
  
return (
  <section>
    <h1>Quiz Questions</h1>
    <QuestionForm onAddQuestion={handleAddQuestion} />
    <ul>
      {questions.map((question) => (
        <li key={question.id}>
          <h2>Question {question.id}</h2>
          <p>{question.prompt}</p>
          <ul>
            {question.answers.map((answer, index) => (
              <li key={index}>{answer}</li>
            ))}
          </ul>
          <label>
            Correct Answer:
            <select
              value={question.correctIndex}
                onChange={(e) => handleUpdateQuestion(question.id, e.target.value)}>
              {question.answers.map((_, index) => (
                <option key={index} value={index}>
                  {`Answer ${index + 1}`}
                </option>
              ))}
            </select>
          </label>
          <button onClick={() => handleDeleteQuestion(question.id)}>Delete Question</button>
        </li>
      )
      )};
    </ul>
  </section>
);
}

export default QuestionList;