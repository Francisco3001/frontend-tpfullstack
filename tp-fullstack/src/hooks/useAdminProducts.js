import { useState, useCallback } from 'react';
import { getToken } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL;

export default function useAdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/products?limit=1000`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        // Backend returns { data: [], pagination: {} } for products
        setProducts(data.data || data || []);
      } else {
        const err = await res.json();
        setError(err.message || 'Error al obtener productos');
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError('Error al obtener productos');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = async (id) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        },
        credentials: "include",
      });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
        return true;
      } else {
        const err = await res.json();
        alert(err.message || "Error al eliminar producto");
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateProductStock = async (product, newStock) => {
    try {
      const token = getToken();
      const updatedProduct = {
        ...product,
        stock: Number(newStock)
      };

      const res = await fetch(`${API_URL}/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedProduct)
      });

      if (res.ok) {
        alert("Stock actualizado");
        return true;
      } else {
        const err = await res.json();
        alert(err.message || "Error al actualizar stock");
        return false;
      }
    } catch (error) {
      console.error("Error saving stock:", error);
      return false;
    }
  };

  const createProduct = async (productData) => {
    try {
      const token = getToken();
      const payload = {
        ...productData,
        price: Number(productData.price),
        stock: Number(productData.stock)
      };

      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Producto creado exitosamente");
        return true;
      } else {
        const err = await res.json();
        alert(err.message || "Error al crear producto");
        return false;
      }
    } catch (error) {
      console.error("Error creating product:", error);
      return false;
    }
  };

  return {
    products,
    loading,
    error,
    fetchAllProducts,
    deleteProduct,
    updateProductStock,
    createProduct
  };
}
