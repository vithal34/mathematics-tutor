import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { calculus101, Module, Lesson } from '../data/courseStructure';

const LessonView: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { user, updateProgress, updateStudyTime } = useAuth();
  const [studyTimer, setStudyTimer] = useState<number>(0);
  const [isStudying, setIsStudying] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');

  // Find current lesson and its module
  const currentLesson = calculus101
    .flatMap(module => module.lessons)
    .find(lesson => lesson.id === lessonId);

  const currentModule = calculus101.find(module =>
    module.lessons.some(lesson => lesson.id === lessonId)
  );

  // Find next and previous lessons
  const allLessons = calculus101.flatMap(module => module.lessons);
  const currentIndex = allLessons.findIndex(lesson => lesson.id === lessonId);
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  useEffect(() => {
    if (!currentLesson) {
      navigate('/dashboard');
      return;
    }

    let timer: NodeJS.Timeout;
    if (isStudying) {
      timer = setInterval(() => {
        setStudyTimer(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
        // Save progress when unmounting
        if (studyTimer > 0) {
          updateStudyTime(currentLesson.id, studyTimer);
        }
      }
    };
  }, [currentLesson, isStudying, studyTimer, updateStudyTime, navigate]);

  // Save progress periodically (every minute)
  useEffect(() => {
    if (!isStudying || !currentLesson) return;

    const saveInterval = setInterval(() => {
      if (studyTimer > 0) {
        updateStudyTime(currentLesson.id, 60); // Save every minute
      }
    }, 60000); // Every minute

    return () => clearInterval(saveInterval);
  }, [isStudying, currentLesson, studyTimer, updateStudyTime]);

  if (!currentLesson || !currentModule) {
    return null;
  }

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours > 0 ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleComplete = async () => {
    if (studyTimer > 0) {
      await updateStudyTime(currentLesson.id, studyTimer);
    }
    
    await updateProgress(currentLesson.id, {
      completed: true
    });

    if (nextLesson) {
      navigate(`/learn/${nextLesson.id}`);
    } else {
      navigate('/course/calculus101');
    }
  };

  const renderContent = () => {
    switch (currentLesson.type) {
      case 'video':
        return (
          <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg mb-6">
            <div className="flex items-center justify-center text-white">
              Video content placeholder for: {currentLesson.content}
            </div>
          </div>
        );
      
      case 'reading':
        return (
          <div className="prose max-w-none">
            <div className="bg-white rounded-lg p-6">
              Reading content placeholder for: {currentLesson.content}
            </div>
          </div>
        );
      
      case 'quiz':
        return (
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Quiz</h3>
            Quiz content placeholder for: {currentLesson.content}
          </div>
        );
      
      case 'practice':
        return (
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Practice Problems</h3>
            Practice content placeholder for: {currentLesson.content}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/course/calculus101')}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Back to Course
              </button>
              <div className="ml-4">
                <div className="text-sm text-gray-500">{currentModule.title}</div>
                <div className="text-lg font-medium text-gray-900">
                  {currentLesson.title}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Study time: {formatTime(studyTimer)}
              </div>
              <button
                onClick={() => setIsStudying(!isStudying)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  isStudying
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {isStudying ? 'Take a Break' : 'Resume'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Sidebar - Module Progress */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Module Progress
              </h3>
              <div className="space-y-4">
                {currentModule.lessons.map(lesson => (
                  <div
                    key={lesson.id}
                    className={`flex items-center space-x-3 p-2 rounded ${
                      lesson.id === currentLesson.id
                        ? 'bg-blue-50 border-l-4 border-blue-500'
                        : ''
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {user?.progress?.[lesson.id]?.completed ? (
                        <span className="text-green-500">✓</span>
                      ) : lesson.id === currentLesson.id ? (
                        <span className="text-blue-500">▶</span>
                      ) : (
                        <span className="text-gray-300">○</span>
                      )}
                    </div>
                    <div className="flex-1 text-sm">
                      <div className="font-medium text-gray-900">
                        {lesson.title}
                      </div>
                      <div className="text-gray-500">{lesson.duration} min</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-2">
            <div className="space-y-6">
              {renderContent()}

              {/* Notes Section */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Notes
                  </h3>
                  <button
                    onClick={() => setShowNotes(!showNotes)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {showNotes ? 'Hide Notes' : 'Show Notes'}
                  </button>
                </div>
                {showNotes && (
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full h-40 p-4 border rounded-md"
                    placeholder="Take notes here..."
                  />
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center">
                {previousLesson ? (
                  <button
                    onClick={() => navigate(`/learn/${previousLesson.id}`)}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    ← Previous: {previousLesson.title}
                  </button>
                ) : (
                  <div />
                )}
                <button
                  onClick={handleComplete}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {nextLesson ? 'Complete & Continue' : 'Complete Module'}
                </button>
                {nextLesson ? (
                  <button
                    onClick={() => navigate(`/learn/${nextLesson.id}`)}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Next: {nextLesson.title} →
                  </button>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonView; 