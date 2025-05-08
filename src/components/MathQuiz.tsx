import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MathJax } from 'better-react-mathjax';

interface QuizQuestion {
  id: string;
  text: string;
  latex?: string;
  options: {
    id: string;
    text: string;
    latex?: string;
    isCorrect: boolean;
  }[];
  explanation: {
    text: string;
    latex?: string;
  };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

interface MathQuizProps {
  topic: 'limits' | 'derivatives' | 'integration' | 'series';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  onComplete?: (score: number, totalQuestions: number) => void;
}

const questions: Record<string, QuizQuestion[]> = {
  limits: [
    {
      id: 'lim1',
      text: 'What is the limit of the function as x approaches 2?',
      latex: '\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}',
      options: [
        { id: 'a', text: '4', isCorrect: true },
        { id: 'b', text: '0', isCorrect: false },
        { id: 'c', text: '2', isCorrect: false },
        { id: 'd', text: 'Does not exist', isCorrect: false }
      ],
      explanation: {
        text: 'Using L\'Hôpital\'s rule or factoring:',
        latex: '\\frac{x^2 - 4}{x - 2} = \\frac{(x+2)(x-2)}{x-2} = x + 2 \\rightarrow 4'
      },
      difficulty: 'intermediate',
      tags: ['indeterminate forms', 'factoring', 'rational functions']
    },
    // Add more limit questions...
  ],
  derivatives: [
    {
      id: 'der1',
      text: 'Find the derivative of the function:',
      latex: '\\frac{d}{dx}[x\\sin(x)]',
      options: [
        { id: 'a', text: 'sin(x)', isCorrect: false },
        { id: 'b', text: 'x·cos(x)', isCorrect: false },
        { id: 'c', text: 'sin(x) + x·cos(x)', isCorrect: true },
        { id: 'd', text: 'cos(x)', isCorrect: false }
      ],
      explanation: {
        text: 'Using the product rule:',
        latex: '\\frac{d}{dx}[x\\sin(x)] = 1\\cdot\\sin(x) + x\\cdot\\cos(x)'
      },
      difficulty: 'intermediate',
      tags: ['product rule', 'trigonometry']
    },
    // Add more derivative questions...
  ],
  integration: [
    {
      id: 'int1',
      text: 'Evaluate the definite integral:',
      latex: '\\int_0^1 x^2 dx',
      options: [
        { id: 'a', text: '1/2', isCorrect: false },
        { id: 'b', text: '1/3', isCorrect: true },
        { id: 'c', text: '1', isCorrect: false },
        { id: 'd', text: '2/3', isCorrect: false }
      ],
      explanation: {
        text: 'Using the power rule for integration:',
        latex: '\\int_0^1 x^2 dx = [\\frac{x^3}{3}]_0^1 = \\frac{1}{3} - 0 = \\frac{1}{3}'
      },
      difficulty: 'beginner',
      tags: ['power rule', 'definite integrals']
    },
    // Add more integration questions...
  ],
  series: [
    {
      id: 'ser1',
      text: 'Determine if the series converges:',
      latex: '\\sum_{n=1}^{\\infty} \\frac{1}{n^2}',
      options: [
        { id: 'a', text: 'Converges to π²/6', isCorrect: true },
        { id: 'b', text: 'Converges to 1', isCorrect: false },
        { id: 'c', text: 'Diverges', isCorrect: false },
        { id: 'd', text: 'Oscillates', isCorrect: false }
      ],
      explanation: {
        text: 'This is the famous Basel problem. The series converges to π²/6.',
        latex: '\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}'
      },
      difficulty: 'advanced',
      tags: ['p-series', 'convergence', 'special series']
    },
    // Add more series questions...
  ]
};

export const MathQuiz: React.FC<MathQuizProps> = ({ 
  topic, 
  difficulty = 'beginner',
  onComplete 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60); // 60 seconds per question
  const [isComplete, setIsComplete] = useState(false);

  // Filter questions by topic and difficulty
  const filteredQuestions = questions[topic]?.filter(q => 
    !difficulty || q.difficulty === difficulty
  ) || [];

  // Timer effect
  useEffect(() => {
    if (!showExplanation && !isComplete && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showExplanation, isComplete, timeRemaining]);

  // Handle time up
  useEffect(() => {
    if (timeRemaining === 0 && !showExplanation) {
      handleAnswer(null);
    }
  }, [timeRemaining]);

  const handleAnswer = (answerId: string | null) => {
    if (showExplanation) return;

    setSelectedAnswer(answerId);
    setShowExplanation(true);

    const currentQuestion = filteredQuestions[currentQuestionIndex];
    const isCorrect = answerId !== null && 
      currentQuestion.options.find(opt => opt.id === answerId)?.isCorrect;

    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeRemaining(60);
    } else {
      setIsComplete(true);
      onComplete?.(score, filteredQuestions.length);
    }
  };

  // If no questions are available for this topic
  if (filteredQuestions.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">No Questions Available</h2>
        <p className="text-gray-600">
          There are no questions available for the topic "{topic}". Please try another topic.
        </p>
      </div>
    );
  }

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-white rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-lg mb-4">
          Your score: {score} out of {filteredQuestions.length}
          ({Math.round((score / filteredQuestions.length) * 100)}%)
        </p>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${(score / filteredQuestions.length) * 100}%` }}
          />
        </div>
      </motion.div>
    );
  }

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-white rounded-lg shadow-lg"
    >
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Question {currentQuestionIndex + 1} of {filteredQuestions.length}</span>
          <span>{timeRemaining}s remaining</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ 
              width: `${((currentQuestionIndex) / filteredQuestions.length) * 100}%` 
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">{currentQuestion.text}</h3>
        {currentQuestion.latex && (
          <MathJax className="text-lg mb-4">
            {`\\[${currentQuestion.latex}\\]`}
          </MathJax>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {currentQuestion.options.map(option => (
          <button
            key={option.id}
            onClick={() => handleAnswer(option.id)}
            disabled={showExplanation}
            className={`w-full p-4 text-left rounded-lg border-2 transition ${
              showExplanation
                ? option.isCorrect
                  ? 'border-green-500 bg-green-50'
                  : selectedAnswer === option.id
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 bg-gray-50'
                : 'border-gray-200 hover:border-blue-500'
            }`}
          >
            <div className="flex items-center">
              <span className="w-8 h-8 flex items-center justify-center rounded-full border border-current mr-3">
                {option.id.toUpperCase()}
              </span>
              <div>
                <span>{option.text}</span>
                {option.latex && (
                  <MathJax>
                    {`\\[${option.latex}\\]`}
                  </MathJax>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-blue-50 rounded-lg"
        >
          <h4 className="font-semibold text-blue-900 mb-2">Explanation:</h4>
          <p className="text-blue-800">{currentQuestion.explanation.text}</p>
          {currentQuestion.explanation.latex && (
            <MathJax className="mt-2">
              {`\\[${currentQuestion.explanation.latex}\\]`}
            </MathJax>
          )}
          <button
            onClick={handleNext}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            {currentQuestionIndex < filteredQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        </motion.div>
      )}

      {/* Tags */}
      <div className="mt-6 flex flex-wrap gap-2">
        {currentQuestion.tags.map(tag => (
          <span
            key={tag}
            className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default MathQuiz; 