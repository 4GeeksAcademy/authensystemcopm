import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const backendUrl = process.env.BACKEND_URL;

  useEffect(() => {
    // Check if user is logged in on mount
    const token = sessionStorage.getItem('token');
    const email = sessionStorage.getItem('email');
    if (token && email) {
      validateToken(token, email);
    }
  }, []);

  const validateToken = async (token, email) => {
    try {
      const response = await fetch(`${backendUrl}/api/validate`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setUser({ email });
      } else {
        logout();
      }
    } catch (error) {
      console.error('Token validation error:', error);
      logout();
    }
  };

  const signup = async (email, password) => {
    const response = await fetch(`${backendUrl}/api/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Signup failed');
    }

    navigate('/login');
  };

  const login = async (email, password) => {
    const response = await fetch(`${backendUrl}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Login failed');
    }

    const data = await response.json();
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('email', data.email);
    setUser({ email: data.email });
    navigate('/private');
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('email');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};