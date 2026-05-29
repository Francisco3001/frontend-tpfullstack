import { Navigate } from "react-router-dom";

export default function PublicRoute({ isAuth, role, children }) {
  if (isAuth) {
    return (
      <Navigate
        to={role === "admin" ? "/dashboard" : "/products"}
      />
    );
  }

  return children;
}