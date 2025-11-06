import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { passwordService } from '../../services/passwordService';
import type { Password } from '../../models/Password';

/**
 * Página de debug para verificar el funcionamiento de las APIs de passwords
 */
const PasswordDebugPage: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [allPasswords, setAllPasswords] = useState<Password[]>([]);
    const [userPasswords, setUserPasswords] = useState<Password[]>([]);
    const [error, setError] = useState<string | null>(null);

    const testAllPasswords = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('🧪 Testing getAllPasswords...');
            const passwords = await passwordService.getPasswords();
            console.log('✅ All passwords:', passwords);
            setAllPasswords(passwords);
        } catch (err) {
            console.error('❌ Error getting all passwords:', err);
            setError('Error al obtener todas las contraseñas: ' + err);
        } finally {
            setLoading(false);
        }
    };

    const testUserPasswords = async (userId: number) => {
        setLoading(true);
        setError(null);
        try {
            console.log('🧪 Testing getPasswordsByUserId for user:', userId);
            const passwords = await passwordService.getPasswordsByUserId(userId);
            console.log('✅ User passwords:', passwords);
            
            // 🔍 Debug detallado
            console.log(`📊 Endpoint /passwords/user/${userId} devolvió ${passwords.length} contraseñas:`);
            passwords.forEach((password, index) => {
                console.log(`  ${index + 1}. ID: ${password.id}, user_id: ${password.user_id}, ¿Es del usuario ${userId}? ${password.user_id === userId ? '✅' : '❌'}`);
            });
            
            setUserPasswords(passwords);
        } catch (err) {
            console.error('❌ Error getting user passwords:', err);
            setError('Error al obtener contraseñas del usuario: ' + err);
        } finally {
            setLoading(false);
        }
    };

    const createTestPassword = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('🧪 Creating test password...');
            const newPassword = await passwordService.createPassword(1, {
                content: 'TestPassword123!',
                startAt: '2025-11-05T00:00:00',
                endAt: '2026-02-05T00:00:00'
            });
            console.log('✅ Created password:', newPassword);
            // Refresh the lists
            await testAllPasswords();
            await testUserPasswords(1);
        } catch (err) {
            console.error('❌ Error creating password:', err);
            setError('Error al crear contraseña de prueba: ' + err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        testAllPasswords();
        testUserPasswords(1);
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                🧪 Password API Debug Page
            </Typography>
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button 
                    variant="contained" 
                    onClick={testAllPasswords}
                    disabled={loading}
                >
                    🔄 Test All Passwords
                </Button>
                <Button 
                    variant="contained" 
                    onClick={() => testUserPasswords(1)}
                    disabled={loading}
                >
                    👤 Test User 1
                </Button>
                <Button 
                    variant="contained" 
                    onClick={() => testUserPasswords(2)}
                    disabled={loading}
                >
                    👤 Test User 2
                </Button>
                <Button 
                    variant="contained" 
                    onClick={() => testUserPasswords(3)}
                    disabled={loading}
                >
                    👤 Test User 3
                </Button>
                <Button 
                    variant="outlined" 
                    onClick={createTestPassword}
                    disabled={loading}
                >
                    ➕ Create Test Password
                </Button>
            </Box>

            {loading && <CircularProgress sx={{ mb: 2 }} />}

            <Box sx={{ display: 'flex', gap: 2 }}>
                <Card sx={{ flex: 1 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            📊 All Passwords ({allPasswords.length})
                        </Typography>
                        <Typography variant="body2" component="pre" sx={{ fontSize: '12px', maxHeight: 300, overflow: 'auto' }}>
                            {JSON.stringify(allPasswords, null, 2)}
                        </Typography>
                    </CardContent>
                </Card>

                <Card sx={{ flex: 1 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            👤 User 1 Passwords ({userPasswords.length})
                        </Typography>
                        <Typography variant="body2" component="pre" sx={{ fontSize: '12px', maxHeight: 300, overflow: 'auto' }}>
                            {JSON.stringify(userPasswords, null, 2)}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default PasswordDebugPage;