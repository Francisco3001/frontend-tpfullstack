import { useState, useEffect } from "react";
import { getToken } from "../utils/auth";

const API_URL = import.meta.env.VITE_API_URL;

export default function useCart() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      const token = getToken();
      if (!token) return;

      setLoading(true);
      const res = await fetch(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (error) {
      console.error("Error al obtener carrito:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const token = getToken();
      if (!token) {
        alert("Inicia sesión para agregar al carrito");
        return false;
      }

      const res = await fetch(`${API_URL}/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId, quantity })
      });

      if (res.ok) {
        await fetchCart(); // Refrescar carrito
        return true;
      } else {
        const err = await res.json();
        const errorMessage = err.error || err.message || "Error al agregar producto";
        alert(errorMessage);
        return false;
      }
    } catch (error) {
      console.error("Error al agregar item:", error);
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = getToken();
      if (!token) return false;

      const res = await fetch(`${API_URL}/cart/items`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId })
      });

      if (res.ok) {
        await fetchCart();
        return true;
      } else {
        const err = await res.json();
        alert(err.message || "Error al eliminar producto");
        return false;
      }
    } catch (error) {
      console.error("Error al eliminar item:", error);
      return false;
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      return removeFromCart(productId);
    }
    try {
      const token = getToken();
      if (!token) return false;

      const res = await fetch(`${API_URL}/cart/items`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId, quantity: newQuantity })
      });

      if (res.ok) {
        await fetchCart();
        return true;
      } else {
        const err = await res.json();
        const errorMessage = err.error || err.message || "Error al actualizar cantidad";
        alert(errorMessage);
        return false;
      }
    } catch (error) {
      console.error("Error al actualizar item:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return { cart, loading, addToCart, removeFromCart, updateQuantity, refreshCart: fetchCart };
}
