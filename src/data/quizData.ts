interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Quiz {
  [key: string]: QuizQuestion[];
}

export const quizData: Quiz = {
  'limits-quiz-content': [
    {
      id: 'q1',
      question: 'What is the limit of f(x) = (x² - 1)/(x - 1) as x approaches 1?',
      options: ['0', '1', '2', 'Does not exist'],
      correctAnswer: 2,
      explanation: 'Using direct substitution, we get 0/0 which is indeterminate. However, we can factor the numerator as (x-1)(x+1) and simplify to get x+1. Therefore, the limit is 2.'
    },
    {
      id: 'q2',
      question: 'Evaluate the limit: lim(x→0) (sin x)/x',
      options: ['0', '1', 'undefined', '∞'],
      correctAnswer: 1,
      explanation: 'This is a fundamental limit in calculus. The limit of (sin x)/x as x approaches 0 is 1. This is often used as a basis for other trigonometric limits.'
    },
    {
      id: 'q3',
      question: 'What is the limit of f(x) = √(x² + 1) - x as x approaches ∞?',
      options: ['0', '1', '∞', 'Does not exist'],
      correctAnswer: 0,
      explanation: 'As x approaches infinity, the difference between √(x² + 1) and x becomes negligible, approaching 0.'
    }
  ],
  'derivatives-quiz-content': [
    {
      id: 'q1',
      question: 'What is the derivative of f(x) = x³ + 2x² - 5x + 1?',
      options: ['3x² + 4x - 5', '3x² + 2x - 5', 'x² + 2x - 5', '3x² + 4x'],
      correctAnswer: 0,
      explanation: 'Using the power rule, the derivative of x³ is 3x², 2x² becomes 4x, -5x becomes -5, and the constant 1 becomes 0.'
    },
    {
      id: 'q2',
      question: 'Find the derivative of f(x) = (x² + 1)³ using the chain rule.',
      options: ['3(x² + 1)²', '3(x² + 1)²(2x)', '6x(x² + 1)²', '3x²(x² + 1)²'],
      correctAnswer: 1,
      explanation: 'Using the chain rule: f\'(x) = 3(x² + 1)² × d/dx(x² + 1) = 3(x² + 1)²(2x)'
    }
  ],
  'integration-quiz-content': [
    {
      id: 'q1',
      question: 'Evaluate ∫(x² + 2x + 1)dx',
      options: ['x³/3 + x² + x + C', 'x³ + x² + x + C', 'x³/3 + 2x² + x + C', 'x³/3 + x² + C'],
      correctAnswer: 0,
      explanation: 'Using the power rule for integration: ∫x²dx = x³/3, ∫2xdx = x², ∫1dx = x, plus the constant of integration C.'
    },
    {
      id: 'q2',
      question: 'What is the value of ∫(0 to 1) x² dx?',
      options: ['1/2', '1/3', '1/4', '1/6'],
      correctAnswer: 1,
      explanation: 'The integral of x² is x³/3. Evaluating from 0 to 1: (1³/3) - (0³/3) = 1/3'
    }
  ]
}; 