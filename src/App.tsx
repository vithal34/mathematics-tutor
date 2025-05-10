import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CourseOverview from './components/CourseOverview';
import LessonView from './components/LessonView';
import MathVisualizer from './components/MathVisualizer';
import CalculusConcepts from './components/CalculusConcepts';
import Quiz from './components/Quiz';
import VectorCalculus from './components/VectorCalculus';
import VolumeOfRevolution from './components/VolumeOfRevolution';
import TaylorSeries from './components/TaylorSeries';
import FunctionTransformations from './components/FunctionTransformations';
import { MathJaxContext } from 'better-react-mathjax';
import { courses } from './data/courseStructure';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { state: { from: location.pathname } });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
                  className={`${
                    location.pathname === '/dashboard'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/course/calculus101"
                  className={`${
                    location.pathname.startsWith('/course')
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Course
                </Link>
                <Link
                  to="/concepts"
                  className={`${
                    location.pathname === '/concepts'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Concepts
                </Link>
                <Link
                  to="/quiz/limits"
                  className={`${
                    location.pathname.startsWith('/quiz')
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Quiz
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Welcome, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Logout
                </button>
              </div>
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

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <MathJaxContext>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/course/:courseId/module/:moduleId"
                element={
                  <PrivateRoute>
                    <LessonView />
                  </PrivateRoute>
                }
              />
              <Route
                path="/course/:courseId/module/:moduleId/quiz/:lessonId"
                element={
                  <PrivateRoute>
                    <Quiz />
                  </PrivateRoute>
                }
              />
              <Route
                path="/concepts"
                element={
                  <PrivateRoute>
                    <CalculusConcepts />
                  </PrivateRoute>
                }
              />
              <Route
                path="/course/calculus101"
                element={
                  <PrivateRoute>
                    <CourseOverview />
                  </PrivateRoute>
                }
              />
              <Route
                path="/visualizer/:concept"
                element={
                  <PrivateRoute>
                    <MathVisualizer concept="limits" />
                  </PrivateRoute>
                }
              />
              <Route
                path="/vector-calculus"
                element={
                  <PrivateRoute>
                    <VectorCalculus />
                  </PrivateRoute>
                }
              />
              <Route
                path="/volume-of-revolution"
                element={
                  <PrivateRoute>
                    <VolumeOfRevolution />
                  </PrivateRoute>
                }
              />
              <Route
                path="/taylor-series"
                element={
                  <PrivateRoute>
                    <TaylorSeries />
                  </PrivateRoute>
                }
              />
              <Route
                path="/function-transformations"
                element={
                  <PrivateRoute>
                    <FunctionTransformations />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </MathJaxContext>
      </AuthProvider>
    </Router>
  );
};

export default App; 