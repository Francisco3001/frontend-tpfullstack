import { useState } from "react";
import { TextField, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!values.email) newErrors.email = "Requerido";
    if (!values.password) newErrors.password = "Requerido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const response = await login(values);

    localStorage.setItem("token", response.token);

    if (response) {
      navigate("/products");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
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

        {error && (
          <span style={{ color: "red", fontSize: "14px" }}>
            {error}
          </span>
        )}

        <Button
          variant="contained"
          type="submit"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Ingresar"}
        </Button>
      </Stack>
    </form>
  );
}