// src/components/Auth/FirebaseStatus.tsx
// Componente de prueba para verificar estado de Firebase

import React from 'react';
import { Box, Card, CardContent, Typography, Chip, Alert } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { isFirebaseConfigured } from '../../config/firebase.config';

export const FirebaseStatus: React.FC = () => {
  const { currentUser, loading, isAuthenticated } = useAuth();
  const firebaseConfigured = isFirebaseConfigured();

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🔥 Firebase Authentication Status
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Firebase Configuration:
          </Typography>
          <Chip 
            label={firebaseConfigured ? "✅ Configured" : "⚠️ Development Mode"} 
            color={firebaseConfigured ? "success" : "warning"}
            size="small"
            sx={{ mt: 1 }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Authentication Status:
          </Typography>
          <Chip 
            label={loading ? "⏳ Loading..." : isAuthenticated ? "✅ Authenticated" : "❌ Not Authenticated"} 
            color={isAuthenticated ? "success" : "default"}
            size="small"
            sx={{ mt: 1 }}
          />
        </Box>

        {currentUser && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Current User:
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              • Name: {currentUser.name}
            </Typography>
            <Typography variant="body2">
              • Email: {currentUser.email}
            </Typography>
            <Typography variant="body2">
              • Provider: {currentUser.provider}
            </Typography>
          </Box>
        )}

        {!firebaseConfigured && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              🔧 Para habilitar Google OAuth real:
              <br />
              1. Configura Firebase en <code>src/config/firebase.config.ts</code>
              <br />
              2. Ve a <code>FIREBASE_SETUP.md</code> para instrucciones detalladas
            </Typography>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};