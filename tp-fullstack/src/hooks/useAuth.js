import { useState } from "react";
import { setToken, getToken, removeToken } from "../utils/auth";


const API_URL = import.meta.env.VITE_API_URL;

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (values) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setToken(data.token);

      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const register = async (values) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setToken(data.token);

      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const token = getToken();

      if (!token) {
        return null;
      }

      const res = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        return null;
      }

      return await res.json();
    } catch {
      return null;
    }
  };

    const logout = () => {
      removeToken();
    };

  return {
    login,
    register,
    checkAuth,
    logout,
    loading,
    error,
  };
}