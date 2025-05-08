import React, { createContext, useContext, useState, useEffect } from 'react';

interface Progress {
  completed: boolean;
  lastAccessed?: string;
  timeSpent: number; // in seconds
  quizScores: number[];
  practiceProblemsCompleted: number;
  correctAnswers: number;
  visualizationsCompleted: string[];
  uniqueFunctionsVisualized: number;
  dailyStudyTime: {
    [date: string]: number; // date in YYYY-MM-DD format, time in seconds
  };
  totalStudyTime: number; // in seconds
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher';
  progress: {
    [conceptId: string]: Progress;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  updateProgress: (conceptId: string, updates: Partial<Progress>) => Promise<void>;
  updateStudyTime: (conceptId: string, seconds: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    const mockUser: User = {
      id: '1',
      name: 'Test User',
      email,
      role: 'student',
      progress: {}
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const signup = async (email: string, password: string, name: string) => {
    // Simulate API call
    const mockUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: 'student',
      progress: {}
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateStudyTime = async (conceptId: string, seconds: number) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const currentProgress = user.progress[conceptId] || {
      completed: false,
      timeSpent: 0,
      quizScores: [],
      practiceProblemsCompleted: 0,
      correctAnswers: 0,
      visualizationsCompleted: [],
      uniqueFunctionsVisualized: 0,
      dailyStudyTime: {},
      totalStudyTime: 0
    };

    const updatedProgress = {
      ...currentProgress,
      timeSpent: currentProgress.timeSpent + seconds,
      totalStudyTime: currentProgress.totalStudyTime + seconds,
      dailyStudyTime: {
        ...currentProgress.dailyStudyTime,
        [today]: (currentProgress.dailyStudyTime[today] || 0) + seconds
      },
      lastAccessed: new Date().toISOString()
    };

    setUser({
      ...user,
      progress: {
        ...user.progress,
        [conceptId]: updatedProgress
      }
    });

    // Here you would typically also update the backend
    // await api.updateUserProgress(user.id, conceptId, updatedProgress);
  };

  const updateProgress = async (conceptId: string, updates: Partial<Progress>) => {
    if (!user) return;

    const currentProgress = user.progress[conceptId] || {
      completed: false,
      timeSpent: 0,
      quizScores: [],
      practiceProblemsCompleted: 0,
      correctAnswers: 0,
      visualizationsCompleted: [],
      uniqueFunctionsVisualized: 0,
      dailyStudyTime: {},
      totalStudyTime: 0
    };

    const updatedProgress = {
      ...currentProgress,
      ...updates,
      lastAccessed: new Date().toISOString()
    };

    setUser({
      ...user,
      progress: {
        ...user.progress,
        [conceptId]: updatedProgress
      }
    });

    // Here you would typically also update the backend
    // await api.updateUserProgress(user.id, conceptId, updatedProgress);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    signup,
    updateProgress,
    updateStudyTime
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 