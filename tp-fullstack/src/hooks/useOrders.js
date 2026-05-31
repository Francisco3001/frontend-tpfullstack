import { useState, useCallback } from 'react';
import useAuth from './useAuth';
import { getToken } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL;

export default function useOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyOrders = useCallback(async () => {
    const currentToken = getToken() || token;
    if (!currentToken) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/orders/me`, {
        headers: {
          Authorization: `Bearer ${currentToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        const err = await response.json();
        setError(err.message || 'Error al obtener los pedidos');
      }
    } catch (err) {
      setError('Error al obtener los pedidos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createOrder = async () => {
    const currentToken = getToken() || token;
    if (!currentToken) return false;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        const err = await response.json();
        setError(err.message || 'Error al crear el pedido');
        alert(err.message || 'Error al crear el pedido');
        return null;
      }
    } catch (err) {
      setError('Error al crear el pedido');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    loading,
    error,
    fetchMyOrders,
    createOrder,
  };
}
