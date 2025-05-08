import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { calculus101, Module } from '../data/courseStructure';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const calculateCourseProgress = (modules: Module[]) => {
    if (!user?.progress) return 0;
    
    let completedLessons = 0;
    let totalLessons = 0;

    modules.forEach(module => {
      module.lessons.forEach(lesson => {
        if (user.progress[lesson.id]?.completed) {
          completedLessons++;
        }
        totalLessons++;
      });
    });

    return Math.round((completedLessons / totalLessons) * 100);
  };

  const getNextLesson = (modules: Module[]) => {
    if (!user?.progress) return modules[0].lessons[0];

    for (const module of modules) {
      for (const lesson of module.lessons) {
        if (!user.progress[lesson.id]?.completed) {
          return lesson;
        }
      }
    }

    return modules[0].lessons[0]; // Return first lesson if all completed
  };

  const nextLesson = getNextLesson(calculus101);
  const courseProgress = calculateCourseProgress(calculus101);

  // Calculate time statistics
  const timeStats = useMemo(() => {
    if (!user?.progress) return {
      totalTime: 0,
      todayTime: 0,
      weeklyTime: 0,
      monthlyTime: 0
    };

    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);

    let totalTime = 0;
    let todayTime = 0;
    let weeklyTime = 0;
    let monthlyTime = 0;

    Object.values(user.progress).forEach(progress => {
      totalTime += progress.totalStudyTime || 0;
      
      // Calculate daily time
      if (progress.dailyStudyTime?.[today]) {
        todayTime += progress.dailyStudyTime[today];
      }

      // Calculate weekly and monthly time
      Object.entries(progress.dailyStudyTime || {}).forEach(([date, time]) => {
        const studyDate = new Date(date);
        if (studyDate >= weekAgo) {
          weeklyTime += time;
        }
        if (studyDate >= monthAgo) {
          monthlyTime += time;
        }
      });
    });

    return {
      totalTime: Math.floor(totalTime / 60), // Convert to minutes
      todayTime: Math.floor(todayTime / 60),
      weeklyTime: Math.floor(weeklyTime / 60),
      monthlyTime: Math.floor(monthlyTime / 60)
    };
  }, [user?.progress]);

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-2 text-gray-600">
          Continue your learning journey or explore new topics.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Course Progress</div>
          <div className="flex items-end">
            <div className="text-4xl font-bold text-blue-600">{courseProgress}%</div>
            <div className="text-gray-500 ml-2 mb-1">completed</div>
          </div>
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{ width: `${courseProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Today's Study Time</div>
          <div className="flex items-end">
            <div className="text-4xl font-bold text-green-600">
              {formatTime(timeStats.todayTime)}
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {timeStats.todayTime > 0 ? 'Keep up the good work!' : 'Time to start learning!'}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Weekly Progress</div>
          <div className="flex items-end">
            <div className="text-4xl font-bold text-purple-600">
              {formatTime(timeStats.weeklyTime)}
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {timeStats.weeklyTime > 300 ? 'Excellent progress!' : 'Aim for 5 hours this week!'}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Learning Time</div>
          <div className="flex items-end">
            <div className="text-4xl font-bold text-indigo-600">
              {formatTime(timeStats.totalTime)}
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {timeStats.totalTime > 1000 ? 'Master level!' : 'Keep going!'}
          </div>
        </div>
      </div>

      {/* Continue Learning Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Continue Learning</h2>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {nextLesson.title}
            </h3>
            <p className="text-gray-500">{nextLesson.description}</p>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <svg
                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {nextLesson.duration} minutes
            </div>
          </div>
          <Link
            to={`/learn/${nextLesson.id}`}
            className="flex-shrink-0 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Continue
          </Link>
        </div>
      </div>

      {/* Available Courses */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Calculus 101</h3>
                <p className="text-gray-500 mt-1">
                  Master the fundamentals of calculus through interactive lessons
                </p>
                <div className="mt-4">
                  <div className="text-sm text-gray-500 mb-1">
                    Progress: {courseProgress}%
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: `${courseProgress}%` }}
                    ></div>
                  </div>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-gray-500">Duration</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {calculus101.reduce(
                        (acc, module) =>
                          acc +
                          module.lessons.reduce(
                            (acc, lesson) => acc + lesson.duration,
                            0
                          ),
                        0
                      )}{' '}
                      min
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Lessons</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {calculus101.reduce(
                        (acc, module) => acc + module.lessons.length,
                        0
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="mt-6">
              <Link
                to="/course/calculus101"
                className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                {courseProgress > 0 ? 'Continue Course' : 'Start Course'}
              </Link>
            </div>
          </div>

          {/* Placeholder for future courses */}
          <div className="border rounded-lg p-6 bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-400">More Courses</h3>
                <p className="text-gray-400 mt-1">
                  Stay tuned! More courses are coming soon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 