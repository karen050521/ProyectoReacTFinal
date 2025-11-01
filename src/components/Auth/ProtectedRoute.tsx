// src/components/Auth/ProtectedRoute.tsx
// Single Responsibility: Solo protege rutas basado en autenticación
// Dependency Inversion: Usa AuthContext en lugar de localStorage directo

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { CircularProgress, Box, Typography } from "@mui/material";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  fallbackPath?: string; // Open/Closed: extensible para diferentes rutas de fallback
  requiredRole?: string; // Interface Segregation: opcional para control granular
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallbackPath = "/auth/signin",
  requiredRole 
}) => {
  const { isAuthenticated, loading, currentUser } = useAuth();

  // Loading state
  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Verificando autenticación...
        </Typography>
      </Box>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Check role if required (Interface Segregation)
  if (requiredRole && currentUser) {
    const userRoles = currentUser.roles?.map(role => role.name) || [];
    if (!userRoles.includes(requiredRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Authenticated and authorized - render children or Outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
