import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  progress: {
    [key: string]: {
      completed: boolean;
      studyTime: number;
      lastStudied: string;
      quizScores: number[];
      practiceProblemsCompleted: number;
      correctAnswers: number;
      uniqueFunctionsVisualized: number;
      dailyStudyTime: {
        [date: string]: number;
      };
      totalStudyTime: number;
    };
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProgress: (lessonId: string, progress: Partial<User['progress'][string]>) => Promise<void>;
  getStudyTime: (lessonId: string) => number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user data from localStorage on mount
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Check if user exists in localStorage
    const existingUser = localStorage.getItem(`user_${email}`);
    if (existingUser) {
      const parsedUser = JSON.parse(existingUser);
      setUser(parsedUser);
      localStorage.setItem('user', existingUser);
    } else {
      // Create new user with empty progress
      const newUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        progress: {}
      };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem(`user_${email}`, JSON.stringify(newUser));
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: '1',
      email,
      name,
      progress: {}
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProgress = async (lessonId: string, progress: Partial<User['progress'][string]>) => {
    if (!user) return;

    const currentProgress = user.progress[lessonId] || {
      completed: false,
      studyTime: 0,
      lastStudied: new Date().toISOString(),
      quizScores: [],
      practiceProblemsCompleted: 0,
      correctAnswers: 0,
      uniqueFunctionsVisualized: 0,
      dailyStudyTime: {},
      totalStudyTime: 0
    };

    const updatedProgress = {
      ...currentProgress,
      ...progress,
      lastStudied: new Date().toISOString()
    };

    const updatedUser = {
      ...user,
      progress: {
        ...user.progress,
        [lessonId]: updatedProgress
      }
    };

    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    localStorage.setItem(`user_${user.email}`, JSON.stringify(updatedUser));
  };

  const getStudyTime = (lessonId: string): number => {
    return user?.progress[lessonId]?.studyTime || 0;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
        updateProgress,
        getStudyTime
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 