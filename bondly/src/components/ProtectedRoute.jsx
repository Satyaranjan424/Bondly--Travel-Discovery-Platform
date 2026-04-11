import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

export function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, isBooting } = useAuth();

  if (isBooting) {
    return <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center px-5 text-sm text-[var(--muted)]">Preparing your space...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return children;
}
