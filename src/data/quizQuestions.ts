import { QuizQuestion } from '../types/course';

export const quizQuestions: Record<string, QuizQuestion[]> = {
  // Calculus 101 Quiz Questions
  'limits-quiz': [
    {
      question: 'What is the limit of f(x) = x² as x approaches 2?',
      options: ['2', '4', '6', '8'],
      correctAnswer: '4',
      explanation: 'As x gets closer to 2, x² gets closer to 4. Therefore, lim(x→2) x² = 4.'
    },
    {
      question: 'Find the limit of f(x) = (x² - 9)/(x - 3) as x approaches 3.',
      options: ['3', '6', '9', 'Undefined'],
      correctAnswer: '6',
      explanation: 'Factor the numerator: (x² - 9) = (x + 3)(x - 3). Then simplify and evaluate at x = 3.'
    },
    {
      question: 'What is the limit of f(x) = sin(x)/x as x approaches 0?',
      options: ['0', '1', 'Undefined', '∞'],
      correctAnswer: '1',
      explanation: 'This is a fundamental limit in calculus. The limit of sin(x)/x as x approaches 0 is 1.'
    }
  ],

  'derivatives-quiz': [
    {
      question: 'What is the derivative of f(x) = x³?',
      options: ['x²', '2x²', '3x²', '3x'],
      correctAnswer: '3x²',
      explanation: 'Using the power rule: if f(x) = xⁿ, then f\'(x) = nxⁿ⁻¹.'
    },
    {
      question: 'Find the derivative of f(x) = x² + 2x + 1.',
      options: ['2x + 2', 'x² + 2', '2x + 1', 'x + 2'],
      correctAnswer: '2x + 2',
      explanation: 'Apply the power rule to each term: (x²)\' = 2x, (2x)\' = 2, (1)\' = 0.'
    },
    {
      question: 'What is the derivative of f(x) = sin(x)?',
      options: ['cos(x)', '-sin(x)', '-cos(x)', 'tan(x)'],
      correctAnswer: 'cos(x)',
      explanation: 'The derivative of sin(x) is cos(x).'
    }
  ],

  'integration-quiz': [
    {
      question: 'What is ∫x² dx?',
      options: ['x³', 'x³/2', 'x³/3', '2x³'],
      correctAnswer: 'x³/3',
      explanation: 'Using the power rule for integration: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C.'
    },
    {
      question: 'Evaluate ∫(2x + 1) dx.',
      options: ['x² + x', 'x² + x + C', '2x² + x', '2x² + x + C'],
      correctAnswer: 'x² + x + C',
      explanation: 'Integrate each term: ∫2x dx = x², ∫1 dx = x. Don\'t forget the constant of integration C.'
    },
    {
      question: 'What is ∫cos(x) dx?',
      options: ['sin(x)', 'sin(x) + C', '-sin(x)', '-sin(x) + C'],
      correctAnswer: 'sin(x) + C',
      explanation: 'The integral of cos(x) is sin(x) + C.'
    }
  ],

  // Linear Algebra Quiz Questions
  'vectors-quiz': [
    {
      question: 'What is the dot product of vectors a = (1, 2) and b = (3, 4)?',
      options: ['5', '7', '11', '14'],
      correctAnswer: '11',
      explanation: 'The dot product is calculated as: a·b = (1×3) + (2×4) = 3 + 8 = 11.'
    },
    {
      question: 'What is the magnitude of vector v = (3, 4)?',
      options: ['5', '7', '12', '25'],
      correctAnswer: '5',
      explanation: 'The magnitude is calculated as: √(3² + 4²) = √(9 + 16) = √25 = 5.'
    },
    {
      question: 'What is the result of 2 × (1, 2)?',
      options: ['(1, 2)', '(2, 2)', '(2, 4)', '(4, 4)'],
      correctAnswer: '(2, 4)',
      explanation: 'Scalar multiplication multiplies each component by the scalar: 2 × (1, 2) = (2×1, 2×2) = (2, 4).'
    }
  ],

  'matrices-quiz': [
    {
      question: 'What is the result of adding matrices A = [[1, 2], [3, 4]] and B = [[5, 6], [7, 8]]?',
      options: [
        '[[6, 8], [10, 12]]',
        '[[5, 12], [21, 32]]',
        '[[6, 12], [10, 12]]',
        '[[5, 8], [10, 12]]'
      ],
      correctAnswer: '[[6, 8], [10, 12]]',
      explanation: 'Matrix addition is performed element-wise: [[1+5, 2+6], [3+7, 4+8]] = [[6, 8], [10, 12]].'
    },
    {
      question: 'What is the determinant of matrix A = [[2, 3], [1, 4]]?',
      options: ['5', '8', '11', '14'],
      correctAnswer: '5',
      explanation: 'For a 2×2 matrix [[a, b], [c, d]], the determinant is ad - bc: (2×4) - (3×1) = 8 - 3 = 5.'
    },
    {
      question: 'What is the result of multiplying matrices A = [[1, 2], [3, 4]] and B = [[5, 6], [7, 8]]?',
      options: [
        '[[19, 22], [43, 50]]',
        '[[5, 12], [21, 32]]',
        '[[6, 8], [10, 12]]',
        '[[12, 14], [26, 30]]'
      ],
      correctAnswer: '[[19, 22], [43, 50]]',
      explanation: 'Matrix multiplication is performed using the dot product of rows and columns.'
    }
  ],

  // Statistics Quiz Questions
  'probability-quiz': [
    {
      question: 'What is the probability of rolling a 6 on a fair die?',
      options: ['1/6', '1/3', '1/2', '5/6'],
      correctAnswer: '1/6',
      explanation: 'A fair die has 6 equally likely outcomes, so the probability of rolling a 6 is 1/6.'
    },
    {
      question: 'What is the probability of drawing a heart from a standard deck of cards?',
      options: ['1/4', '1/13', '1/52', '13/52'],
      correctAnswer: '1/4',
      explanation: 'There are 13 hearts in a deck of 52 cards, so the probability is 13/52 = 1/4.'
    },
    {
      question: 'If P(A) = 0.3 and P(B) = 0.4, and A and B are independent, what is P(A and B)?',
      options: ['0.12', '0.3', '0.4', '0.7'],
      correctAnswer: '0.12',
      explanation: 'For independent events, P(A and B) = P(A) × P(B) = 0.3 × 0.4 = 0.12.'
    }
  ],

  'inference-quiz': [
    {
      question: 'What is a 95% confidence interval for a sample mean of 50 with standard error 2?',
      options: ['[46, 54]', '[48, 52]', '[46.08, 53.92]', '[48.08, 51.92]'],
      correctAnswer: '[46.08, 53.92]',
      explanation: 'For 95% confidence, we use z = 1.96: 50 ± 1.96(2) = [46.08, 53.92].'
    },
    {
      question: 'What is the p-value if the test statistic is 2.5 in a two-tailed test?',
      options: ['0.0062', '0.0124', '0.025', '0.05'],
      correctAnswer: '0.0124',
      explanation: 'For a two-tailed test with z = 2.5, the p-value is 2 × P(Z > 2.5) ≈ 0.0124.'
    },
    {
      question: 'What is the power of a statistical test?',
      options: [
        'The probability of rejecting a false null hypothesis',
        'The probability of accepting a true null hypothesis',
        'The probability of rejecting a true null hypothesis',
        'The probability of accepting a false null hypothesis'
      ],
      correctAnswer: 'The probability of rejecting a false null hypothesis',
      explanation: 'Power is the probability of correctly rejecting a false null hypothesis (1 - β).'
    }
  ]
}; 