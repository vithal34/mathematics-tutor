import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { calculus101, Module, Lesson } from '../data/courseStructure';
import { useAuth } from '../contexts/AuthContext';

const CourseOverview: React.FC = () => {
  const { user } = useAuth();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const calculateModuleProgress = (module: Module) => {
    if (!user?.progress) return 0;
    const completedLessons = module.lessons.filter(
      lesson => user.progress[lesson.id]?.completed
    ).length;
    return Math.round((completedLessons / module.lessons.length) * 100);
  };

  const isLessonAvailable = (lesson: Lesson) => {
    if (!lesson.prerequisites.length) return true;
    if (!user?.progress) return false;
    return lesson.prerequisites.every(
      prereq => user.progress[prereq]?.completed
    );
  };

  const getLessonStatusIcon = (lesson: Lesson) => {
    if (!user?.progress?.[lesson.id]) {
      return isLessonAvailable(lesson) ? (
        <span className="text-gray-400">⭘</span>
      ) : (
        <span className="text-gray-300">🔒</span>
      );
    }
    return user.progress[lesson.id].completed ? (
      <span className="text-green-500">✓</span>
    ) : (
      <span className="text-blue-500">◔</span>
    );
  };

  const getLessonTypeIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'video':
        return '📹';
      case 'reading':
        return '📖';
      case 'quiz':
        return '📝';
      case 'practice':
        return '⚡';
      default:
        return '📄';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Calculus 101</h1>
        <p className="mt-2 text-gray-600">
          Master the fundamentals of calculus through interactive lessons and practice
        </p>
      </div>

      {/* Course Progress Overview */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">
              {calculus101.reduce((acc, module) => acc + calculateModuleProgress(module), 0) / calculus101.length}%
            </div>
            <div className="text-sm text-gray-500">Course Progress</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600">
              {Object.values(user?.progress || {}).filter(p => p?.completed).length || 0}
            </div>
            <div className="text-sm text-gray-500">Lessons Completed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600">
              {calculus101.reduce((acc, module) => acc + module.lessons.length, 0)}
            </div>
            <div className="text-sm text-gray-500">Total Lessons</div>
          </div>
        </div>
      </div>

      {/* Module List */}
      <div className="space-y-6">
        {calculus101.map((module) => {
          const progress = calculateModuleProgress(module);
          const isExpanded = expandedModule === module.id;

          return (
            <div key={module.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                className="w-full"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-2xl">{module.order}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {module.title}
                        </h2>
                        <p className="text-gray-500">{module.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Progress</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {progress}%
                        </div>
                      </div>
                      <svg
                        className={`w-6 h-6 transform transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>

              {/* Lesson List */}
              {isExpanded && (
                <div className="border-t border-gray-200">
                  {module.lessons.map((lesson, index) => {
                    const isAvailable = isLessonAvailable(lesson);
                    return (
                      <Link
                        key={lesson.id}
                        to={isAvailable ? `/learn/${lesson.id}` : '#'}
                        className={`block border-b border-gray-200 last:border-b-0 ${
                          isAvailable
                            ? 'hover:bg-gray-50 cursor-pointer'
                            : 'cursor-not-allowed opacity-50'
                        }`}
                        onClick={(e) => !isAvailable && e.preventDefault()}
                      >
                        <div className="p-4 flex items-center space-x-4">
                          <div className="flex-shrink-0 w-6">
                            {getLessonStatusIcon(lesson)}
                          </div>
                          <div className="flex-shrink-0 w-6">
                            {getLessonTypeIcon(lesson.type)}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">
                              {lesson.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {lesson.description}
                            </p>
                          </div>
                          <div className="flex-shrink-0 text-sm text-gray-500">
                            {lesson.duration} min
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseOverview; 