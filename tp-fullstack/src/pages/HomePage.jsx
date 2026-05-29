import { useEffect, useState } from "react";
import { Grid, Typography, CircularProgress } from "@mui/material";
import ProductCard from "../components/products/ProductCard";

const API_URL = import.meta.env.VITE_API_URL;

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <div className="home-container">
      <Typography variant="h4" gutterBottom>
        Productos
      </Typography>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}