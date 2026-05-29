import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
} from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL;

export default function DashboardPage() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`, {
        credentials: "include",
      });

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="home-container">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">
          Panel Admin
        </Typography>

        <Button variant="contained">
          + Nuevo producto
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} md={6} lg={4} key={product.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {product.name}
                </Typography>

                <Typography>
                  ${product.price}
                </Typography>

                <Stack direction="row" spacing={1} mt={2}>
                  <Button variant="outlined">
                    Editar
                  </Button>

                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(product.id)}
                  >
                    Eliminar
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}