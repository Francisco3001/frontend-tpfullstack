import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";

import ProtectedRoute from "./components/routes/ProtectedRoute";
import PublicRoute from "./components/routes/PublicRoute";

import useAuth from "./hooks/useAuth";

function App() {
  const { checkAuth } = useAuth();

  const [isAuth, setIsAuth] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const user = await checkAuth();

      if (user) {
        setIsAuth(true);
        setRole(user.role);
      } else {
        setIsAuth(false);
        setRole(null);
      }
    };

    loadUser();
  }, []);

  if (isAuth === null) return <p>Cargando...</p>; /* muestra un cargando  */

  return (
    <Routes>
      {/* ROOT inteligente */}
      <Route
        path="/"
        element={
          isAuth ? (
            role === "admin" ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/products" />
            )
          ) : (
            <Navigate to="/auth" />
          )
        }
      />

      {/* AUTH */}
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />

      {/* PRODUCTS */}
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            isAuth={isAuth}
            role={role}
            requiredRole="admin"
          >
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;