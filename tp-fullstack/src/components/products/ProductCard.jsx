import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";

export default function ProductCard({ product }) {
  return (
    <Card>
      <CardMedia
        component="img"
        height="160"
        image={product.image || "https://via.placeholder.com/300"}
        alt={product.name}
      />

      <CardContent>
        <Typography variant="h6">
          {product.name}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>

        <Typography variant="h6" sx={{ mt: 1 }}>
          ${product.price}
        </Typography>

        <Button variant="contained" fullWidth sx={{ mt: 1 }}>
          Comprar
        </Button>
      </CardContent>
    </Card>
  );
}