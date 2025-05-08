import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Plot from 'react-plotly.js';
import { Data } from 'plotly.js';
import { useAuth } from '../contexts/AuthContext';
import * as math from 'mathjs';
import { motion } from 'framer-motion';
import { MathJax } from 'better-react-mathjax';
import MathQuiz from './MathQuiz';

type ConceptType = 'limits' | 'derivatives' | 'integration';

interface PracticeProblem {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ConceptGuide {
  title: string;
  steps: string[];
  keyPoints: string[];
  commonMistakes: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  condition: (progress: any) => boolean;
  icon: string;
}

interface MasteryLevel {
  level: 'beginner' | 'intermediate' | 'advanced' | 'master';
  description: string;
  requiredScore: number;
  color: string;
}

interface ConceptCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  path: string;
}

const conceptGuides: Record<ConceptType, ConceptGuide> = {
  limits: {
    title: "Understanding Limits",
    steps: [
      "1. Evaluate the function at points approaching the target value from both sides",
      "2. Check if both left-hand and right-hand limits exist",
      "3. Compare these limits to see if they're equal",
      "4. If they're equal, that's the limit at that point"
    ],
    keyPoints: [
      "A limit exists when left and right limits are equal",
      "The function doesn't need to be defined at the point to have a limit",
      "Graphically, you can trace the function from both sides"
    ],
    commonMistakes: [
      "Assuming a function must be defined at a point to have a limit there",
      "Forgetting to check both sides of the approach",
      "Confusing limit with function value"
    ]
  },
  derivatives: {
    title: "Mastering Derivatives",
    steps: [
      "1. Understand the rate of change at a point",
      "2. Visualize the slope of the tangent line",
      "3. Use the limit definition to calculate derivatives",
      "4. Apply differentiation rules when applicable"
    ],
    keyPoints: [
      "The derivative measures instantaneous rate of change",
      "Geometrically, it's the slope of the tangent line",
      "Derivatives help find maximum and minimum points"
    ],
    commonMistakes: [
      "Forgetting the chain rule",
      "Mixing up derivative rules",
      "Not recognizing implicit differentiation cases"
    ]
  },
  integration: {
    title: "Integration Fundamentals",
    steps: [
      "1. Understand integration as area under the curve",
      "2. Break complex regions into simpler shapes",
      "3. Choose appropriate integration method",
      "4. Verify results using basic checks"
    ],
    keyPoints: [
      "Integration is the inverse of differentiation",
      "Definite integrals represent area under curves",
      "Different methods work better for different functions"
    ],
    commonMistakes: [
      "Forgetting the constant of integration",
      "Not considering negative areas",
      "Incorrect bounds of integration"
    ]
  }
};

const practiceProblemSets: Record<ConceptType, PracticeProblem[]> = {
  limits: [
    {
      question: "What is the limit of (x² - 1)/(x - 1) as x approaches 1?",
      options: ["0", "1", "2", "Does not exist"],
      correctAnswer: 2,
      explanation: "As x approaches 1, this is an indeterminate form 0/0. By factoring or using L'Hôpital's rule, we get lim(x→1) (x+1) = 2"
    },
    {
      question: "For which value of x does lim(x→a) |x - a|/x not exist?",
      options: ["a = 0", "a = 1", "a = -1", "It always exists"],
      correctAnswer: 0,
      explanation: "When a = 0, the limit from the left and right are different: left approach gives -1, right approach gives 1"
    }
  ],
  derivatives: [
    {
      question: "What is the derivative of x·sin(x)?",
      options: ["sin(x)", "x·cos(x)", "sin(x) + x·cos(x)", "cos(x)"],
      correctAnswer: 2,
      explanation: "Using the product rule: d/dx[x·sin(x)] = 1·sin(x) + x·cos(x)"
    },
    {
      question: "At what point(s) is the derivative of x² equal to 6?",
      options: ["x = 3", "x = ±3", "x = 6", "x = 2"],
      correctAnswer: 0,
      explanation: "d/dx[x²] = 2x. Setting 2x = 6, we get x = 3"
    }
  ],
  integration: [
    {
      question: "What is ∫x·cos(x)dx?",
      options: ["sin(x) + x·cos(x)", "x·sin(x)", "x·sin(x) - sin(x)", "x·sin(x) + cos(x)"],
      correctAnswer: 2,
      explanation: "Using integration by parts: u = x, dv = cos(x)dx. Then ∫x·cos(x)dx = x·sin(x) - ∫sin(x)dx = x·sin(x) - (-cos(x)) = x·sin(x) - cos(x)"
    },
    {
      question: "What is the area between y = x² and y = x from x = 0 to x = 1?",
      options: ["1/2", "1/3", "1/6", "1"],
      correctAnswer: 2,
      explanation: "Area = ∫(upper - lower)dx = ∫(x - x²)dx from 0 to 1 = [x²/2 - x³/3] from 0 to 1 = (1/2 - 1/3) = 1/6"
    }
  ]
};

