import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Alert } from '@mui/material';
import PasswordList from '../../views/MaterialUI/PasswordViews/PasswordList';

/**
 * Página para mostrar las contraseñas de un usuario específico
 * Accesible desde /passwords/user/:userId
 */
const UserPasswordPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    
    // Validar que se recibió el userId
    if (!userId || isNaN(Number(userId))) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    ID de usuario inválido. Por favor, verifique la URL.
                </Alert>
            </Box>
        );
    }

    const userIdNumber = parseInt(userId);

    return (
        <Box>
            {/* Componente reutilizable PasswordList con filtro de usuario */}
            <PasswordList 
                userId={userIdNumber}
                showUserColumn={false} // No mostrar columna de usuario ya que es específico
            />
        </Box>
    );
};

export default UserPasswordPage;