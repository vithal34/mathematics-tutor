import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { courses, CourseId } from '../data/courseStructure';
import { Course } from '../types/course';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState<CourseId>('calculus101');

  const handleCourseSelect = (courseId: CourseId) => {
    setSelectedCourse(courseId);
  };

  const handleModuleClick = (moduleId: string) => {
    navigate(`/course/${selectedCourse}/module/${moduleId}`);
  };

  const getCourseProgress = (courseId: CourseId) => {
    const course = courses[courseId];
    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    const completedLessons = course.modules.reduce((acc, module) => {
      return acc + module.lessons.filter(lesson => 
        user?.progress[lesson.id]?.completed
      ).length;
    }, 0);
    return Math.round((completedLessons / totalLessons) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome, {user?.name}</h1>
          
          {/* Course Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select a Course</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(courses).map(([courseId, course]) => (
                <div
                  key={courseId}
                  className={`p-6 rounded-lg shadow-md cursor-pointer transition-all ${
                    selectedCourse === courseId
                      ? 'bg-blue-600 text-white'
                      : 'bg-white hover:bg-blue-50'
                  }`}
                  onClick={() => handleCourseSelect(courseId as CourseId)}
                >
                  <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                  <p className="text-sm mb-4">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Progress</span>
                    <span className="text-sm font-medium">{getCourseProgress(courseId as CourseId)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${getCourseProgress(courseId as CourseId)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Course Content */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {courses[selectedCourse].title}
            </h2>
            <div className="space-y-6">
              {courses[selectedCourse].modules.map((module) => (
                <div
                  key={module.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleModuleClick(module.id)}
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{module.title}</h3>
                  <p className="text-gray-600 mb-4">{module.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className={`p-4 rounded-lg ${
                          user?.progress[lesson.id]?.completed
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">{lesson.title}</span>
                          {user?.progress[lesson.id]?.completed && (
                            <span className="text-green-600">✓</span>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{lesson.duration} min</span>
                          <span className="mx-2">•</span>
                          <span className="capitalize">{lesson.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 