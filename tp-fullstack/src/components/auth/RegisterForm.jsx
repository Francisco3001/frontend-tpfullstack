import { useState } from "react";
import { TextField, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const { register, loading, error } = useAuth();

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!values.name) newErrors.name = "Requerido";
    if (!values.email) newErrors.email = "Requerido";
    if (!values.password) newErrors.password = "Requerido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = await register(values);

    if (data) {
      navigate("/products");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Nombre"
          name="name"
          value={values.name}
          onChange={handleChange}
          fullWidth
          error={!!errors.name}
          helperText={errors.name}
        />

        <TextField
          label="Email"
          name="email"
          value={values.email}
          onChange={handleChange}
          fullWidth
          error={!!errors.email}
          helperText={errors.email}
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          fullWidth
          error={!!errors.password}
          helperText={errors.password}
        />

        {error && <span style={{ color: "red" }}>{error}</span>}

        <Button variant="contained" type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Registrarse"}
        </Button>
      </Stack>
    </form>
  );
}