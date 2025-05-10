import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { courses } from '../data/courseStructure';

const LessonView: React.FC = () => {
  const { courseId, moduleId } = useParams<{ courseId: string; moduleId: string }>();
  const navigate = useNavigate();
  const { user, updateProgress, getStudyTime } = useAuth();
  const [studyTimer, setStudyTimer] = useState(0);
  const [visibleSolutions, setVisibleSolutions] = useState<Record<string, boolean>>({});

  const course = courses[courseId as keyof typeof courses];
  const module = course?.modules.find(m => m.id === moduleId);

  useEffect(() => {
    if (!course || !module) {
      navigate('/');
      return;
    }

    // Initialize study timer with saved time
    const savedTime = getStudyTime(module.id);
    setStudyTimer(savedTime);

    // Start timer
    const timer = setInterval(() => {
      setStudyTimer(prev => {
        const newTime = prev + 1;
        // Save progress every minute
        if (newTime % 60 === 0) {
          updateProgress(module.id, {
            studyTime: newTime,
            lastStudied: new Date().toISOString()
          });
        }
        return newTime;
      });
    }, 1000);

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updateProgress(module.id, {
          studyTime: studyTimer,
          lastStudied: new Date().toISOString()
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Save remaining time when component unmounts
      updateProgress(module.id, {
        studyTime: studyTimer,
        lastStudied: new Date().toISOString()
      });
    };
  }, [course, module, navigate, updateProgress, getStudyTime]);

  const toggleSolution = (problemId: string) => {
    setVisibleSolutions(prev => ({
      ...prev,
      [problemId]: !prev[problemId]
    }));
  };

  const handleComplete = () => {
    if (module) {
      updateProgress(module.id, {
        completed: true,
        lastStudied: new Date().toISOString()
      });
      navigate(`/course/${courseId}/module/${moduleId}/quiz/${module.lessons[0].id}`);
    }
  };

  if (!module) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{module.title}</h1>
          <div className="text-sm text-gray-500">
            Study Time: {Math.floor(studyTimer / 60)}:{(studyTimer % 60).toString().padStart(2, '0')}
          </div>
        </div>

        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: module.description }} />
        </div>

        <div className="mt-8 space-y-6">
          {module.lessons.map((lesson) => (
            <div key={lesson.id} className="border rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">{lesson.title}</h3>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span>{lesson.duration} min</span>
                <span className="mx-2">•</span>
                <span className="capitalize">{lesson.type}</span>
              </div>
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleComplete}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Complete Module
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonView; 