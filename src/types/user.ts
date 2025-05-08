export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher';
  progress: {
    [conceptId: string]: {
      completed: boolean;
      quizScores: number[];
      lastAccessed: string;
      visualizationsCompleted: string[];
      uniqueFunctionsVisualized: number;
      practiceProblemsCompleted: number;
      correctAnswers: number;
      totalStudyTime: number;
    };
  };
}

export interface QuizQuestion {
  id: string;
  conceptId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  tags: string[];
}

export interface ConceptProgress {
  id: string;
  name: string;
  description: string;
  prerequisites: string[];
  visualizations: {
    id: string;
    name: string;
    description: string;
    completed: boolean;
  }[];
  quizzes: {
    id: string;
    name: string;
    description: string;
    questions: QuizQuestion[];
    completed: boolean;
    score?: number;
  }[];
  completed: boolean;
} 