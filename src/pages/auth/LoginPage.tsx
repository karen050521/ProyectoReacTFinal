// src/pages/auth/LoginPage.tsx
// Single Responsibility: Solo maneja UI de login

import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Alert,
  CircularProgress,
  Container 
} from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

const LoginPage: React.FC = () => {
  const { signIn, isAuthenticated, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setIsSigningIn(true);
      await signIn();
    } catch (error: any) {
      setError(error.message || "Error al iniciar sesión");
      console.error("Login error:", error);
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        py={4}
      >
        <Card sx={{ width: "100%", maxWidth: 400 }}>
          <CardContent sx={{ p: 4 }}>
            <Box textAlign="center" mb={3}>
              <Typography variant="h4" component="h1" gutterBottom>
                Bienvenido
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sistema de Gestión - Color Amarillo
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={
                isSigningIn ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <GoogleIcon />
                )
              }
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              sx={{ 
                py: 1.5,
                backgroundColor: "#4285f4",
                "&:hover": {
                  backgroundColor: "#3367d6",
                }
              }}
            >
              {isSigningIn ? "Iniciando sesión..." : "Continuar con Google"}
            </Button>

            <Typography 
              variant="caption" 
              color="text.secondary" 
              display="block" 
              textAlign="center" 
              mt={2}
            >
              Accede con tu cuenta de Google para gestionar Address, Password, Role y UserRole
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default LoginPage;