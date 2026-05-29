import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  isAuth,
  role,
  requiredRole,
  children,
}) {
  // no logueado → login
  if (!isAuth) {
    return <Navigate to="/auth" />;
  }
  // si requiere rol y no lo tiene
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/products" />;
  }

  return children;
}