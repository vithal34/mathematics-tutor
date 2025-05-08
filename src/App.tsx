import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useParams, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CourseOverview from './components/CourseOverview';
import LessonView from './components/LessonView';
import MathVisualizer from './components/MathVisualizer';
import CalculusConcepts from './components/CalculusConcepts';
import MathQuiz from './components/MathQuiz';
import VectorCalculus from './components/VectorCalculus';
import VolumeOfRevolution from './components/VolumeOfRevolution';
import TaylorSeries from './components/TaylorSeries';
import FunctionTransformations from './components/FunctionTransformations';
import { MathJaxContext } from 'better-react-mathjax';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-800">
                Math Learning Platform
              </Link>
            </div>
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/dashboard"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/course/calculus101"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Course
                </Link>
                <Link
                  to="/concepts"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Concepts
                </Link>
                <Link
                  to="/quiz/limits"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Quiz
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" />;
};

const QuizWrapper: React.FC = () => {
  const { topic } = useParams<{ topic: 'limits' | 'derivatives' | 'integration' | 'series' }>();
  return <MathQuiz topic={topic || 'limits'} />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MathJaxContext>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={<ProtectedRoute element={<Dashboard />} />}
              />
              <Route
                path="/course/calculus101"
                element={<ProtectedRoute element={<CourseOverview />} />}
              />
              <Route
                path="/learn/:lessonId"
                element={<ProtectedRoute element={<LessonView />} />}
              />
              <Route
                path="/concepts"
                element={<ProtectedRoute element={<CalculusConcepts />} />}
              />
              <Route
                path="/quiz/:topic"
                element={<ProtectedRoute element={<QuizWrapper />} />}
              />
              <Route
                path="/visualizer/:concept"
                element={<ProtectedRoute element={<MathVisualizer concept="limits" />} />}
              />
              <Route
                path="/vector-calculus"
                element={<ProtectedRoute element={<VectorCalculus />} />}
              />
              <Route
                path="/volume-of-revolution"
                element={<ProtectedRoute element={<VolumeOfRevolution />} />}
              />
              <Route
                path="/taylor-series"
                element={<ProtectedRoute element={<TaylorSeries />} />}
              />
              <Route
                path="/function-transformations"
                element={<ProtectedRoute element={<FunctionTransformations />} />}
              />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </Router>
      </MathJaxContext>
    </AuthProvider>
  );
};

export default App; 