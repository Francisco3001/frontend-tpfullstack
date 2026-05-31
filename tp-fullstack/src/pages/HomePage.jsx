import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Button,
  IconButton,
  Badge,
  Menu,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemSecondaryAction,
  Pagination
} from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

import ProductCard from "../components/products/ProductCard";
import useProducts from "../hooks/useProducts";
import useCategories from "../hooks/useCategories";
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";
import useOrders from "../hooks/useOrders";

export default function HomePage() {
  const navigate = useNavigate();
  const cartIconRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(1);

  const {
    products,
    pagination,
    loading,
  } = useProducts(selectedCategory || null, page);

  const { categories } = useCategories();
  const { cart, addToCart, removeFromCart, updateQuantity, refreshCart } = useCart();
  const { createOrder } = useOrders();
  const { logout } = useAuth();

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(1); // Reset page on category change
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleCartClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCartClose = () => {
    setAnchorEl(null);
  };

  const handleAddToCartClick = async (productId) => {
    const success = await addToCart(productId, 1);
    if (success && cartIconRef.current) {
      setAnchorEl(cartIconRef.current);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login"); 
  };

  const handleCheckout = async () => {
    const order = await createOrder();
    if (order) {
      alert("¡Pedido realizado con éxito!");
      setAnchorEl(null);
      window.location.reload();
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 2 }}>
        <Typography
          variant="h3"
          fontWeight="bold"
        >
          Catálogo de Productos
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            onClick={() => navigate('/build-pc')}
          >
            ¡Arma tu PC!
          </Button>

          <Button 
            variant="contained" 
            color="info" 
            size="large"
            onClick={() => navigate('/orders')}
          >
            Mis Pedidos
          </Button>

          <Button 
            variant="outlined" 
            color="error" 
            size="large"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </Button>

          <IconButton color="primary" onClick={handleCartClick} size="large" ref={cartIconRef}>
            <Badge badgeContent={cart.items?.length || 0} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCartClose}
            PaperProps={{ style: { maxHeight: 400, width: '350px' } }}
          >
            <Typography variant="h6" sx={{ px: 2, py: 1 }}>Mi Carrito</Typography>
            <Divider />
            {cart.items && cart.items.length > 0 ? (
              <List>
                {cart.items.map((item) => (
                  <ListItem key={item.id} divider sx={{ pr: 12 }}>
                    <ListItemText 
                      primary={`${item.product_name || 'Producto'}`} 
                      secondary={`Subtotal: $${Number(item.subtotal || 0).toLocaleString('es-AR')} ($${Number(item.price || 0).toLocaleString('es-AR')} c/u)`} 
                    />
                    <ListItemSecondaryAction sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton size="small" onClick={() => updateQuantity(item.product_id, item.quantity - 1)}>
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography variant="body2" sx={{ mx: 1 }}>{item.quantity}</Typography>
                      <IconButton size="small" onClick={() => updateQuantity(item.product_id, item.quantity + 1)}>
                        <AddIcon fontSize="small" />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" onClick={() => removeFromCart(item.product_id)} color="error" sx={{ ml: 1 }}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
                <ListItem>
                  <ListItemText 
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                    primary="Total del Carrito" 
                    secondary={`$${cart.items.reduce((sum, item) => sum + Number(item.subtotal || 0), 0).toLocaleString('es-AR')}`} 
                  />
                </ListItem>
                <ListItem>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    onClick={handleCheckout}
                  >
                    Finalizar Compra
                  </Button>
                </ListItem>
              </List>
            ) : (
              <Typography variant="body2" sx={{ p: 2, color: 'text.secondary', textAlign: 'center' }}>
                Tu carrito está vacío.
              </Typography>
            )}
          </Menu>
        </Box>
      </Box>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Explore nuestra selección de productos disponibles.
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <Box sx={{ minWidth: 200, maxWidth: 300, flexGrow: 1 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="category-select-label">Categoría</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={selectedCategory}
              label="Categoría"
              onChange={handleCategoryChange}
            >
              <MenuItem value="">
                <em>Todas las categorías</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ flexGrow: 2, minWidth: 250 }}>
          <TextField
            fullWidth
            size="small"
            label="Buscar producto"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Box>
      </Box>

      {pagination && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Mostrando {filteredProducts.length} producto(s)
          {filteredProducts.length !== products.length ? ` de ${products.length} filtrados` : ` de ${pagination.total}`}
        </Typography>
      )}

      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={product.id}
          >
            <ProductCard 
              product={product} 
              onAddToCart={handleAddToCartClick}
            />
          </Grid>
        ))}
      </Grid>

      {pagination && pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination 
            count={pagination.totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
            size="large"
          />
        </Box>
      )}
    </Container>
  );
}