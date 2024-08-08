"use client"

import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const savedToken = window.localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
  }, []);

  useEffect(() => {
    if (token) {
      window.localStorage.setItem("token", token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post('https://fastapi-backend-deployment-production.up.railway.app/auth/token', formData, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      });

      setToken(response.data.access_token);
      setUser(response.data);
      router.push('/');
    } catch (error) {
      console.log('Login Failed:', error);
    }
  };

    const logout = () => {
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
        router.push('/login')
    };

    return (
        <AuthContext.Provider value={{ user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;