import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box
} from "@mui/material";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="180"
        image={product.image_url}
        alt={product.name}
        sx={{ objectFit: 'contain', p: 2, bgcolor: '#fff' }}
      />

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1, lineHeight: 1.2 }}>
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            flexGrow: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            mb: 2
          }}
        >
          {product.description}
        </Typography>

        <Box sx={{ mt: 'auto' }}>
          <Typography
            variant="h6"
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
            onClick={() => onAddToCart && onAddToCart(product.id)}
          >
            Agregar al carrito
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}