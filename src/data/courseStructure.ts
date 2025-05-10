import { Module, Lesson, Course } from '../types/course';

export const courses: Record<string, Course> = {
  calculus101: {
    id: 'calculus101',
    title: 'Calculus 101',
    description: 'Introduction to calculus concepts including limits, derivatives, and integration.',
    modules: [
      {
        id: 'limits',
        title: 'Limits and Continuity',
        description: 'Understanding the fundamental concept of limits in calculus.',
        lessons: [
          {
            id: 'limits-intro',
            title: 'Introduction to Limits',
            type: 'reading',
            duration: 15,
            content: 'limits-intro-content',
            prerequisites: []
          },
          {
            id: 'limits-practice',
            title: 'Practice with Limits',
            type: 'practice',
            duration: 20,
            content: 'limits-practice-content',
            prerequisites: ['limits-intro']
          },
          {
            id: 'limits-quiz',
            title: 'Limits Quiz',
            type: 'quiz',
            duration: 10,
            content: 'limits-quiz-content',
            prerequisites: ['limits-practice']
          }
        ]
      },
      {
        id: 'derivatives',
        title: 'Derivatives',
        description: 'Learn about derivatives and their applications.',
        lessons: [
          {
            id: 'derivatives-intro',
            title: 'Introduction to Derivatives',
            type: 'reading',
            duration: 20,
            content: 'derivatives-intro-content',
            prerequisites: ['limits-quiz']
          },
          {
            id: 'derivatives-practice',
            title: 'Practice with Derivatives',
            type: 'practice',
            duration: 25,
            content: 'derivatives-practice-content',
            prerequisites: ['derivatives-intro']
          },
          {
            id: 'derivatives-quiz',
            title: 'Derivatives Quiz',
            type: 'quiz',
            duration: 15,
            content: 'derivatives-quiz-content',
            prerequisites: ['derivatives-practice']
          }
        ]
      },
      {
        id: 'integration',
        title: 'Integration',
        description: 'Master the techniques of integration.',
        lessons: [
          {
            id: 'integration-intro',
            title: 'Introduction to Integration',
            type: 'reading',
            duration: 20,
            content: 'integration-intro-content',
            prerequisites: ['derivatives-quiz']
          },
          {
            id: 'integration-practice',
            title: 'Practice with Integration',
            type: 'practice',
            duration: 25,
            content: 'integration-practice-content',
            prerequisites: ['integration-intro']
          },
          {
            id: 'integration-quiz',
            title: 'Integration Quiz',
            type: 'quiz',
            duration: 15,
            content: 'integration-quiz-content',
            prerequisites: ['integration-practice']
          }
        ]
      }
    ]
  },
  linearAlgebra: {
    id: 'linearAlgebra',
    title: 'Linear Algebra',
    description: 'Explore vectors, matrices, and linear transformations.',
    modules: [
      {
        id: 'vectors',
        title: 'Vectors and Vector Spaces',
        description: 'Understanding vectors and their properties.',
        lessons: [
          {
            id: 'vectors-intro',
            title: 'Introduction to Vectors',
            type: 'reading',
            duration: 15,
            content: 'vectors-intro-content',
            prerequisites: []
          },
          {
            id: 'vectors-practice',
            title: 'Vector Operations',
            type: 'practice',
            duration: 20,
            content: 'vectors-practice-content',
            prerequisites: ['vectors-intro']
          },
          {
            id: 'vectors-quiz',
            title: 'Vectors Quiz',
            type: 'quiz',
            duration: 10,
            content: 'vectors-quiz-content',
            prerequisites: ['vectors-practice']
          }
        ]
      },
      {
        id: 'matrices',
        title: 'Matrices and Matrix Operations',
        description: 'Learn about matrices and their applications.',
        lessons: [
          {
            id: 'matrices-intro',
            title: 'Introduction to Matrices',
            type: 'reading',
            duration: 20,
            content: 'matrices-intro-content',
            prerequisites: ['vectors-quiz']
          },
          {
            id: 'matrices-practice',
            title: 'Matrix Operations',
            type: 'practice',
            duration: 25,
            content: 'matrices-practice-content',
            prerequisites: ['matrices-intro']
          },
          {
            id: 'matrices-quiz',
            title: 'Matrices Quiz',
            type: 'quiz',
            duration: 15,
            content: 'matrices-quiz-content',
            prerequisites: ['matrices-practice']
          }
        ]
      }
    ]
  },
  statistics: {
    id: 'statistics',
    title: 'Statistics and Probability',
    description: 'Learn statistical concepts and probability theory.',
    modules: [
      {
        id: 'probability',
        title: 'Probability Basics',
        description: 'Understanding probability concepts and distributions.',
        lessons: [
          {
            id: 'probability-intro',
            title: 'Introduction to Probability',
            type: 'reading',
            duration: 15,
            content: 'probability-intro-content',
            prerequisites: []
          },
          {
            id: 'probability-practice',
            title: 'Probability Problems',
            type: 'practice',
            duration: 20,
            content: 'probability-practice-content',
            prerequisites: ['probability-intro']
          },
          {
            id: 'probability-quiz',
            title: 'Probability Quiz',
            type: 'quiz',
            duration: 10,
            content: 'probability-quiz-content',
            prerequisites: ['probability-practice']
          }
        ]
      },
      {
        id: 'statistical-inference',
        title: 'Statistical Inference',
        description: 'Learn about hypothesis testing and confidence intervals.',
        lessons: [
          {
            id: 'inference-intro',
            title: 'Introduction to Statistical Inference',
            type: 'reading',
            duration: 20,
            content: 'inference-intro-content',
            prerequisites: ['probability-quiz']
          },
          {
            id: 'inference-practice',
            title: 'Inference Problems',
            type: 'practice',
            duration: 25,
            content: 'inference-practice-content',
            prerequisites: ['inference-intro']
          },
          {
            id: 'inference-quiz',
            title: 'Inference Quiz',
            type: 'quiz',
            duration: 15,
            content: 'inference-quiz-content',
            prerequisites: ['inference-practice']
          }
        ]
      }
    ]
  }
};

export type CourseId = keyof typeof courses; 