import { useState, useEffect } from "react";
import {
  Container, Typography, Box, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TextField, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
  InputLabel, Select, MenuItem, CircularProgress
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import useCategories from "../hooks/useCategories";
import useAdminProducts from "../hooks/useAdminProducts";

export default function StockPage() {
  const { products, loading, fetchAllProducts, updateProductStock, createProduct } = useAdminProducts();
  const [editingStock, setEditingStock] = useState({});
  const { categories, loading: catsLoading } = useCategories();

  // Modal state
  const [open, setOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "", description: "", brand: "", price: "", stock: "", image_url: "", category_id: "", is_active: true
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const handleStockChange = (id, value) => {
    setEditingStock({ ...editingStock, [id]: value });
  };

  const handleSaveStock = async (product) => {
    const newStock = editingStock[product.id];
    if (newStock === undefined) return;

    const success = await updateProductStock(product, newStock);
    if (success) {
      setEditingStock((prev) => {
        const next = { ...prev };
        delete next[product.id];
        return next;
      });
      fetchAllProducts();
    }
  };

  const handleCreateProduct = async () => {
    setCreating(true);
    const success = await createProduct(newProduct);
    if (success) {
      setOpen(false);
      setNewProduct({ name: "", description: "", brand: "", price: "", stock: "", image_url: "", category_id: "", is_active: true });
      fetchAllProducts();
    }
    setCreating(false);
  };

  if (loading || catsLoading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Gestión de Inventario</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Nuevo Producto
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock Actual</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.category_name}</TableCell>
                <TableCell>${Number(p.price).toLocaleString("es-AR")}</TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={editingStock[p.id] !== undefined ? editingStock[p.id] : p.stock}
                    onChange={(e) => handleStockChange(p.id, e.target.value)}
                    sx={{ width: '80px' }}
                  />
                </TableCell>
                <TableCell>
                  {editingStock[p.id] !== undefined && editingStock[p.id] !== String(p.stock) && (
                    <IconButton color="primary" onClick={() => handleSaveStock(p)}>
                      <SaveIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Crear Producto */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Registrar Nuevo Producto</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Nombre" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} fullWidth />
            <TextField label="Descripción" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} fullWidth multiline rows={2} />
            <TextField label="Marca" value={newProduct.brand} onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })} fullWidth />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField label="Precio" type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} fullWidth />
              <TextField label="Stock Inicial" type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} fullWidth />
            </Box>
            
            <TextField label="URL de Imagen" value={newProduct.image_url} onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })} fullWidth />
            
            <FormControl fullWidth>
              <InputLabel id="cat-label">Categoría</InputLabel>
              <Select labelId="cat-label" value={newProduct.category_id} label="Categoría" onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}>
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateProduct} disabled={creating}>
            {creating ? "Guardando..." : "Guardar Producto"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
