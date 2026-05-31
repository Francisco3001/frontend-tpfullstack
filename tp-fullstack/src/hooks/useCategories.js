import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCategories = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/categories`);
      
      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }

      const response = await res.json();
      setCategories(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    getCategories,
  };
}