const achievements: Achievement[] = [
  {
    id: 'first_perfect',
    title: 'Perfect Start',
    description: 'Get 100% on your first quiz attempt',
    condition: (progress) => progress?.quizScores?.includes(100) || false,
    icon: '🌟'
  },
  {
    id: 'practice_master',
    title: 'Practice Master',
    description: 'Complete 10 practice problems',
    condition: (progress) => (progress?.practiceProblemsCompleted || 0) >= 10,
    icon: '📚'
  },
  {
    id: 'visualization_pro',
    title: 'Visualization Pro',
    description: 'Try 5 different functions in the visualizer',
    condition: (progress) => (progress?.uniqueFunctionsVisualized || 0) >= 5,
    icon: '📊'
  }
];

const masteryLevels: MasteryLevel[] = [
  {
    level: 'beginner',
    description: 'Just starting out',
    requiredScore: 0,
    color: 'gray'
  },
  {
    level: 'intermediate',
    description: 'Building confidence',
    requiredScore: 50,
    color: 'blue'
  },
  {
    level: 'advanced',
    description: 'Strong understanding',
    requiredScore: 75,
    color: 'purple'
  },
  {
    level: 'master',
    description: 'Mastered the concept',
    requiredScore: 90,
    color: 'yellow'
  }
];

const getRecommendations = (masteryScore: number, practiceProblems: number, studyTime: number): string[] => {
  const recommendations: string[] = [];

  if (masteryScore < 50) {
    recommendations.push('Review the concept guide and key points');
    recommendations.push('Try more basic practice problems');
  }
  if (practiceProblems < 5) {
    recommendations.push('Complete more practice problems to build confidence');
  }
  if (studyTime < 600) { // 10 minutes
    recommendations.push('Spend more time studying the concept');
  }
  if (masteryScore >= 75 && practiceProblems >= 10) {
    recommendations.push('Ready to move on to more advanced topics');
  }

  return recommendations;
};

