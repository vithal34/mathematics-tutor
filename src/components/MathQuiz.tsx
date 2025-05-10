import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MathJax } from 'better-react-mathjax';
import { quizData } from '../data/quizData';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface MathQuizProps {
  topic: 'limits' | 'derivatives' | 'integration' | 'series';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  onComplete?: (score: number, totalQuestions: number) => void;
}

const MathQuiz: React.FC<MathQuizProps> = ({ topic, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const contentKey = `${topic}-quiz-content`;
  const questions = quizData[contentKey] || [];

  useEffect(() => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setScore(0);
  }, [topic]);

  const handleAnswer = (answerIndex: number) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion] = answerIndex;
      return newAnswers;
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    const finalScore = questions.reduce((acc, question, index) => {
      return acc + (answers[index] === question.correctAnswer ? 1 : 0);
    }, 0);

    setScore(finalScore);
    setShowResults(true);
    onComplete?.(finalScore, questions.length);
  };

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-4">No Questions Available</h3>
        <p className="text-gray-600">
          There are no questions available for the topic "{topic}". Please try another topic.
        </p>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`
            }}
          ></div>
        </div>

        {/* Question Counter */}
        <div className="text-sm text-gray-500">
          Question {currentQuestion + 1} of {questions.length}
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">{currentQ.question}</h3>
          
          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  answers[currentQuestion] === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                } ${
                  showResults
                    ? index === currentQ.correctAnswer
                      ? 'border-green-500 bg-green-50'
                      : answers[currentQuestion] === index
                      ? 'border-red-500 bg-red-50'
                      : ''
                    : ''
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  checked={answers[currentQuestion] === index}
                  onChange={() => handleAnswer(index)}
                  className="hidden"
                  disabled={showResults}
                />
                <span className="flex-1">{option}</span>
              </label>
            ))}
          </div>

          {/* Explanation (shown after answering) */}
          {showResults && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
              <p className="text-blue-700">{currentQ.explanation}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-6 flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`px-4 py-2 rounded-md ${
                currentQuestion === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={showResults}
                className={`px-4 py-2 rounded-md ${
                  showResults
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            )}
          </div>
        </div>

        {/* Results Summary */}
        {showResults && (
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Quiz Results</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {score} / {questions.length}
              </div>
              <p className="text-gray-600">
                {score === questions.length
                  ? 'Perfect score! Excellent work!'
                  : score >= questions.length * 0.7
                  ? 'Great job! Keep practicing!'
                  : 'Keep studying! You\'ll get better!'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MathQuiz; 