import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function useProducts(categoryId = null, page = 1) {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getProducts = async () => {
    try {
      setLoading(true);

      let url = `${API_URL}/products?page=${page}&limit=10&`;
      if (categoryId) {
        url += `category=${categoryId}&`;
      }

      const res = await fetch(url);

      const response = await res.json();

      setProducts(
        Array.isArray(response.data)
          ? response.data
          : []
      );

      setPagination(response.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, [categoryId, page]);

  return {
    products,
    pagination,
    loading,
    error,
    getProducts,
  };
}