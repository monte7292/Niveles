import React, { createContext, useContext, useState, useEffect } from 'react';
import config from '../config/config';
import discord from '../config/discord';

interface User {
  id: string;
  username: string;
  avatarUrl: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`https://api.niveles.xyz/api/user`, {
          credentials: 'include'
        });

        if (response.ok) {
          const userData = await response.json();
          setUser({
            id: userData.id,
            username: userData.username,
            avatarUrl: userData.avatarUrl || 'https://cdn.discordapp.com/embed/avatars/0.png'
          });
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = () => {
    window.location.href = discord.oauthUrl;
  };

  const logout = async () => {
    try {
      await fetch(`${config.apiUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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


