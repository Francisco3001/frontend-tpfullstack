import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Paper,
  CircularProgress
} from "@mui/material";
import useCategories from "../hooks/useCategories";
import useAdminProducts from "../hooks/useAdminProducts";
import useBuildPc from "../hooks/useBuildPc";

const COMPONENT_TYPES = [
  { key: "cpu", label: "Procesador (CPU)", required: true },
  { key: "mother", label: "Placa Madre (Motherboard)", required: true },
  { key: "ram", label: "Memoria RAM", required: true },
  { key: "gpu", label: "Placa de Video (GPU)", required: true },
  { key: "disco", label: "Almacenamiento (Disco)", required: true },
  { key: "fuente", label: "Fuente de Poder", required: true },
  { key: "gabinete", label: "Gabinete", required: true },
  { key: "monitor", label: "Monitor (Opcional)", required: false },
];

export default function BuildPcPage() {
  const navigate = useNavigate();
  const { categories, loading: catsLoading } = useCategories();
  const { products, loading: loadingProducts, fetchAllProducts } = useAdminProducts();
  const { addingToCart, addAllToCart } = useBuildPc();
  
  const [selections, setSelections] = useState({
    cpu: null,
    mother: null,
    ram: null,
    gpu: null,
    disco: null,
    fuente: null,
    gabinete: null,
    monitor: null
  });

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Helper para agrupar productos por la keyword de la categoria
  const getProductsForType = (typeKey) => {
    // Primero, encontramos el ID de la categoria buscando el key en el nombre
    const category = categories.find(c => c.name.toLowerCase().includes(typeKey));
    if (!category) return [];

    return products.filter(p => p.category_id === category.id);
  };

  const handleSelectionChange = (typeKey, value) => {
    const productId = value === "none" ? null : value;
    const selectedProduct = products.find(p => p.id === productId) || null;
    setSelections(prev => ({ ...prev, [typeKey]: selectedProduct }));
  };

  const totalPrice = Object.values(selections).reduce((sum, p) => {
    return sum + (p ? Number(p.price) : 0);
  }, 0);

  const isFormValid = COMPONENT_TYPES.every(type => {
    return type.required ? selections[type.key] !== null : true;
  });

  const handleAddToCart = async () => {
    const selectedProducts = Object.values(selections).filter(p => p !== null);
    
    const success = await addAllToCart(selectedProducts);
    
    if (success) {
      navigate("/products");
    }
  };

  if (catsLoading || loadingProducts) {
    return (
      <Box sx={{ minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        Arma tu PC
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Selecciona paso a paso los componentes que prefieras. El resumen se actualizará automáticamente.
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {COMPONENT_TYPES.map((type) => {
              const options = getProductsForType(type.key);
              
              return (
                <FormControl key={type.key} fullWidth>
                  <InputLabel id={`select-label-${type.key}`}>{type.label}</InputLabel>
                  <Select
                    labelId={`select-label-${type.key}`}
                    id={`select-${type.key}`}
                    value={selections[type.key]?.id || "none"}
                    label={type.label}
                    onChange={(e) => handleSelectionChange(type.key, e.target.value)}
                  >
                    <MenuItem value="none">
                      <em>Ninguno</em>
                    </MenuItem>
                    {options.map((option) => (
                      <MenuItem key={option.id} value={option.id} disabled={option.stock <= 0}>
                        {option.name} - ${Number(option.price).toLocaleString("es-AR")}
                        {option.stock <= 0 ? " (Sin stock)" : ""}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );
            })}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Resumen
            </Typography>

            <Box sx={{ my: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {COMPONENT_TYPES.map(type => {
                const p = selections[type.key];
                return (
                  <Box key={`summary-${type.key}`} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      {type.label.split(' ')[0]}:
                    </Typography>
                    <Typography variant="body2" fontWeight={p ? "bold" : "normal"} color={p ? "text.primary" : "text.secondary"}>
                      {p ? `$${Number(p.price).toLocaleString("es-AR")}` : "-"}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2, mt: 2 }}>
              <Typography variant="h4" fontWeight="bold" align="right">
                ${totalPrice.toLocaleString("es-AR")}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              disabled={!isFormValid || addingToCart}
              onClick={handleAddToCart}
            >
              {addingToCart ? "Agregando..." : "Agregar al carrito"}
            </Button>
            
            {!isFormValid && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                Debes seleccionar todos los componentes obligatorios.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
