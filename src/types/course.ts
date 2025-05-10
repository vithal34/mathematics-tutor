export interface Lesson {
  id: string;
  title: string;
  type: 'reading' | 'practice' | 'quiz';
  duration: number;
  content: string;
  prerequisites?: string[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
} 