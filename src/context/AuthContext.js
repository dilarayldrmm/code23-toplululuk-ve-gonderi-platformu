import React, { createContext, useContext, useState } from 'react';
import { loginRequest } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const login = async (username, password) => {
    setIsAuthLoading(true);

    try {
      const data = await loginRequest(username, password);

      setToken(data.accessToken);
      setUser(data);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Giriş yapılamadı',
      };
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}