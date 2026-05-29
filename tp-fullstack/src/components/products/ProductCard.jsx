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
        image={product.image_url}
        alt={product.name}
      />

      <CardContent>
        <Typography variant="h6">
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          {product.description}
        </Typography>

        <Typography
          variant="h6"
          sx={{ mt: 1 }}
        >
          ${Number(product.price).toLocaleString("es-AR")}
        </Typography>

        <Typography
          variant="body2"
          color={
            product.stock > 0
              ? "success.main"
              : "error.main"
          }
          sx={{ mt: 0.5 }}
        >
          {product.stock > 0
            ? `Stock disponible: ${product.stock}`
            : "Sin stock"}
        </Typography>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={product.stock <= 0}
        >
          Comprar
        </Button>
      </CardContent>
    </Card>
  );
}