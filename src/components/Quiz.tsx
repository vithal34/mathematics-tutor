import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { QuizQuestion } from '../types/user';

interface QuizProps {
  conceptId: string;
  onComplete: (score: number) => void;
}

const quizQuestions: Record<string, QuizQuestion[]> = {
  limits: [
    {
      id: 'lim1',
      conceptId: 'limits',
      question: 'What is the limit of (x² - 1)/(x - 1) as x approaches 1?',
      options: ['0', '1', '2', 'Does not exist'],
      correctAnswer: 2,
      explanation: 'As x approaches 1, this is an indeterminate form 0/0. By factoring (x+1)(x-1)/(x-1) = x+1, we get lim(x→1) (x+1) = 2',
      difficulty: 'basic',
      tags: ['factoring', 'indeterminate forms']
    },
    {
      id: 'lim2',
      conceptId: 'limits',
      question: 'For which value of a does lim(x→a) |x - a|/x not exist?',
      options: ['a = 0', 'a = 1', 'a = -1', 'It always exists'],
      correctAnswer: 0,
      explanation: 'When a = 0, the limit from the left gives -1 and from the right gives 1, so the limit does not exist.',
      difficulty: 'intermediate',
      tags: ['absolute value', 'one-sided limits']
    },
    {
      id: 'lim3',
      conceptId: 'limits',
      question: 'What is lim(x→∞) (x² + 2x)/(3x² - 1)?',
      options: ['0', '1/3', '∞', 'Does not exist'],
      correctAnswer: 1,
      explanation: 'Divide both numerator and denominator by x². Terms with lower powers of x approach 0 as x→∞.',
      difficulty: 'advanced',
      tags: ['infinity', 'rational functions']
    }
  ],
  derivatives: [
    {
      id: 'der1',
      conceptId: 'derivatives',
      question: 'What is the derivative of x·sin(x)?',
      options: ['sin(x)', 'x·cos(x)', 'sin(x) + x·cos(x)', 'cos(x)'],
      correctAnswer: 2,
      explanation: 'Using the product rule: d/dx[x·sin(x)] = 1·sin(x) + x·cos(x)',
      difficulty: 'basic',
      tags: ['product rule', 'trigonometry']
    },
    {
      id: 'der2',
      conceptId: 'derivatives',
      question: 'Find d/dx[ln(x²+1)]',
      options: ['2x/(x²+1)', '1/(x²+1)', '2/x', '2x/x²+1'],
      correctAnswer: 0,
      explanation: 'Using chain rule: d/dx[ln(u)] = u\'/u where u = x²+1. So d/dx[ln(x²+1)] = (2x)/(x²+1)',
      difficulty: 'intermediate',
      tags: ['chain rule', 'natural log']
    }
  ],
  integration: [
    {
      id: 'int1',
      conceptId: 'integration',
      question: 'What is ∫x·cos(x)dx?',
      options: ['sin(x) + x·cos(x)', 'x·sin(x)', 'x·sin(x) - sin(x)', 'x·sin(x) + cos(x)'],
      correctAnswer: 2,
      explanation: 'Using integration by parts with u=x and dv=cos(x)dx: ∫x·cos(x)dx = x·sin(x) - ∫sin(x)dx = x·sin(x) - (-cos(x)) = x·sin(x) - cos(x)',
      difficulty: 'advanced',
      tags: ['integration by parts', 'trigonometry']
    }
  ]
};

const Quiz: React.FC<QuizProps> = ({ conceptId, onComplete }) => {
  const { user, updateProgress } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ correct: boolean; time: number }[]>([]);
  const [timer, setTimer] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<'basic' | 'intermediate' | 'advanced'>('basic');

  const questions = quizQuestions[conceptId] || [];
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    const correct = answerIndex === currentQuestion.correctAnswer;
    if (correct) setScore(score + 1);
    
    setAnswers([...answers, { correct, time: timer }]);

    // Adjust difficulty based on performance
    if (answers.length >= 2) {
      const recentCorrect = answers.slice(-2).every(a => a.correct);
      const recentWrong = answers.slice(-2).every(a => !a.correct);
      
      if (recentCorrect && difficulty !== 'advanced') {
        setDifficulty(difficulty === 'basic' ? 'intermediate' : 'advanced');
      } else if (recentWrong && difficulty !== 'basic') {
        setDifficulty(difficulty === 'advanced' ? 'intermediate' : 'basic');
      }
    }
  };

  const nextQuestion = async () => {
    if (currentQuestionIndex === questions.length - 1) {
      const finalScore = Math.round((score / questions.length) * 100);
      await updateProgress(conceptId, {
        quizScores: [...(user?.progress[conceptId]?.quizScores || []), finalScore],
        lastAccessed: new Date().toISOString(),
      });
      onComplete(finalScore);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimer(0);
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-gray-500">
            Time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {currentQuestion.question}
        </h3>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
              className={`
                w-full p-4 text-left rounded-lg border-2 transition
                ${
                  selectedAnswer === null
                    ? 'hover:bg-gray-50 border-gray-200'
                    : selectedAnswer === index
                    ? index === currentQuestion.correctAnswer
                      ? 'bg-green-50 border-green-500'
                      : 'bg-red-50 border-red-500'
                    : index === currentQuestion.correctAnswer
                    ? 'bg-green-50 border-green-500'
                    : 'bg-gray-50 border-gray-200'
                }
              `}
            >
              <div className="flex items-center">
                <span className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-current mr-3">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
                {selectedAnswer !== null && (
                  <span className="ml-3">
                    {index === currentQuestion.correctAnswer ? '✓' : 
                     selectedAnswer === index ? '✗' : ''}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {showExplanation && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Explanation:</h4>
          <p className="text-blue-800">{currentQuestion.explanation}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {currentQuestion.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {selectedAnswer !== null && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Difficulty: {currentQuestion.difficulty}
          </div>
          <button
            onClick={nextQuestion}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz; 