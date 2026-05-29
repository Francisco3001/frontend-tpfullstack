import { useState } from "react";
import { Tabs, Tab, Paper, Box, Typography } from "@mui/material";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import "../index.css";

export default function AuthPage() {
  const [tab, setTab] = useState(0);

  return (
    <div className="auth-container">
      <Paper elevation={4} className="auth-card">
        <Typography variant="h5" align="center" gutterBottom>
          TIENDA PC
        </Typography>

        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          centered
        >
          <Tab label="Login" />
          <Tab label="Registro" />
        </Tabs>

        <Box mt={2}>
          {tab === 0 && <LoginForm />}
          {tab === 1 && <RegisterForm />}
        </Box>
      </Paper>
    </div>
  );
}