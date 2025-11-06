import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Alert,
    CircularProgress,
    Chip,
    Divider,
    Stack,
    IconButton,
    Tooltip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Security as SecurityIcon,
    Schedule as ScheduleIcon,
    Person as PersonIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import { usePasswordController } from '../../controllers/usePasswordController';
import { userService } from '../../services/userService';
import type { Password } from '../../models/Password';
import type { User } from '../../models/user';

/**
 * Página para ver los detalles de una contraseña específica
 * Muestra información de metadatos, NO la contraseña original (por seguridad)
 */
const PasswordViewPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getPasswordById, loading, error, clearError } = usePasswordController();
    
    const [password, setPassword] = useState<Password | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [showHash, setShowHash] = useState<boolean>(false);
    const [loadingUser, setLoadingUser] = useState<boolean>(false);

    // Cargar datos de la contraseña y usuario
    useEffect(() => {
        if (id && !isNaN(Number(id))) {
            loadPasswordData();
        }
    }, [id]);

    useEffect(() => {
        if (password?.user_id) {
            loadUserData();
        }
    }, [password]);

    const loadPasswordData = async (): Promise<void> => {
        try {
            const passwordData = await getPasswordById(parseInt(id!));
            if (passwordData) {
                setPassword(passwordData);
            } else {
                // No se encontró la contraseña
                setTimeout(() => navigate('/passwords'), 2000);
            }
        } catch (err) {
            console.error('Error loading password:', err);
        }
    };

    const loadUserData = async (): Promise<void> => {
        if (!password?.user_id) return;
        
        setLoadingUser(true);
        try {
            const userData = await userService.getUserById(password.user_id);
            setUser(userData);
        } catch (err) {
            console.error('Error loading user:', err);
        } finally {
            setLoadingUser(false);
        }
    };

    // Función para formatear fechas
    const formatDate = (dateString?: string): string => {
        if (!dateString) return 'N/A';
        try {
            const cleanDateString = dateString.replace('Z', '').replace(/[+-]\d{2}:\d{2}$/, '');
            const date = new Date(cleanDateString);
            
            if (isNaN(date.getTime())) return 'Fecha inválida';
            
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                weekday: 'long'
            });
        } catch {
            return 'Fecha inválida';
        }
    };

    // Función para determinar el estado de la contraseña
    const getPasswordStatus = (password: Password): { label: string; color: any; description: string } => {
        const now = new Date();
        const endDate = password.endAt ? new Date(password.endAt) : null;
        
        if (endDate && endDate < now) {
            return { 
                label: 'Expirada', 
                color: 'error',
                description: 'Esta contraseña ha expirado y debe ser renovada'
            };
        }
        
        if (endDate) {
            const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            if (daysUntilExpiry <= 7) {
                return { 
                    label: 'Por expirar', 
                    color: 'warning',
                    description: `Expira en ${daysUntilExpiry} día(s)`
                };
            }
        }
        
        return { 
            label: 'Activa', 
            color: 'success',
            description: 'La contraseña está vigente y activa'
        };
    };

    // Función para analizar el hash
    const analyzeHash = (content: string): { type: string; strength: string; info: string } => {
        if (content.startsWith('$2a$') || content.startsWith('$2b$') || content.startsWith('$2y$')) {
            const rounds = content.split('$')[2];
            return {
                type: 'bcrypt',
                strength: parseInt(rounds) >= 12 ? 'Muy alta' : parseInt(rounds) >= 10 ? 'Alta' : 'Media',
                info: `Algoritmo bcrypt con ${rounds} rondas de hashing`
            };
        } else if (content.startsWith('$argon2')) {
            return {
                type: 'Argon2',
                strength: 'Muy alta',
                info: 'Algoritmo Argon2 (recomendado actualmente)'
            };
        } else if (content.startsWith('$scrypt')) {
            return {
                type: 'scrypt',
                strength: 'Alta',
                info: 'Algoritmo scrypt'
            };
        } else if (content.length === 64 && /^[a-f0-9]+$/i.test(content)) {
            return {
                type: 'SHA-256',
                strength: 'Baja',
                info: '⚠️ Hash SHA-256 sin salt (no recomendado)'
            };
        } else if (content.length > 50) {
            return {
                type: 'Hash desconocido',
                strength: 'Desconocida',
                info: 'Tipo de hash no reconocido'
            };
        } else {
            return {
                type: '⚠️ Texto plano',
                strength: 'Ninguna',
                info: '🚨 CRÍTICO: Contraseña sin encriptar'
            };
        }
    };

    // Validación de ID
    if (!id || isNaN(Number(id))) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    ID de contraseña inválido. Por favor, verifique la URL.
                </Alert>
                <Button 
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/passwords')}
                    sx={{ mt: 2 }}
                >
                    Volver a Contraseñas
                </Button>
            </Box>
        );
    }

    // Estado de carga
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    // Error o contraseña no encontrada
    if (error || !password) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    {error || 'Contraseña no encontrada'}
                </Alert>
                <Button 
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/passwords')}
                    sx={{ mt: 2 }}
                >
                    Volver a Contraseñas
                </Button>
            </Box>
        );
    }

    const status = getPasswordStatus(password);
    const hashInfo = analyzeHash(password.content);

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton 
                    onClick={() => navigate('/passwords')}
                    sx={{ mr: 2 }}
                >
                    <ArrowBackIcon />
                </IconButton>
                <SecurityIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Detalles de Contraseña
                </Typography>
            </Box>

            {/* Información Principal */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Contraseña #{password.id}
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                <Chip
                                    label={status.label}
                                    color={status.color}
                                    icon={<ScheduleIcon />}
                                    variant="outlined"
                                />
                                <Chip
                                    label={hashInfo.type}
                                    color="info"
                                    icon={<SecurityIcon />}
                                    variant="outlined"
                                />
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                                {status.description}
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={() => navigate(`/passwords/update/${password.id}`)}
                            sx={{ textTransform: 'none' }}
                        >
                            Editar
                        </Button>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Información Detallada */}
                    <TableContainer component={Paper} elevation={0}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <PersonIcon fontSize="small" />
                                            Usuario Propietario
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {loadingUser ? (
                                            <CircularProgress size={20} />
                                        ) : user ? (
                                            <Box>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {user.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {user.email}
                                                </Typography>
                                            </Box>
                                        ) : (
                                            `Usuario ID: ${password.user_id}`
                                        )}
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <ScheduleIcon fontSize="small" />
                                            Fecha de Inicio
                                        </Box>
                                    </TableCell>
                                    <TableCell>{formatDate(password.startAt)}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <ScheduleIcon fontSize="small" />
                                            Fecha de Expiración
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {password.endAt ? formatDate(password.endAt) : 'Sin expiración'}
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <SecurityIcon fontSize="small" />
                                            Tipo de Encriptación
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2">
                                                {hashInfo.type} - Seguridad: {hashInfo.strength}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {hashInfo.info}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <SecurityIcon fontSize="small" />
                                            Hash de Seguridad
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    fontFamily: 'monospace',
                                                    maxWidth: 300,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}
                                            >
                                                {showHash ? 
                                                    password.content : 
                                                    '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'
                                                }
                                            </Typography>
                                            <Tooltip title={showHash ? "Ocultar hash" : "Mostrar hash (solo para debugging)"}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => setShowHash(!showHash)}
                                                >
                                                    {showHash ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                        <Typography variant="caption" color="text.secondary">
                                            ⚠️ Esta es la versión encriptada. La contraseña original no se puede recuperar.
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                                {password.created_at && (
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Fecha de Creación</TableCell>
                                        <TableCell>{formatDate(password.created_at)}</TableCell>
                                    </TableRow>
                                )}

                                {password.updated_at && (
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Última Modificación</TableCell>
                                        <TableCell>{formatDate(password.updated_at)}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* Información de Seguridad */}
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <InfoIcon color="primary" />
                        <Typography variant="h6">Información de Seguridad</Typography>
                    </Box>
                    
                    <Alert severity="info" sx={{ mb: 2 }}>
                        <Typography variant="body2">
                            <strong>¿Por qué no puedo ver la contraseña original?</strong><br />
                            Por seguridad, las contraseñas se almacenan usando algoritmos de hashing unidireccional. 
                            Esto significa que es matemáticamente imposible recuperar la contraseña original desde el hash.
                        </Typography>
                    </Alert>

                    <Typography variant="body2" color="text.secondary">
                        • <strong>Hash guardado:</strong> Versión irreversible de la contraseña<br />
                        • <strong>Verificación:</strong> Se compara el hash de la entrada con el almacenado<br />
                        • <strong>Seguridad:</strong> Ni siquiera los administradores pueden ver contraseñas originales<br />
                        • <strong>Recuperación:</strong> Solo es posible crear una nueva contraseña
                    </Typography>
                </CardContent>
            </Card>

            {/* Snackbar para errores */}
            {error && (
                <Alert severity="error" sx={{ mt: 2 }} onClose={clearError}>
                    {error}
                </Alert>
            )}
        </Box>
    );
};

export default PasswordViewPage;