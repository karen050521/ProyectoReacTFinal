import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    Chip,
    Tooltip,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    CircularProgress,
    Stack
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Visibility as ViewIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Security as SecurityIcon,
    History as HistoryIcon,
    FilterList as FilterIcon
} from '@mui/icons-material';
import { usePasswordController } from '../../../controllers/usePasswordController';
import { userService } from '../../../services/userService';
import type { Password } from '../../../models/Password';
import type { User } from '../../../models/user';

interface PasswordListProps {
    userId?: number; // Para filtrar por usuario específico
    showUserColumn?: boolean; // Para mostrar/ocultar columna de usuario
}

const PasswordList: React.FC<PasswordListProps> = ({ 
    userId, 
    showUserColumn = true 
}) => {
    const navigate = useNavigate();
    const {
        passwords,
        loading,
        error,
        deletePassword,
        getPasswordsByUserId,
        refreshPasswords,
        clearError
    } = usePasswordController();

    // Estados locales
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [selectedPassword, setSelectedPassword] = useState<Password | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [filterUserId, setFilterUserId] = useState<number | ''>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
    const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(new Set());

    // Cargar contraseñas según el filtro de usuario
    useEffect(() => {
        if (userId) {
            getPasswordsByUserId(userId);
        } else {
            refreshPasswords();
        }
    }, [userId]);

    // Cargar usuarios para el filtro dropdown
    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async (): Promise<void> => {
        setLoadingUsers(true);
        try {
            const usersData = await userService.getUsers();
            setUsers(usersData);
        } catch (err) {
            console.error('Error loading users:', err);
        } finally {
            setLoadingUsers(false);
        }
    };

    // Función para manejar eliminación
    const handleDelete = async (password: Password): Promise<void> => {
        setSelectedPassword(password);
        setDeleteDialogOpen(true);
    };

    // Confirmar eliminación
    const confirmDelete = async (): Promise<void> => {
        if (!selectedPassword?.id) return;

        try {
            const success = await deletePassword(selectedPassword.id);
            if (success) {
                setSnackbarMessage('Contraseña eliminada exitosamente');
                setSnackbarSeverity('success');
            } else {
                setSnackbarMessage('Error al eliminar la contraseña');
                setSnackbarSeverity('error');
            }
        } catch (err) {
            setSnackbarMessage('Error al eliminar la contraseña');
            setSnackbarSeverity('error');
        }

        setDeleteDialogOpen(false);
        setSelectedPassword(null);
        setSnackbarOpen(true);
    };

    // Filtrar contraseñas por usuario y término de búsqueda
    const filteredPasswords = passwords.filter((password) => {
        // 🔧 FILTRO ADICIONAL: Si estamos en modo userId específico, filtrar también en frontend
        let matchesUserId = true;
        if (userId) {
            matchesUserId = password.user_id === userId;
        }
        
        const matchesUser = filterUserId === '' || password.user_id === filterUserId;
        const matchesSearch = searchTerm === '' || 
            password.content.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesUserId && matchesUser && matchesSearch;
    });

    // Función para formatear fechas
    const formatDate = (dateString?: string): string => {
        if (!dateString) return 'N/A';
        try {
            // Método más robusto para manejar fechas del servidor
            // Remover 'Z' y cualquier indicador de zona horaria
            const cleanDateString = dateString.replace('Z', '').replace(/[+-]\d{2}:\d{2}$/, '');
            
            // Crear fecha interpretándola como local
            const date = new Date(cleanDateString);
            
            // Verificar si la fecha es válida
            if (isNaN(date.getTime())) {
                return 'Fecha inválida';
            }
            
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Fecha inválida';
        }
    };

    // Función para determinar el estado de la contraseña
    const getPasswordStatus = (password: Password): { label: string; color: any } => {
        const now = new Date();
        const endDate = password.endAt ? new Date(password.endAt) : null;
        
        if (endDate && endDate < now) {
            return { label: 'Expirada', color: 'error' };
        }
        
        if (endDate) {
            const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            if (daysUntilExpiry <= 7) {
                return { label: 'Por expirar', color: 'warning' };
            }
        }
        
        return { label: 'Activa', color: 'success' };
    };

    // Función para obtener nombre de usuario
    const getUserName = (userId: number): string => {
        const user = users.find(u => u.id === userId);
        return user ? `${user.name}` : `Usuario ${userId}`;
    };

    // 🔐 Función para mostrar contraseña de forma segura
    const formatPasswordDisplay = (content: string): string => {
        // Detectar si es un hash (bcrypt, scrypt, etc.)
        const isHash = content.startsWith('$') || content.length > 50;
        
        if (isHash) {
            // Si es hash, mostrar puntos fijos
            return "••••••••••••";
        } else {
            // Si es texto plano (no debería pasar en producción), enmascarar
            return "•".repeat(Math.min(content.length, 12));
        }
    };

    // 👁️ Función para toggle visibilidad de contraseña
    const togglePasswordVisibility = (passwordId: number): void => {
        setVisiblePasswords(prev => {
            const newSet = new Set(prev);
            if (newSet.has(passwordId)) {
                newSet.delete(passwordId);
            } else {
                newSet.add(passwordId);
            }
            return newSet;
        });
    };

    // 🔍 Función para mostrar contenido de contraseña (con toggle)
    const renderPasswordContent = (password: Password): React.ReactNode => {
        const isVisible = visiblePasswords.has(password.id!);
        const isHash = password.content.startsWith('$') || password.content.length > 50;
        
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" noWrap sx={{ maxWidth: 150, fontFamily: 'monospace' }}>
                    {isVisible ? 
                        (isHash ? 'Hash: ' + password.content.substring(0, 20) + '...' : password.content) 
                        : formatPasswordDisplay(password.content)
                    }
                </Typography>
                <Tooltip title={isVisible ? "Ocultar" : "Mostrar"}>
                    <IconButton
                        size="small"
                        onClick={() => togglePasswordVisibility(password.id!)}
                        sx={{ ml: 1 }}
                    >
                        {isVisible ? 
                            <VisibilityOffIcon fontSize="small" /> : 
                            <VisibilityIcon fontSize="small" />
                        }
                    </IconButton>
                </Tooltip>
            </Box>
        );
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <SecurityIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                    <Typography variant="h4" component="h1" fontWeight="bold">
                        {userId ? 'Historial de Contraseñas' : 'Gestión de Contraseñas'}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/passwords/create')}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        px: 3
                    }}
                >
                    Nueva Contraseña
                </Button>
            </Box>

            {/* Filtros */}
            {!userId && (
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: { xs: 'column', sm: 'row' }, 
                            gap: 2, 
                            alignItems: { xs: 'stretch', sm: 'center' } 
                        }}>
                            <Box sx={{ flex: { xs: 1, sm: 1 } }}>
                                <TextField
                                    fullWidth
                                    label="Buscar por contenido"
                                    variant="outlined"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    size="small"
                                />
                            </Box>
                            <Box sx={{ flex: { xs: 1, sm: 1 } }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Filtrar por Usuario</InputLabel>
                                    <Select
                                        value={filterUserId}
                                        label="Filtrar por Usuario"
                                        onChange={(e) => setFilterUserId(e.target.value)}
                                    >
                                        <MenuItem value="">
                                            {loadingUsers ? 'Cargando usuarios...' : 'Todos los usuarios'}
                                        </MenuItem>
                                        {users.map((user) => (
                                            <MenuItem key={user.id} value={user.id}>
                                                {user.name} ({user.email})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box sx={{ flex: { xs: 1, sm: 0 }, minWidth: { sm: 'auto' } }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<FilterIcon />}
                                    onClick={refreshPasswords}
                                    sx={{ textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}
                                >
                                    Refrescar
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Tabla de Contraseñas */}
            <Card>
                <CardContent>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : filteredPasswords.length === 0 ? (
                        <Box sx={{ textAlign: 'center', p: 4 }}>
                            <HistoryIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No hay contraseñas registradas
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                {userId 
                                    ? 'Este usuario no tiene historial de contraseñas.'
                                    : 'Comienza creando tu primera contraseña.'
                                }
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => navigate('/passwords/create')}
                                sx={{ textTransform: 'none' }}
                            >
                                Crear Primera Contraseña
                            </Button>
                        </Box>
                    ) : (
                        <TableContainer component={Paper} elevation={0}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                        {showUserColumn && (
                                            <TableCell sx={{ fontWeight: 'bold' }}>Usuario</TableCell>
                                        )}
                                        <TableCell sx={{ fontWeight: 'bold' }}>Contenido</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Fecha Inicio</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Fecha Fin</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredPasswords.map((password) => {
                                        const status = getPasswordStatus(password);
                                        return (
                                            <TableRow 
                                                key={password.id} 
                                                hover
                                                sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                                            >
                                                <TableCell>{password.id}</TableCell>
                                                {showUserColumn && (
                                                    <TableCell>
                                                        <Chip
                                                            label={getUserName(password.user_id)}
                                                            variant="outlined"
                                                            size="small"
                                                            color="primary"
                                                        />
                                                    </TableCell>
                                                )}
                                                <TableCell>
                                                    {renderPasswordContent(password)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(password.startAt)}
                                                </TableCell>
                                                <TableCell>
                                                    {password.endAt ? formatDate(password.endAt) : 'Sin expiración'}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={status.label}
                                                        color={status.color}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Stack direction="row" spacing={1}>
                                                        <Tooltip title="Ver detalles">
                                                            <IconButton
                                                                size="small"
                                                                color="info"
                                                                onClick={() => navigate(`/passwords/view/${password.id}`)}
                                                            >
                                                                <ViewIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Editar">
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => navigate(`/passwords/update/${password.id}`)}
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Eliminar">
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleDelete(password)}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>

            {/* Dialog de Confirmación de Eliminación */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DeleteIcon color="error" />
                    Confirmar Eliminación
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Estás seguro de que deseas eliminar esta contraseña?
                    </Typography>
                    {selectedPassword && (
                        <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                <strong>ID:</strong> {selectedPassword.id}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Usuario:</strong> {getUserName(selectedPassword.user_id)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Fecha creación:</strong> {formatDate(selectedPassword.created_at)}
                            </Typography>
                        </Box>
                    )}
                    <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                        Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} sx={{ textTransform: 'none' }}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={confirmDelete}
                        color="error"
                        variant="contained"
                        sx={{ textTransform: 'none' }}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar para notificaciones */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    variant="filled"
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* Snackbar para errores del controller */}
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={clearError}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={clearError}
                    severity="error"
                    variant="filled"
                >
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PasswordList;