const conceptCards: ConceptCard[] = [
  {
    id: 'limits',
    title: 'Limits',
    description: 'Explore the behavior of functions as they approach specific values',
    icon: '📈',
    color: 'bg-blue-500',
    path: '/visualizer/limits'
  },
  {
    id: 'derivatives',
    title: 'Derivatives',
    description: 'Understand rates of change and tangent lines',
    icon: '📐',
    color: 'bg-green-500',
    path: '/visualizer/derivatives'
  },
  {
    id: 'integration',
    title: 'Integration',
    description: 'Learn about areas under curves and accumulation',
    icon: '📊',
    color: 'bg-purple-500',
    path: '/visualizer/integration'
  },
  {
    id: 'series',
    title: 'Series',
    description: 'Explore infinite sequences and their convergence',
    icon: '∞',
    color: 'bg-red-500',
    path: '/visualizer/series'
  },
  {
    id: 'vector-calculus',
    title: 'Vector Calculus',
    description: 'Study vector fields and their applications',
    icon: '➡️',
    color: 'bg-yellow-500',
    path: '/vector-calculus'
  },
  {
    id: 'volume-of-revolution',
    title: 'Volume of Revolution',
    description: 'Calculate volumes of 3D shapes formed by rotation',
    icon: '🔄',
    color: 'bg-indigo-500',
    path: '/volume-of-revolution'
  },
  {
    id: 'taylor-series',
    title: 'Taylor Series',
    description: 'Approximate functions using polynomial series',
    icon: '∑',
    color: 'bg-pink-500',
    path: '/taylor-series'
  },
  {
    id: 'function-transformations',
    title: 'Function Transformations',
    description: 'Explore how functions change under various transformations',
    icon: '🔄',
    color: 'bg-teal-500',
    path: '/function-transformations'
  }
];

