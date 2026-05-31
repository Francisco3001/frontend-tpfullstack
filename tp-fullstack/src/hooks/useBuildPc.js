import { useState } from 'react';
import { getToken } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL;

export default function useBuildPc() {
  const [addingToCart, setAddingToCart] = useState(false);

  const addAllToCart = async (selectedProductsArray) => {
    try {
      setAddingToCart(true);
      const token = getToken();

      for (const product of selectedProductsArray) {
        await fetch(`${API_URL}/cart/items`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            product_id: product.id,
            quantity: 1
          })
        });
      }

      return true;
    } catch (err) {
      console.error("Error al agregar al carrito:", err);
      alert("Hubo un error al guardar los productos en el carrito.");
      return false;
    } finally {
      setAddingToCart(false);
    }
  };

  return {
    addingToCart,
    addAllToCart
  };
}
