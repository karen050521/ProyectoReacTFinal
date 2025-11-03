import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Alert,
    Snackbar,
    CircularProgress,
    Stack,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
    Breadcrumbs,
    Link,
    Avatar,
    Chip,
    Divider,
    Paper
} from '@mui/material';
import {
    PersonAdd as PersonAddIcon,
    Edit as EditIcon,
    AdminPanelSettings as AdminIcon,
    AccessTime as TimeIcon,
    CheckCircle as CheckIcon,
    Home as HomeIcon,
    Save as SaveIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import { useUserRoleController } from '../../../controllers/useUserRoleController';
import type { UserRole } from '../../../models/UserRole';
import type { Role } from '../../../models/Role';

interface User {
    id: number;
    name: string;
    email: string;
}

interface UserRoleFormData {
    userId: number | '';
    roleId: number | '';
    startAt: string;
    endAt?: string;
}

// 🛡️ VALIDACIÓN CON FECHAS (aplicar correcciones CORS)
const validationSchema = Yup.object().shape({
    userId: Yup.number().required('El usuario es obligatorio'),
    roleId: Yup.number().required('El rol es obligatorio'),
    startAt: Yup.string().required('La fecha de inicio es obligatoria'),
    endAt: Yup.string()
        .nullable()
        .test('is-after-start', 'La fecha de fin debe ser posterior a la fecha de inicio', function(value) {
            const { startAt } = this.parent;
            if (!value || !startAt) return true;
            
            const start = new Date(startAt);
            const end = new Date(value);
            
            return end > start;
        })
});

interface UserRoleFormProps {
    isEditMode?: boolean;
}

const UserRoleForm: React.FC<UserRoleFormProps> = ({ isEditMode = false }) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const {
        assignRole,
        updateUserRole,
        getUserRoleById,
        getUsers,
        getRoles,
        loading,
        error,
        clearError
    } = useUserRoleController();

    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    
    // 📊 DATOS AUXILIARES
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loadingData, setLoadingData] = useState<boolean>(true);
    
    const [initialValues, setInitialValues] = useState<UserRoleFormData>({
        userId: '',
        roleId: '',
        startAt: '',
        endAt: ''
    });

    // 🔧 FUNCIÓN PARA FORMATEAR FECHAS AL BACKEND (aplicar correcciones CORS)
    const formatDateForBackend = (dateString: string): string => {
        if (!dateString) return '';
        
        try {
            if (!dateString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
                console.error('Formato de fecha inválido:', dateString);
                return '';
            }
            
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                console.error('Fecha inválida:', dateString);
                return '';
            }
            
            // ✅ CONVERSIÓN PARA BACKEND: T → espacio, agregar :00
            return dateString.replace('T', ' ') + ':00';
        } catch (error) {
            console.error('Error al formatear fecha:', error);
            return '';
        }
    };

    // 🔧 FUNCIÓN PARA FORMATEAR FECHAS DEL SERVIDOR PARA INPUT
    const formatDateForInput = (dateString?: string): string => {
        if (!dateString) return '';
        
        try {
            const cleanDateString = dateString.replace('Z', '').replace('+00:00', '');
            const date = new Date(cleanDateString);
            
            if (isNaN(date.getTime())) return '';
            
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch {
            return '';
        }
    };

    // 📥 CARGAR DATOS AUXILIARES Y DE EDICIÓN
    useEffect(() => {
        loadInitialData();
    }, [isEditMode, id]);

    const loadInitialData = async (): Promise<void> => {
        setLoadingData(true);
        try {
            // Cargar usuarios y roles
            const [usersData, rolesData] = await Promise.all([
                getUsers(),
                getRoles()
            ]);
            
            setUsers(usersData);
            setRoles(rolesData);

            // Si es modo edición, cargar datos del UserRole
            if (isEditMode && id) {
                const userRole = await getUserRoleById(id);
                if (userRole) {
                    setInitialValues({
                        userId: userRole.user_id,
                        roleId: userRole.role_id,
                        startAt: formatDateForInput(userRole.startAt),
                        endAt: formatDateForInput(userRole.endAt || undefined)
                    });
                }
            } else {
                // Valores por defecto para asignación nueva
                const now = new Date();
                const defaultStart = now.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
                setInitialValues(prev => ({
                    ...prev,
                    startAt: defaultStart
                }));
            }
        } catch (err) {
            console.error('Error cargando datos iniciales:', err);
            setSnackbarMessage('Error al cargar datos del formulario');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setLoadingData(false);
        }
    };

    // 📤 ENVÍO DEL FORMULARIO
    const handleSubmit = async (
        values: UserRoleFormData,
        { setSubmitting }: FormikHelpers<UserRoleFormData>
    ): Promise<void> => {
        try {
            // 🛡️ VALIDACIONES DE FECHAS (aplicar correcciones)
            if (values.endAt && values.startAt) {
                const startDate = new Date(values.startAt);
                const endDate = new Date(values.endAt);
                
                if (endDate <= startDate) {
                    setSnackbarMessage('La fecha de fin debe ser posterior a la fecha de inicio');
                    setSnackbarSeverity('error');
                    setSnackbarOpen(true);
                    return;
                }
            }

            // 🔄 FORMATEAR DATOS PARA BACKEND
            const startAtFormatted = formatDateForBackend(values.startAt);
            const endAtFormatted = values.endAt ? formatDateForBackend(values.endAt) : undefined;

            console.log('Datos a enviar al backend:', {
                userId: values.userId,
                roleId: values.roleId,
                startAt: startAtFormatted,
                endAt: endAtFormatted
            });

            let success: boolean;

            if (isEditMode && id) {
                // Actualizar fechas de asignación existente
                const updateData = {
                    startAt: startAtFormatted,
                    endAt: endAtFormatted
                };
                const result = await updateUserRole(id, updateData);
                success = !!result;
                setSnackbarMessage(success ? 'Asignación actualizada exitosamente' : 'Error al actualizar');
            } else {
                // Crear nueva asignación de rol
                const result = await assignRole(
                    Number(values.userId),
                    Number(values.roleId),
                    startAtFormatted,
                    endAtFormatted
                );
                success = !!result;
                setSnackbarMessage(success ? 'Rol asignado exitosamente' : 'Error al asignar rol');
            }

            setSnackbarSeverity(success ? 'success' : 'error');
            setSnackbarOpen(true);

            if (success) {
                setTimeout(() => navigate('/user-roles'), 1500);
            }
        } catch (err) {
            console.error('Error en handleSubmit:', err);
            setSnackbarMessage('Error inesperado al procesar los datos');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setSubmitting(false);
        }
    };

    // 👤 OBTENER NOMBRE DE USUARIO
    const getUserName = (userId: number): string => {
        const user = users.find(u => u.id === userId);
        return user ? user.name : `Usuario ${userId}`;
    };

    // 🎭 OBTENER NOMBRE DE ROL
    const getRoleName = (roleId: number): string => {
        const role = roles.find(r => r.id === roleId);
        return role ? role.name : `Rol ${roleId}`;
    };

    if (loadingData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress size={40} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* 🧭 BREADCRUMBS */}
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link
                    color="inherit"
                    href="#"
                    onClick={() => navigate('/')}
                    sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                >
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
                    Home
                </Link>
                <Link
                    color="inherit"
                    href="#"
                    onClick={() => navigate('/user-roles')}
                    sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                >
                    <AdminIcon sx={{ mr: 0.5 }} fontSize="small" />
                    Asignaciones de Roles
                </Link>
                <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                    {isEditMode ? <EditIcon sx={{ mr: 0.5 }} fontSize="small" /> : <PersonAddIcon sx={{ mr: 0.5 }} fontSize="small" />}
                    {isEditMode ? 'Editar Asignación' : 'Asignar Rol'}
                </Typography>
            </Breadcrumbs>

            {/* 🏠 HEADER */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                    {isEditMode ? 'Editar Fechas de Asignación' : 'Asignar Rol a Usuario'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {isEditMode 
                        ? 'Modifica las fechas de vigencia de la asignación de rol'
                        : 'Asigna un rol específico a un usuario con fechas de vigencia'
                    }
                </Typography>
            </Box>

            {/* 📝 FORMULARIO */}
            <Card>
                <CardContent>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        enableReinitialize
                        onSubmit={handleSubmit}
                    >
                        {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                            <Form>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    
                                    {/* 👥 SELECCIÓN DE USUARIO Y ROL */}
                                    {!isEditMode && (
                                        <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <AdminIcon color="primary" />
                                                Selección de Usuario y Rol
                                            </Typography>
                                            
                                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mt: 2 }}>
                                                {/* Select Usuario */}
                                                <Box sx={{ flex: 1 }}>
                                                    <FormControl fullWidth error={touched.userId && !!errors.userId}>
                                                        <InputLabel>Usuario *</InputLabel>
                                                        <Field name="userId">
                                                            {({ field }: any) => (
                                                                <Select
                                                                    {...field}
                                                                    label="Usuario *"
                                                                    value={field.value || ''}
                                                                    onChange={(e) => setFieldValue('userId', e.target.value)}
                                                                >
                                                                    <MenuItem value="">
                                                                        <em>Selecciona un usuario</em>
                                                                    </MenuItem>
                                                                    {users.map((user) => (
                                                                        <MenuItem key={user.id} value={user.id}>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                                <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                                                                                    {user.name.charAt(0).toUpperCase()}
                                                                                </Avatar>
                                                                                <Box>
                                                                                    <Typography variant="body2">{user.name}</Typography>
                                                                                    <Typography variant="caption" color="text.secondary">
                                                                                        {user.email}
                                                                                    </Typography>
                                                                                </Box>
                                                                            </Box>
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            )}
                                                        </Field>
                                                        {touched.userId && errors.userId && (
                                                            <FormHelperText>{errors.userId}</FormHelperText>
                                                        )}
                                                    </FormControl>
                                                </Box>

                                                {/* Select Rol */}
                                                <Box sx={{ flex: 1 }}>
                                                    <FormControl fullWidth error={touched.roleId && !!errors.roleId}>
                                                        <InputLabel>Rol *</InputLabel>
                                                        <Field name="roleId">
                                                            {({ field }: any) => (
                                                                <Select
                                                                    {...field}
                                                                    label="Rol *"
                                                                    value={field.value || ''}
                                                                    onChange={(e) => setFieldValue('roleId', e.target.value)}
                                                                >
                                                                    <MenuItem value="">
                                                                        <em>Selecciona un rol</em>
                                                                    </MenuItem>
                                                                    {roles.map((role) => (
                                                                        <MenuItem key={role.id} value={role.id}>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                                <AdminIcon color="action" fontSize="small" />
                                                                                <Box>
                                                                                    <Typography variant="body2">{role.name}</Typography>
                                                                                    {role.description && (
                                                                                        <Typography variant="caption" color="text.secondary">
                                                                                            {role.description}
                                                                                        </Typography>
                                                                                    )}
                                                                                </Box>
                                                                            </Box>
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            )}
                                                        </Field>
                                                        {touched.roleId && errors.roleId && (
                                                            <FormHelperText>{errors.roleId}</FormHelperText>
                                                        )}
                                                    </FormControl>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    )}

                                    {/* 📝 PREVIEW DE ASIGNACIÓN (modo edición) */}
                                    {isEditMode && values.userId && values.roleId && (
                                        <Paper sx={{ p: 3, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
                                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <EditIcon color="primary" />
                                                Editando Asignación
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                    {getUserName(Number(values.userId)).charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Typography variant="body1">
                                                    <strong>{getUserName(Number(values.userId))}</strong> tiene el rol de 
                                                    <Chip label={getRoleName(Number(values.roleId))} sx={{ mx: 1 }} size="small" />
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    )}

                                    {/* 📅 FECHAS DE VIGENCIA */}
                                    <Paper sx={{ p: 3 }}>
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <TimeIcon color="secondary" />
                                            Fechas de Vigencia
                                        </Typography>
                                        
                                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mt: 2 }}>
                                            {/* Fecha Inicio */}
                                            <Box sx={{ flex: 1 }}>
                                                <Field name="startAt">
                                                    {({ field }: any) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            label="Fecha de Inicio *"
                                                            type="datetime-local"
                                                            error={touched.startAt && !!errors.startAt}
                                                            helperText={touched.startAt && errors.startAt}
                                                            InputLabelProps={{ shrink: true }}
                                                        />
                                                    )}
                                                </Field>
                                            </Box>

                                            {/* Fecha Fin */}
                                            <Box sx={{ flex: 1 }}>
                                                <Field name="endAt">
                                                    {({ field }: any) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            label="Fecha de Fin (Opcional)"
                                                            type="datetime-local"
                                                            error={touched.endAt && !!errors.endAt}
                                                            helperText={touched.endAt && errors.endAt || 'Dejar vacío para asignación permanente'}
                                                            InputLabelProps={{ shrink: true }}
                                                        />
                                                    )}
                                                </Field>
                                            </Box>
                                        </Box>
                                    </Paper>

                                    {/* 📋 PREVIEW DE ASIGNACIÓN (modo crear) */}
                                    {!isEditMode && values.userId && values.roleId && (
                                        <Paper sx={{ p: 3, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
                                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CheckIcon color="success" />
                                                Vista Previa de Asignación
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                                                <Avatar sx={{ bgcolor: 'success.main' }}>
                                                    {getUserName(Number(values.userId)).charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Typography variant="body1">
                                                    Se asignará el rol de 
                                                    <Chip label={getRoleName(Number(values.roleId))} sx={{ mx: 1 }} size="small" color="success" />
                                                    a <strong>{getUserName(Number(values.userId))}</strong>
                                                </Typography>
                                            </Box>
                                            {values.startAt && (
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                    📅 Vigente desde: {new Date(values.startAt).toLocaleDateString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                    {values.endAt && (
                                                        <> hasta: {new Date(values.endAt).toLocaleDateString('es-ES', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}</>
                                                    )}
                                                </Typography>
                                            )}
                                        </Paper>
                                    )}

                                    <Divider />

                                    {/* 🔘 BOTONES */}
                                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                                        <Button
                                            variant="outlined"
                                            onClick={() => navigate('/user-roles')}
                                            sx={{ textTransform: 'none' }}
                                            startIcon={<CancelIcon />}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={isSubmitting || loading}
                                            sx={{ textTransform: 'none' }}
                                            startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                                        >
                                            {isSubmitting ? 'Procesando...' : (isEditMode ? 'Actualizar Fechas' : 'Asignar Rol')}
                                        </Button>
                                    </Stack>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </CardContent>
            </Card>

            {/* 📢 NOTIFICACIONES */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert severity={snackbarSeverity} variant="filled">
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Snackbar open={!!error} autoHideDuration={6000} onClose={clearError}>
                <Alert onClose={clearError} severity="error" variant="filled">
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UserRoleForm;