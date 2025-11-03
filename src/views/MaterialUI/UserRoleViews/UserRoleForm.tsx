import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Paper,
    Divider,
    Stack,
    Chip
} from '@mui/material';
import {
    Save as SaveIcon,
    Cancel as CancelIcon,
    Group as GroupIcon,
    Person as PersonIcon,
    Schedule as ScheduleIcon,
    Event as EventIcon
} from '@mui/icons-material';
import { useUserRoleController } from '../../../controllers/useUserRoleController';
import UserSelect from '../../../components/common/UserSelect';
import RoleSelect from '../../../components/common/RoleSelect';
import Notification from '../../../components/common/Notification';
import type { UserRole } from '../../../models/UserRole';
import Breadcrumb from '../../../components/Breadcrumb';

interface UserRoleFormData {
    user_id: number | '';
    role_id: number | '';
    startAt: string;
    endAt: string;
}

// 🎯 ESQUEMA DE VALIDACIÓN
const validationSchema = Yup.object().shape({
    user_id: Yup.number()
        .required('El usuario es obligatorio')
        .positive('Debe seleccionar un usuario válido'),
    role_id: Yup.number()
        .required('El rol es obligatorio')
        .positive('Debe seleccionar un rol válido'),
    startAt: Yup.string()
        .required('La fecha de inicio es obligatoria'),
    endAt: Yup.string()
        .nullable()
        .test('is-after-start', 'La fecha de expiración debe ser posterior a la fecha de inicio', function(value) {
            const { startAt } = this.parent;
            if (!value || !startAt) return true; // Si no hay endAt o startAt, no validar
            
            const startDate = new Date(startAt);
            const endDate = new Date(value);
            
            return endDate > startDate;
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
        removeRole, // 🔧 Agregamos removeRole para el workaround
        error,
        clearError
    } = useUserRoleController();

    // 🎛️ ESTADOS LOCALES
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [initialLoading, setInitialLoading] = useState<boolean>(isEditMode);
    const [initialValues, setInitialValues] = useState<UserRoleFormData>(() => {
        // Valores por defecto para creación
        const now = new Date();
        const defaultStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        return {
            user_id: '',
            role_id: '',
            startAt: defaultStart,
            endAt: ''
        };
    });
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'warning' | 'info';
    }>({ open: false, message: '', severity: 'success' });

    // 📥 CARGAR DATOS EN MODO EDICIÓN
    useEffect(() => {
        if (isEditMode && id) {
            loadUserRole();
        }
    }, [isEditMode, id]);

    const loadUserRole = async () => {
        if (!id) return;
        
        setInitialLoading(true);
        try {
            const data = await getUserRoleById(id);
            if (data) {
                console.log('🔄 loadUserRole: UserRole data =', data);
                setUserRole(data);
                
                // 🔧 ACTUALIZAR initialValues como en Password
                const formattedStartAt = formatDateForInput(data.startAt);
                const formattedEndAt = formatDateForInput(data.endAt || undefined) || '';
                
                console.log('🔄 loadUserRole: Updating initialValues =', {
                    user_id: data.user_id,
                    role_id: data.role_id,
                    startAt: formattedStartAt,
                    endAt: formattedEndAt
                });
                
                setInitialValues({
                    user_id: data.user_id,
                    role_id: data.role_id,
                    startAt: formattedStartAt,
                    endAt: formattedEndAt
                });
            } else {
                setSnackbar({
                    open: true,
                    message: 'No se encontró la asignación de rol',
                    severity: 'error'
                });
                navigate('/user-roles');
            }
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Error al cargar la asignación de rol',
                severity: 'error'
            });
        } finally {
            setInitialLoading(false);
        }
    };

    // 📅 Formatear fechas para input datetime-local
    const formatDateForInput = (dateString?: string): string => {
        if (!dateString) return '';
        
        try {
            const cleanDateString = dateString
                .replace('Z', '')
                .replace(/[+-]\d{2}:\d{2}$/, '');
            
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

    // 💾 MANEJAR ENVÍO DEL FORMULARIO
    const handleSubmit = async (
        values: UserRoleFormData,
        { setSubmitting, setFieldError }: FormikHelpers<UserRoleFormData>
    ) => {
        try {
            // 🔧 SOLUCIÓN DEFINITIVA: Usar el formato EXACTO que funciona en CREATE
            const formatDateForBackend = (dateString: string): string => {
                if (!dateString) return '';
                
                try {
                    const date = new Date(dateString);
                    if (isNaN(date.getTime())) {
                        console.error('Fecha inválida:', dateString);
                        return '';
                    }
                    
                    // Usar el MISMO formato que el CREATE parsea exitosamente: "%Y-%m-%d %H:%M:%S"
                    const formatted = date.toISOString().slice(0, 19).replace('T', ' ');
                    console.log(`📅 Backend format: ${dateString} → ${formatted}`);
                    return formatted;
                } catch (error) {
                    console.error('Error al formatear fecha:', error);
                    return '';
                }
            };

            // 🔧 Para UPDATE: Enviar solo fechas (como funciona en CREATE)
            // Para CREATE: Enviar datos completos  
            let payload: any;
            
            if (isEditMode) {
                // Solo fechas para UPDATE
                payload = {
                    startAt: formatDateForBackend(values.startAt),
                    endAt: values.endAt && values.endAt.trim() !== '' ? formatDateForBackend(values.endAt) : undefined // 🔧 Fix: solo enviar endAt si hay valor
                };
            } else {
                // Datos completos para CREATE
                payload = {
                    user_id: Number(values.user_id),
                    role_id: Number(values.role_id),
                    startAt: formatDateForBackend(values.startAt),
                    endAt: values.endAt && values.endAt.trim() !== '' ? formatDateForBackend(values.endAt) : undefined // 🔧 Fix: solo enviar endAt si hay valor
                };
            }

            console.log('📝 Form payload antes del envío:', payload);
            console.log('🔄 Fechas convertidas para SQLite:', {
                original_startAt: values.startAt,
                converted_startAt: payload.startAt,
                original_endAt: values.endAt,
                converted_endAt: payload.endAt
            });

            let success = false;
            let message = '';

            if (isEditMode && userRole?.id) {
                console.log('🔄 UPDATE mode - UserRole ID:', userRole.id, 'Payload:', payload);
                
                // 🔧 WORKAROUND: El backend UPDATE no convierte fechas correctamente
                // Implementamos UPDATE como DELETE + CREATE para que use la lógica que SÍ funciona
                console.log('⚠️ Usando workaround: UPDATE simulado con DELETE + CREATE');
                
                try {
                    // Paso 1: Eliminar el UserRole existente
                    console.log('🗑️ Eliminando UserRole existente...');
                    await removeRole(userRole.id);
                    
                    // Paso 2: Crear nuevo UserRole con datos actualizados
                    console.log('➕ Creando nuevo UserRole con datos actualizados...');
                    const createPayload = {
                        user_id: userRole.user_id, // Mantener user_id original
                        role_id: userRole.role_id, // Mantener role_id original  
                        startAt: formatDateForBackend(values.startAt),
                        endAt: values.endAt && values.endAt.trim() !== '' ? formatDateForBackend(values.endAt) : undefined // 🔧 Fix: solo enviar endAt si hay valor
                    };
                    
                    console.log('📦 CreatePayload final:', createPayload);
                    
                    const result = await assignRole(
                        createPayload.user_id,
                        createPayload.role_id,
                        createPayload.startAt,
                        createPayload.endAt
                    );
                    
                    success = !!result;
                    message = success ? 'Asignación actualizada exitosamente (recreada)' : 'Error al actualizar la asignación';
                    
                    // 🔍 Debug: Verificar datos del resultado
                    if (result) {
                        console.log('🎯 Nuevo UserRole creado:', result);
                        console.log('📅 Fechas en el resultado:', {
                            startAt: result.startAt,
                            endAt: result.endAt
                        });
                        
                        // 🔧 ACTUALIZAR userRole Y initialValues para reflejar cambios
                        const updatedUserRole = {
                            ...userRole,
                            ...result,
                            startAt: result.startAt,
                            endAt: result.endAt
                        };
                        
                        setUserRole(updatedUserRole);
                        
                        // 🎯 CLAVE: Actualizar initialValues para que Formik se reinicialice
                        const newInitialValues = {
                            user_id: updatedUserRole.user_id,
                            role_id: updatedUserRole.role_id,
                            startAt: formatDateForInput(updatedUserRole.startAt),
                            endAt: formatDateForInput(updatedUserRole.endAt || undefined) || ''
                        };
                        
                        console.log('🔄 Actualizando initialValues después de UPDATE:', newInitialValues);
                        setInitialValues(newInitialValues);
                    }
                } catch (deleteError) {
                    console.error('Error en UPDATE simulado:', deleteError);
                    throw new Error('Error al actualizar: no se pudo eliminar la asignación existente');
                }
            } else {
                console.log('➕ CREATE mode - Payload:', payload);
                const result = await assignRole(
                    payload.user_id,
                    payload.role_id, 
                    payload.startAt,
                    payload.endAt
                );
                success = !!result;
                message = success ? 'Rol asignado exitosamente' : 'Error al asignar el rol';
            }

            if (success) {
                setSnackbar({
                    open: true,
                    message,
                    severity: 'success'
                });
                
                // Navegar de vuelta después de un breve delay
                setTimeout(() => {
                    navigate('/user-roles');
                }, 1500);
            } else {
                setSnackbar({
                    open: true,
                    message,
                    severity: 'error'
                });
            }
        } catch (err: any) {
            console.error('Error en submit:', err);
            
            // Manejar errores específicos
            if (err.response?.data?.message?.includes('ya existe')) {
                setFieldError('user_id', 'Este usuario ya tiene asignado este rol');
                setFieldError('role_id', 'Este rol ya está asignado a este usuario');
            }
            
            setSnackbar({
                open: true,
                message: err.response?.data?.message || 'Error al procesar la solicitud',
                severity: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    };

    // 🚫 CANCELAR Y VOLVER
    const handleCancel = () => {
        navigate('/user-roles');
    };

    // 📊 OBTENER DURACIÓN DE LA ASIGNACIÓN
    const getAssignmentDuration = (startAt: string, endAt: string): string => {
        if (!startAt) return '';
        
        const start = new Date(startAt);
        const end = endAt ? new Date(endAt) : null;
        
        if (!end) return 'Sin fecha de expiración';
        
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return '1 día';
        if (diffDays < 30) return `${diffDays} días`;
        if (diffDays < 365) return `${Math.round(diffDays / 30)} meses aproximadamente`;
        
        return `${Math.round(diffDays / 365)} años aproximadamente`;
    };

    // 🔄 LOADING INICIAL
    if (initialLoading) {
        return (
            <Box sx={{ p: 3 }}>
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                            <Stack spacing={2} alignItems="center">
                                <CircularProgress size={40} />
                                <Typography variant="body1" color="text.secondary">
                                    Cargando asignación de rol...
                                </Typography>
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* 🍞 BREADCRUMB */}
            <Breadcrumb
                pageName={isEditMode ? 'Editar Asignación de Rol' : 'Asignar Rol'}
            />

            {/* 🏠 HEADER */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <GroupIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                <Typography variant="h4" component="h1" fontWeight="bold">
                    {isEditMode ? 'Editar Asignación de Rol' : 'Asignar Rol a Usuario'}
                </Typography>
            </Box>

            {/* 📝 FORMULARIO */}
            <Card>
                <CardContent>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize={true}
                    >
                        {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                            <Form>
                                <Stack spacing={3}>
                                    {/* 👥 SECCIÓN: SELECCIÓN DE USUARIO Y ROL */}
                                    <Paper elevation={1} sx={{ p: 3 }}>
                                        <Typography 
                                            variant="h6" 
                                            gutterBottom 
                                            sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}
                                        >
                                            <PersonIcon color="primary" />
                                            Selección de Usuario y Rol
                                        </Typography>

                                        <Stack spacing={3}>
                                            {/* 👤 Usuario */}
                                            <UserSelect
                                                value={values.user_id}
                                                onChange={(value) => setFieldValue('user_id', value)}
                                                label="Usuario *"
                                                error={touched.user_id && !!errors.user_id}
                                                helperText={touched.user_id ? errors.user_id : undefined}
                                                disabled={isEditMode} // ❌ No permitir cambiar usuario en edición (limitación del backend)
                                                placeholder="Selecciona un usuario"
                                            />

                                            {/* 🎭 Rol */}
                                            <RoleSelect
                                                value={values.role_id}
                                                onChange={(value) => setFieldValue('role_id', value)}
                                                label="Rol *"
                                                error={touched.role_id && !!errors.role_id}
                                                helperText={touched.role_id ? errors.role_id : undefined}
                                                disabled={isEditMode} // ❌ No permitir cambiar rol en edición (limitación del backend)
                                                placeholder="Selecciona un rol"
                                            />

                                            {isEditMode && (
                                                <Alert severity="info" sx={{ mt: 2 }}>
                                                    <strong>Modo edición:</strong> Solo puedes modificar las fechas (startAt y endAt). 
                                                    Para cambiar usuario o rol, elimina esta asignación y crea una nueva.
                                                </Alert>
                                            )}
                                        </Stack>
                                    </Paper>

                                    {/* 📅 SECCIÓN: FECHAS */}
                                    <Paper elevation={1} sx={{ p: 3 }}>
                                        <Typography 
                                            variant="h6" 
                                            gutterBottom 
                                            sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}
                                        >
                                            <ScheduleIcon color="primary" />
                                            Período de Vigencia
                                        </Typography>

                                        <Stack spacing={3}>
                                            {/* 📅 Fecha Inicio */}
                                            <TextField
                                                fullWidth
                                                type="datetime-local"
                                                label="Fecha de Inicio"
                                                value={values.startAt}
                                                onChange={(e) => setFieldValue('startAt', e.target.value)}
                                                error={touched.startAt && !!errors.startAt}
                                                helperText={touched.startAt && errors.startAt}
                                                required
                                                InputLabelProps={{ shrink: true }}
                                                InputProps={{
                                                    startAdornment: <EventIcon sx={{ mr: 1, color: 'action.active' }} />
                                                }}
                                            />

                                            {/* 📅 Fecha Fin */}
                                            <TextField
                                                fullWidth
                                                type="datetime-local"
                                                label="Fecha de Expiración (Opcional)"
                                                value={values.endAt}
                                                onChange={(e) => setFieldValue('endAt', e.target.value)}
                                                error={touched.endAt && !!errors.endAt}
                                                helperText={touched.endAt && errors.endAt || 'Deja vacío para asignación permanente'}
                                                InputLabelProps={{ shrink: true }}
                                                InputProps={{
                                                    startAdornment: <EventIcon sx={{ mr: 1, color: 'action.active' }} />
                                                }}
                                            />

                                            {/* 📊 Duración de la asignación */}
                                            {values.startAt && (
                                                <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                                        <strong>Duración de la asignación:</strong>
                                                    </Typography>
                                                    <Chip 
                                                        label={getAssignmentDuration(values.startAt, values.endAt)}
                                                        color={values.endAt ? 'primary' : 'success'}
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                </Box>
                                            )}
                                        </Stack>
                                    </Paper>

                                    <Divider />

                                    {/* 🚀 BOTONES DE ACCIÓN */}
                                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                                        <Button
                                            variant="outlined"
                                            startIcon={<CancelIcon />}
                                            onClick={handleCancel}
                                            disabled={isSubmitting}
                                            size="large"
                                        >
                                            Cancelar
                                        </Button>
                                        
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            startIcon={<SaveIcon />}
                                            disabled={isSubmitting}
                                            size="large"
                                            sx={{ minWidth: 140 }}
                                        >
                                            {isSubmitting ? (
                                                <CircularProgress size={20} color="inherit" />
                                            ) : (
                                                isEditMode ? 'Actualizar' : 'Asignar Rol'
                                            )}
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Form>
                        )}
                    </Formik>
                </CardContent>
            </Card>

            {/* 📢 NOTIFICACIONES */}
            <Notification
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />

            <Notification
                open={!!error}
                message={error || ''}
                severity="error"
                onClose={clearError}
            />
        </Box>
    );
};

export default UserRoleForm;
