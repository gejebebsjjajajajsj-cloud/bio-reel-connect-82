import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  adminUser: any | null;
  login: (user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se existe sessão salva
    const loggedIn = localStorage.getItem('admin_logged_in');
    const savedUser = localStorage.getItem('admin_user');

    if (loggedIn === 'true' && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setIsAuthenticated(true);
        setAdminUser(user);
      } catch (error) {
        console.error('Erro ao recuperar sessão:', error);
        localStorage.removeItem('admin_logged_in');
        localStorage.removeItem('admin_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (user: any) => {
    setIsAuthenticated(true);
    setAdminUser(user);
    localStorage.setItem('admin_logged_in', 'true');
    localStorage.setItem('admin_user', JSON.stringify(user));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_user');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};