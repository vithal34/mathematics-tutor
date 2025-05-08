interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  type: 'video' | 'reading' | 'quiz' | 'practice';
  content: string;
  prerequisites: string[];
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  order: number;
}

export const calculus101: Module[] = [
  {
    id: 'foundations',
    title: 'Foundations of Calculus',
    description: 'Master the fundamental concepts that form the basis of calculus',
    order: 1,
    lessons: [
      {
        id: 'limits-intro',
        title: 'Introduction to Limits',
        description: 'Understand what limits are and why they are important',
        duration: 15,
        type: 'video',
        content: 'limits-intro-content',
        prerequisites: []
      },
      {
        id: 'limits-practice',
        title: 'Working with Limits',
        description: 'Practice solving limit problems',
        duration: 30,
        type: 'practice',
        content: 'limits-practice-content',
        prerequisites: ['limits-intro']
      },
      {
        id: 'limits-quiz',
        title: 'Limits Assessment',
        description: 'Test your understanding of limits',
        duration: 20,
        type: 'quiz',
        content: 'limits-quiz-content',
        prerequisites: ['limits-practice']
      }
    ]
  },
  {
    id: 'derivatives',
    title: 'Derivatives and Applications',
    description: 'Learn about rates of change and slopes of curves',
    order: 2,
    lessons: [
      {
        id: 'derivatives-intro',
        title: 'Understanding Derivatives',
        description: 'Learn what derivatives represent and how to calculate them',
        duration: 20,
        type: 'video',
        content: 'derivatives-intro-content',
        prerequisites: ['limits-quiz']
      },
      {
        id: 'derivatives-reading',
        title: 'Applications of Derivatives',
        description: 'Explore real-world applications of derivatives',
        duration: 25,
        type: 'reading',
        content: 'derivatives-applications-content',
        prerequisites: ['derivatives-intro']
      },
      {
        id: 'derivatives-practice',
        title: 'Derivative Practice Problems',
        description: 'Practice finding derivatives and solving related problems',
        duration: 40,
        type: 'practice',
        content: 'derivatives-practice-content',
        prerequisites: ['derivatives-reading']
      }
    ]
  },
  {
    id: 'integration',
    title: 'Integration Techniques',
    description: 'Master the art of integration and its applications',
    order: 3,
    lessons: [
      {
        id: 'integration-intro',
        title: 'Basics of Integration',
        description: 'Learn what integrals are and basic integration techniques',
        duration: 25,
        type: 'video',
        content: 'integration-intro-content',
        prerequisites: ['derivatives-practice']
      },
      {
        id: 'integration-methods',
        title: 'Integration Methods',
        description: 'Study different methods of integration',
        duration: 35,
        type: 'reading',
        content: 'integration-methods-content',
        prerequisites: ['integration-intro']
      },
      {
        id: 'integration-practice',
        title: 'Integration Practice',
        description: 'Practice solving integration problems',
        duration: 45,
        type: 'practice',
        content: 'integration-practice-content',
        prerequisites: ['integration-methods']
      }
    ]
  }
];

export type { Module, Lesson }; 