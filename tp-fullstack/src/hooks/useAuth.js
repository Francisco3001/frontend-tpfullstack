import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // LOGIN
  const login = async (values) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔥 cookie
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // REGISTER
  const register = async (values) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al registrarse");
      }

      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 🔍 CHECK AUTH
  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: "GET",
        credentials: "include", // manda cookie
      });

      if (!res.ok) {
        return null;
      }

      const user = await res.json();
      return user;
    } catch (err) {
      return null;
    }
  };

  return {
    login,
    register,
    checkAuth, 
    loading,
    error,
  };
}