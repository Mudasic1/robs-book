import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  sub: string; // email
  access_token?: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Key for localStorage
export const TOKEN_KEY = "physical_ai_token";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        const decoded = jwtDecode<User>(token);
        setUser({ ...decoded, access_token: token });
      } catch (e) {
        console.error("Invalid token", e);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    const decoded = jwtDecode<User>(token);
    setUser({ ...decoded, access_token: token });
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
