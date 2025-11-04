// src/components/Auth/ProtectedRoute.tsx
// Single Responsibility: Solo protege rutas basado en autenticación
// Dependency Inversion: Usa AuthContext en lugar de localStorage directo
// Hybrid Authentication: Soporta tanto autenticación tradicional como Microsoft MSAL

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useIsAuthenticated } from "@azure/msal-react";
import { CircularProgress, Box, Typography } from "@mui/material";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  fallbackPath?: string; // Open/Closed: extensible para diferentes rutas de fallback
  requiredRole?: string; // Interface Segregation: opcional para control granular
  authMode?: 'hybrid' | 'context-only' | 'msal-only'; // Permite elegir el modo de autenticación
}

// Función para verificar si el usuario está autenticado con el sistema tradicional
const isTraditionalAuth = (): boolean => {
  const user = localStorage.getItem("user");
  return !!user;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallbackPath = "/auth/signin",
  requiredRole,
  authMode = 'hybrid' // Por defecto usa modo híbrido
}) => {
  // Hooks de autenticación
  const { isAuthenticated: contextAuth, loading, currentUser } = useAuth();
  const isMicrosoftAuth = useIsAuthenticated();
  const isTraditionalAuthenticated = isTraditionalAuth();

  // Determinar el estado de autenticación según el modo
  let isAuthenticated: boolean;
  
  switch (authMode) {
    case 'context-only':
      isAuthenticated = contextAuth;
      break;
    case 'msal-only':
      isAuthenticated = isMicrosoftAuth;
      break;
    case 'hybrid':
    default:
      // Permitir acceso si está autenticado con cualquiera de los métodos
      isAuthenticated = contextAuth || isMicrosoftAuth || isTraditionalAuthenticated;
      break;
  }

  // Loading state (solo en modo context-only o hybrid cuando hay contexto)
  if (loading && (authMode === 'context-only' || authMode === 'hybrid')) {
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
  // Solo verificar roles si tenemos currentUser (modo context-only o hybrid con contexto)
  if (requiredRole && currentUser && (authMode === 'context-only' || authMode === 'hybrid')) {
    const userRoles = currentUser.roles?.map(role => role.name) || [];
    if (!userRoles.includes(requiredRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Authenticated and authorized - render children or Outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
