import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

interface AuthContextType {
  isAuthenticated: boolean;
  logout: () => void;
  loading: boolean;
  login: (access: string, refresh: string) => void;
  user: { id: number; username: string; email: string; profile_picture?: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: number; username: string; email: string; profile_picture?: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
    setLoading(false);
    if (token) {
      fetchUserProfile(token);
    } else {
      setUser(null);
    }
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch user profile');
      const data = await res.json();
      setUser({
        id: data.id,
        username: data.username,
        email: data.email,
        profile_picture: data.profile_picture,
      });
    } catch (err) {
      setUser(null);
    }
  };

  const login = (access: string, refresh: string) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    setIsAuthenticated(true);
    fetchUserProfile(access);
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout, loading, login, user }}>
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