const CalculusConcepts: React.FC = () => {
  const { conceptId } = useParams<{ conceptId?: string }>();
  const navigate = useNavigate();
  const [selectedConcept, setSelectedConcept] = useState<ConceptType>('limits');
  const [functionStr, setFunctionStr] = useState('x^2');
  const [point, setPoint] = useState(1);
  const [epsilon, setEpsilon] = useState(0.1);
  const [numRectangles, setNumRectangles] = useState(10);
  const [showLeftSum, setShowLeftSum] = useState(true);
  const [showRightSum, setShowRightSum] = useState(true);
  const [showMidpointSum, setShowMidpointSum] = useState(true);
  const [showTrapezoidSum, setShowTrapezoidSum] = useState(true);
  const [showConceptGuide, setShowConceptGuide] = useState(false);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const { user, updateProgress } = useAuth();
  const [uniqueFunctions, setUniqueFunctions] = useState<Set<string>>(new Set());
  const [showAchievements, setShowAchievements] = useState(false);
  const [practiceProblemsCompleted, setPracticeProblemsCompleted] = useState(0);
  const [studyTime, setStudyTime] = useState(0);
  const [isStudying, setIsStudying] = useState(true);
  const [showMasteryDetails, setShowMasteryDetails] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [visualizationTheme, setVisualizationTheme] = useState<'light' | 'dark'>('light');
  const [range, setRange] = useState({ min: -5, max: 5, steps: 1000 });
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizDifficulty, setQuizDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Map URL conceptId to internal concept type
  useEffect(() => {
    const conceptMap: Record<string, ConceptType> = {
      'limits': 'limits',
      'derivatives': 'derivatives',
      'integration': 'integration'
    };
    
    const concept = conceptMap[conceptId || ''];
    if (concept) {
      setSelectedConcept(concept);
    } else if (conceptId) {
      // If invalid concept ID, redirect to dashboard
      navigate('/dashboard');
    }
  }, [conceptId, navigate]);

  // Track unique functions visualized
  useEffect(() => {
    if (functionStr && conceptId) {
      const newFunctions = new Set(uniqueFunctions);
      newFunctions.add(functionStr);
      setUniqueFunctions(newFunctions);
      
      updateProgress(conceptId, {
        uniqueFunctionsVisualized: newFunctions.size
      });
    }
  }, [functionStr, conceptId]);

  // Study timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStudying && conceptId) {
      timer = setInterval(() => {
        setStudyTime(prev => {
          const newTime = prev + 1;
          // Update progress every minute
          if (newTime % 60 === 0) {
            updateProgress(conceptId, {
              timeSpent: newTime
            });
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStudying, conceptId, updateProgress]);

  // Function evaluator inside component
  const evaluateFunction = useCallback((x: number): number => {
    try {
      const scope = { x };
      return math.evaluate(functionStr, scope);
    } catch (error) {
      console.error('Error evaluating function:', error);
      return 0;
    }
  }, [functionStr]);

  // Generate x values for plotting with higher resolution
  const xValues = useMemo(() => {
    const { min, max, steps } = range;
    return Array.from({ length: steps }, (_, i) => min + (i * (max - min)) / (steps - 1));
  }, [range]);

  // Generate y values with enhanced function evaluation
  const yValues = useMemo(() => {
    return xValues.map(evaluateFunction);
  }, [xValues, evaluateFunction]);

  // Enhanced base plot data
  const baseData: Data[] = useMemo(() => [{
    x: xValues,
    y: yValues,
    type: 'scatter',
    mode: 'lines',
    name: 'f(x)',
    line: { 
      color: visualizationTheme === 'light' ? '#3B82F6' : '#60A5FA', 
      width: 2 
    }
  }], [xValues, yValues, visualizationTheme]);

  // Enhanced limit visualization
  const getLimitVisualization = (): Data[] => {
    const leftPoints = Array.from(
      { length: 20 }, 
      (_, i) => point - epsilon + (epsilon * i) / 10
    );
    const rightPoints = Array.from(
      { length: 20 }, 
      (_, i) => point + (epsilon * i) / 10
    );
    
    const leftY = leftPoints.map(evaluateFunction);
    const rightY = rightPoints.map(evaluateFunction);
    
    return [
      ...baseData,
      {
        x: leftPoints,
        y: leftY,
        type: 'scatter',
        mode: 'markers',
        name: 'Left Approach',
        marker: { 
          color: '#EF4444', 
          size: 8,
          symbol: 'circle'
        }
      },
      {
        x: rightPoints,
        y: rightY,
        type: 'scatter',
        mode: 'markers',
        name: 'Right Approach',
        marker: { 
          color: '#10B981', 
          size: 8,
          symbol: 'circle'
        }
      }
    ];
  };

  // Enhanced derivative visualization
  const getDerivativeVisualization = (): Data[] => {
    const h = 0.0001;
    const derivative = (evaluateFunction(point + h) - evaluateFunction(point)) / h;
    const tangentX = [point - 2, point + 2];
    const tangentY = tangentX.map(x => evaluateFunction(point) + derivative * (x - point));

    return [
      ...baseData,
      {
        x: tangentX,
        y: tangentY,
        type: 'scatter',
        mode: 'lines',
        name: 'Tangent Line',
        line: { 
          color: '#EF4444', 
          width: 2, 
          dash: 'dash' 
        }
      },
      {
        x: [point],
        y: [evaluateFunction(point)],
        type: 'scatter',
        mode: 'markers',
        name: 'Point',
        marker: { 
          color: '#10B981', 
          size: 12, 
          symbol: 'circle' 
        }
      }
    ];
  };

  // Enhanced integration visualization
  const getIntegrationVisualization = (): Data[] => {
    const dx = (range.max - range.min) / numRectangles;
    const rectangles: Data[] = [];

    for (let i = 0; i < numRectangles; i++) {
      const x0 = range.min + i * dx;
      const x1 = x0 + dx;
      const y = evaluateFunction(x0);

      rectangles.push({
        x: [x0, x0, x1, x1, x0],
        y: [0, y, y, 0, 0],
        type: 'scatter',
        fill: 'toself',
        fillcolor: 'rgba(59, 130, 246, 0.2)',
        line: { color: 'rgba(59, 130, 246, 0.5)' },
        name: i === 0 ? 'Riemann Sum' : undefined,
        showlegend: i === 0
      });
    }

    return [...baseData, ...rectangles];
  };

  // Enhanced plot layout
  const layout = useMemo(() => ({
    title: {
      text: selectedConcept === 'limits' ? 'Limits and Continuity' :
            selectedConcept === 'derivatives' ? 'Differentiation from First Principles' :
            'Integration and Riemann Sums',
      font: { size: 24 }
    },
    plot_bgcolor: visualizationTheme === 'light' ? '#FFFFFF' : '#1F2937',
    paper_bgcolor: visualizationTheme === 'light' ? '#FFFFFF' : '#1F2937',
    font: {
      color: visualizationTheme === 'light' ? '#000000' : '#FFFFFF'
    },
    xaxis: {
      title: 'x',
      range: [-5, 5],
      gridcolor: visualizationTheme === 'light' ? '#E5E7EB' : '#374151',
      showgrid: true,
      zeroline: true,
      zerolinecolor: visualizationTheme === 'light' ? '#000000' : '#FFFFFF'
    },
    yaxis: {
      title: 'y',
      range: [-5, 5],
      gridcolor: visualizationTheme === 'light' ? '#E5E7EB' : '#374151',
      showgrid: true,
      zeroline: true,
      zerolinecolor: visualizationTheme === 'light' ? '#000000' : '#FFFFFF'
    },
    showlegend: true,
    legend: { x: 1.1, y: 1 },
    margin: { l: 50, r: 50, t: 50, b: 50 },
    hovermode: 'closest' as const
  }), [selectedConcept, visualizationTheme]);

  // Function input with validation
  const handleFunctionChange = (input: string) => {
    try {
      math.parse(input);
      setFunctionStr(input);
    } catch (error) {
      console.error('Invalid function:', error);
    }
  };

  const calculateDerivative = (x: number, h: number = 0.0001): number => {
    return (evaluateFunction(x + h) - evaluateFunction(x)) / h;
  };

  const calculateIntegral = (a: number, b: number, n: number, method: 'left' | 'right' | 'midpoint' | 'trapezoid'): number => {
    const dx = (b - a) / n;
    let sum = 0;

    for (let i = 0; i < n; i++) {
      const x1 = a + i * dx;
      const x2 = x1 + dx;
      
      switch (method) {
        case 'left':
          sum += evaluateFunction(x1) * dx;
          break;
        case 'right':
          sum += evaluateFunction(x2) * dx;
          break;
        case 'midpoint':
          sum += evaluateFunction(x1 + dx/2) * dx;
          break;
        case 'trapezoid':
          sum += (evaluateFunction(x1) + evaluateFunction(x2)) * dx / 2;
          break;
      }
    }

    return sum;
  };

  const data: Data[] = useMemo(() => {
    const x = Array.from({ length: 1000 }, (_, i) => (i - 500) / 100);
    const y = x.map(evaluateFunction);

    const result: Data[] = [
      {
        x,
        y,
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: 'f(x)',
        line: { color: '#3B82F6', width: 2 }
      }
    ];

    if (selectedConcept === 'limits') {
      // Add limit visualization
      const leftPoints = Array.from({ length: 20 }, (_, i) => point - epsilon + (epsilon * i) / 10);
      const rightPoints = Array.from({ length: 20 }, (_, i) => point + (epsilon * i) / 10);
      
      result.push(
        {
          x: leftPoints,
          y: leftPoints.map(evaluateFunction),
          type: 'scatter' as const,
          mode: 'markers' as const,
          name: 'Left Approach',
          marker: { color: '#EF4444', size: 8 }
        },
        {
          x: rightPoints,
          y: rightPoints.map(evaluateFunction),
          type: 'scatter' as const,
          mode: 'markers' as const,
          name: 'Right Approach',
          marker: { color: '#10B981', size: 8 }
        }
      );
    } else if (selectedConcept === 'derivatives') {
      // Add derivative visualization
      const h = 0.1;
      const tangentX = [point - 1, point + 1];
      const derivative = calculateDerivative(point);
      const tangentY = tangentX.map(x => evaluateFunction(point) + derivative * (x - point));

      result.push({
        x: tangentX,
        y: tangentY,
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: 'Tangent Line',
        line: { color: '#EF4444', width: 2 }
      });

      // Add secant lines
      const secantPoints = [0.5, 0.2, 0.1];
      secantPoints.forEach(h => {
        const secantX = [point, point + h];
        const secantY = secantX.map(evaluateFunction);
        result.push({
          x: secantX,
          y: secantY,
          type: 'scatter' as const,
          mode: 'lines' as const,
          name: `Secant (h=${h})`,
          line: { dash: 'dash' }
        });
      });
    } else if (selectedConcept === 'integration') {
      // Add Riemann sum rectangles
      const a = -2;
      const b = 2;
      const dx = (b - a) / numRectangles;

      if (showLeftSum) {
        for (let i = 0; i < numRectangles; i++) {
          const x1 = a + i * dx;
          const y1 = evaluateFunction(x1);
          result.push({
            x: [x1, x1 + dx, x1 + dx, x1, x1],
            y: [0, 0, y1, y1, 0],
            type: 'scatter' as const,
            mode: 'lines' as const,
            name: i === 0 ? 'Left Sum' : undefined,
            line: { color: '#EF4444', width: 1 },
            showlegend: i === 0,
            fill: 'toself',
            opacity: 0.2
          });
        }
      }

      if (showRightSum) {
        for (let i = 0; i < numRectangles; i++) {
          const x1 = a + i * dx;
          const y1 = evaluateFunction(x1 + dx);
          result.push({
            x: [x1, x1 + dx, x1 + dx, x1, x1],
            y: [0, 0, y1, y1, 0],
            type: 'scatter' as const,
            mode: 'lines' as const,
            name: i === 0 ? 'Right Sum' : undefined,
            line: { color: '#10B981', width: 1 },
            showlegend: i === 0,
            fill: 'toself',
            opacity: 0.2
          });
        }
      }

      if (showMidpointSum) {
        for (let i = 0; i < numRectangles; i++) {
          const x1 = a + i * dx;
          const y1 = evaluateFunction(x1 + dx/2);
          result.push({
            x: [x1, x1 + dx, x1 + dx, x1, x1],
            y: [0, 0, y1, y1, 0],
            type: 'scatter' as const,
            mode: 'lines' as const,
            name: i === 0 ? 'Midpoint Sum' : undefined,
            line: { color: '#F59E0B', width: 1 },
            showlegend: i === 0,
            fill: 'toself',
            opacity: 0.2
          });
        }
      }

      if (showTrapezoidSum) {
        for (let i = 0; i < numRectangles; i++) {
          const x1 = a + i * dx;
          const x2 = x1 + dx;
          const y1 = evaluateFunction(x1);
          const y2 = evaluateFunction(x2);
          result.push({
            x: [x1, x2, x2, x1, x1],
            y: [0, 0, y2, y1, 0],
            type: 'scatter' as const,
            mode: 'lines' as const,
            name: i === 0 ? 'Trapezoid Sum' : undefined,
            line: { color: '#8B5CF6', width: 1 },
            showlegend: i === 0,
            fill: 'toself',
            opacity: 0.2
          });
        }
      }
    }

    return result;
  }, [selectedConcept, functionStr, point, epsilon, numRectangles, showLeftSum, showRightSum, showMidpointSum, showTrapezoidSum]);

  const results = useMemo(() => {
    if (selectedConcept === 'limits') {
      const leftLimit = evaluateFunction(point - epsilon/100);
      const rightLimit = evaluateFunction(point + epsilon/100);
      const value = evaluateFunction(point);
      return {
        leftLimit: leftLimit.toFixed(4),
        rightLimit: rightLimit.toFixed(4),
        value: value.toFixed(4),
        exists: Math.abs(leftLimit - rightLimit) < 0.0001,
        continuous: Math.abs(leftLimit - value) < 0.0001 && Math.abs(rightLimit - value) < 0.0001
      };
    } else if (selectedConcept === 'derivatives') {
      return {
        derivative: calculateDerivative(point).toFixed(4),
        definition: `lim(h→0) [f(${point}+h) - f(${point})]/h`
      };
    } else {
      const a = -2, b = 2;
      return {
        leftSum: calculateIntegral(a, b, numRectangles, 'left').toFixed(4),
        rightSum: calculateIntegral(a, b, numRectangles, 'right').toFixed(4),
        midpointSum: calculateIntegral(a, b, numRectangles, 'midpoint').toFixed(4),
        trapezoidSum: calculateIntegral(a, b, numRectangles, 'trapezoid').toFixed(4)
      };
    }
  }, [selectedConcept, functionStr, point, epsilon, numRectangles]);

  // Track practice problems
  const handleAnswerSubmit = async (index: number) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
    setPracticeProblemsCompleted(prev => prev + 1);

    const correct = index === practiceProblemSets[selectedConcept][currentProblemIndex].correctAnswer;
    
    if (conceptId) {
      await updateProgress(conceptId, {
        practiceProblemsCompleted: practiceProblemsCompleted + 1,
        correctAnswers: correct ? ((user?.progress?.[conceptId]?.correctAnswers || 0) + 1) : (user?.progress?.[conceptId]?.correctAnswers || 0)
      });
    }
  };

  // Calculate earned achievements
  const earnedAchievements = achievements.filter(achievement => 
    user?.progress?.[conceptId || ''] && achievement.condition(user.progress[conceptId || ''])
  );

  // Format time for display
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate mastery score
  const calculateMasteryScore = (): number => {
    if (!user?.progress?.[conceptId || '']) return 0;

    const progress = user.progress[conceptId || ''];
    const quizScore = (progress.quizScores || []).length > 0 
      ? progress.quizScores[progress.quizScores.length - 1] 
      : 0;
    const practiceScore = (progress.correctAnswers || 0) / Math.max(progress.practiceProblemsCompleted || 1, 1) * 100;
    const visualizationScore = ((progress.uniqueFunctionsVisualized || 0) / 5) * 100; // Target: 5 functions

    return Math.round((quizScore + practiceScore + visualizationScore) / 3);
  };

  const masteryScore = calculateMasteryScore();
  const currentLevel = masteryLevels.reduce((prev, curr) => 
    masteryScore >= curr.requiredScore ? curr : prev,
    masteryLevels[0] // Provide default value
  );
  const recommendations = getRecommendations(
    masteryScore,
    user?.progress?.[conceptId || '']?.practiceProblemsCompleted || 0,
    studyTime
  );

  const handleQuizComplete = (score: number, total: number) => {
    if (conceptId) {
      updateProgress(conceptId, {
        quizScores: [...(user?.progress?.[conceptId]?.quizScores || []), Math.round((score / total) * 100)]
      });
    }
    setShowQuiz(false);
  };

  const filteredConcepts = selectedCategory
    ? conceptCards.filter(card => card.id === selectedCategory)
    : conceptCards;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Mathematical Concepts</h1>
        
        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Concepts
          </button>
          {conceptCards.map(card => (
            <button
              key={card.id}
              onClick={() => setSelectedCategory(card.id)}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === card.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {card.title}
            </button>
          ))}
        </div>

        {/* Concept Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredConcepts.map(card => (
            <motion.div
              key={card.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
              onClick={() => navigate(card.path)}
            >
              <div className={`${card.color} p-6 text-white`}>
                <div className="text-4xl mb-2">{card.icon}</div>
                <h2 className="text-2xl font-bold">{card.title}</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-600">{card.description}</p>
                <div className="mt-4 flex justify-end">
                  <button className="text-blue-600 font-semibold hover:text-blue-800">
                    Explore →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Start Guide */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Start Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">1. Choose a Concept</h3>
              <p className="text-gray-600">Select any concept card to explore its interactive visualization</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">2. Interact & Learn</h3>
              <p className="text-gray-600">Use the interactive tools to understand the mathematical concepts</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">3. Test Your Knowledge</h3>
              <p className="text-gray-600">Take quizzes to reinforce your understanding</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculusConcepts; 