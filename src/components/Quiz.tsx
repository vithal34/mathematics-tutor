import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { quizQuestions } from '../data/quizQuestions';
import { courses } from '../data/courseStructure';

const Quiz: React.FC = () => {
  const { courseId, moduleId, lessonId } = useParams<{ courseId: string; moduleId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { updateProgress } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completed, setCompleted] = useState(false);

  const course = courses[courseId as keyof typeof courses];
  const module = course?.modules.find(m => m.id === moduleId);
  const lesson = module?.lessons.find(l => l.id === lessonId);
  const questions = quizQuestions[`${moduleId}-quiz`] || [];
  const currentQ = questions[currentQuestion];

  useEffect(() => {
    if (completed) {
      const scorePercentage = (score / questions.length) * 100;
      updateProgress(lessonId!, {
        completed: true,
        quizScores: [scorePercentage],
        lastStudied: new Date().toISOString()
      });
    }
  }, [completed, score, questions.length, lessonId, updateProgress]);

  if (!course || !module || !lesson) {
    navigate('/');
    return null;
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    if (answer === currentQ.correctAnswer) {
      setScore(prev => prev + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setCompleted(true);
    }
  };

  if (completed) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Completed!</h2>
          <p className="text-lg text-gray-700 mb-6">
            Your score: {score} out of {questions.length} ({Math.round((score / questions.length) * 100)}%)
          </p>
          <button
            onClick={() => navigate(`/course/${courseId}/module/${moduleId}`)}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Return to Module
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Quiz: {module.title}</h2>
            <span className="text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{currentQ.question}</h3>
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !selectedAnswer && handleAnswerSelect(option)}
                  className={`w-full text-left p-4 rounded-lg border ${
                    selectedAnswer === option
                      ? option === currentQ.correctAnswer
                        ? 'bg-green-100 border-green-500'
                        : 'bg-red-100 border-red-500'
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                  disabled={!!selectedAnswer}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {showExplanation && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Explanation:</h4>
              <p className="text-gray-700">{currentQ.explanation}</p>
            </div>
          )}

          {selectedAnswer && (
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz; 