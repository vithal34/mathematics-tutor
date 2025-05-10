import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { courses } from '../data/courseStructure';
import type { Course, Module, Lesson } from '../types/course';

const CourseOverview: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user, updateProgress } = useAuth();

  if (!courseId || !courses[courseId]) {
    navigate('/');
    return null;
  }

  const course: Course = courses[courseId];

  const calculateModuleProgress = (module: Module): number => {
    if (!user?.progress) return 0;

    const moduleProgress = module.lessons.reduce((acc: number, lesson: Lesson) => {
      const lessonProgress = user.progress[lesson.id];
      if (!lessonProgress) return acc;
      return acc + (lessonProgress.completed ? 1 : 0);
    }, 0);

    return (moduleProgress / module.lessons.length) * 100;
  };

  const isLessonAvailable = (lesson: Lesson): boolean => {
    if (!lesson.prerequisites || lesson.prerequisites.length === 0) return true;
    if (!user?.progress) return false;

    return lesson.prerequisites.every(prereqId => {
      const prereqProgress = user.progress[prereqId];
      return prereqProgress?.completed || false;
    });
  };

  const totalProgress = course.modules.reduce((acc: number, module: Module) => {
    return acc + calculateModuleProgress(module);
  }, 0) / course.modules.length;

  const completedLessons = course.modules.reduce((acc: number, module: Module) => {
    return acc + module.lessons.reduce((lessonAcc: number, lesson: Lesson) => {
      return lessonAcc + (user?.progress?.[lesson.id]?.completed ? 1 : 0);
    }, 0);
  }, 0);

  const totalLessons = course.modules.reduce((acc: number, module: Module) => {
    return acc + module.lessons.length;
  }, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-64 bg-gray-200 rounded-full h-2.5 mr-4">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${totalProgress}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600">
              {Math.round(totalProgress)}% Complete
            </span>
          </div>
          <div className="text-sm text-gray-600">
            {completedLessons} of {totalLessons} lessons completed
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {course.modules.map((module: Module) => (
          <div key={module.id} className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-2">{module.title}</h2>
            <p className="text-gray-600 mb-4">{module.description}</p>
            <div className="flex items-center mb-4">
              <div className="w-48 bg-gray-200 rounded-full h-2.5 mr-4">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${calculateModuleProgress(module)}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">
                {Math.round(calculateModuleProgress(module))}% Complete
              </span>
            </div>
            <div className="space-y-4">
              {module.lessons.map((lesson: Lesson) => {
                const isAvailable = isLessonAvailable(lesson);
                const isCompleted = user?.progress?.[lesson.id]?.completed;
                return (
                  <div
                    key={lesson.id}
                    className={`p-4 rounded-lg border ${
                      isCompleted
                        ? 'border-green-500 bg-green-50'
                        : isAvailable
                        ? 'border-gray-200 hover:border-blue-500 cursor-pointer'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                    onClick={() => {
                      if (isAvailable) {
                        navigate(`/course/${courseId}/module/${module.id}/lesson/${lesson.id}`);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{lesson.title}</h3>
                        <p className="text-sm text-gray-600">
                          {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)} •{' '}
                          {lesson.duration} minutes
                        </p>
                      </div>
                      {isCompleted ? (
                        <span className="text-green-500">✓ Completed</span>
                      ) : !isAvailable ? (
                        <span className="text-gray-500">🔒 Locked</span>
                      ) : (
                        <span className="text-blue-500">→ Start</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseOverview; 