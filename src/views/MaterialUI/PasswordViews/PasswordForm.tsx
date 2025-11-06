import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { formatDateForInput, formatDateForBackend } from '../../../utils/dateUtils';
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
    Paper,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment,
    IconButton,
    LinearProgress,
    Chip,
    Stack
} from '@mui/material';
import {
    Save as SaveIcon,
    Cancel as CancelIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Security as SecurityIcon,
    Person as PersonIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as ErrorIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import { usePasswordController } from '../../../controllers/usePasswordController';
import { userService } from '../../../services/userService';
import type { User } from '../../../models/user';
import Breadcrumb from '../../../components/Breadcrumb';

interface PasswordFormData {
    user_id: number | '';
    content: string;
    startAt: string;
    endAt: string;
}

interface PasswordStrengthResult {
    score: number;
    label: string;
    color: 'error' | 'warning' | 'info' | 'success';
    suggestions: string[];
}

// Esquema de validación con Yup
const validationSchema = Yup.object().shape({
    user_id: Yup.number()
        .required('El usuario es obligatorio')
        .positive('Debe seleccionar un usuario válido'),
    content: Yup.string()
        .required('La contraseña es obligatoria')
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(128, 'La contraseña no puede exceder 128 caracteres')
        .matches(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
        .matches(/[a-z]/, 'Debe contener al menos una letra minúscula')
        .matches(/[0-9]/, 'Debe contener al menos un número')
        .matches(/[!@#$%^&*(),.?\":{}|<>]/, 'Debe contener al menos un carácter especial'),
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

interface PasswordFormProps {
    isEditMode?: boolean;
}

const PasswordForm: React.FC<PasswordFormProps> = ({ isEditMode = false }) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const {
        createPassword,
        updatePassword,
        getPasswordById,
        loading,
        error,
        clearError
    } = usePasswordController();

    // Estados locales
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [initialValues, setInitialValues] = useState<PasswordFormData>({
        user_id: '',
        content: '',
        startAt: new Date().toISOString().slice(0, 16),
        endAt: ''
    });
    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState<boolean>(false);

    // Cargar datos para edición
    useEffect(() => {
        if (isEditMode && id) {
            loadPasswordData();
        }
        // Cargar usuarios al montar el componente
        loadUsers();
    }, [isEditMode, id]);

    const loadUsers = async (): Promise<void> => {
        setLoadingUsers(true);
        try {
            const usersData = await userService.getUsers();
            setUsers(usersData);
        } catch (err) {
            console.error('Error loading users:', err);
            setSnackbarMessage('Error al cargar usuarios');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setLoadingUsers(false);
        }
    };

    const loadPasswordData = async (): Promise<void> => {
        if (!id) return;

        try {
            const password = await getPasswordById(parseInt(id));
            if (password) {
                setInitialValues({
                    user_id: password.user_id,
                    content: '', // ✅ NO mostrar hash en edición - campo vacío para nueva contraseña
                    startAt: formatDateForInput(password.startAt) || new Date().toISOString().slice(0, 16),
                    endAt: formatDateForInput(password.endAt || undefined)
                });
            } else {
                setSnackbarMessage('Contraseña no encontrada');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                setTimeout(() => navigate('/passwords'), 2000);
            }
        } catch (err) {
            setSnackbarMessage('Error al cargar los datos de la contraseña');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    // Función para evaluar la fortaleza de la contraseña
    const evaluatePasswordStrength = (password: string): PasswordStrengthResult => {
        let score = 0;
        const suggestions: string[] = [];

        // Criterios de evaluación
        if (password.length >= 8) score += 1;
        else suggestions.push('Usar al menos 8 caracteres');

        if (password.length >= 12) score += 1;
        else if (password.length >= 8) suggestions.push('Considerar usar 12+ caracteres para mayor seguridad');

        if (/[A-Z]/.test(password)) score += 1;
        else suggestions.push('Incluir letras mayúsculas');

        if (/[a-z]/.test(password)) score += 1;
        else suggestions.push('Incluir letras minúsculas');

        if (/[0-9]/.test(password)) score += 1;
        else suggestions.push('Incluir números');

        if (/[!@#$%^&*(),.?\":{}|<>]/.test(password)) score += 1;
        else suggestions.push('Incluir caracteres especiales (!@#$%^&*)');

        // Penalizar patrones comunes
        if (/(.)\1{2,}/.test(password)) {
            score -= 1;
            suggestions.push('Evitar repetir el mismo carácter consecutivamente');
        }

        if (/123|abc|qwe/i.test(password)) {
            score -= 1;
            suggestions.push('Evitar secuencias obvias (123, abc, qwe)');
        }

        // Determinar resultado
        let label: string;
        let color: 'error' | 'warning' | 'info' | 'success';

        if (score <= 2) {
            label = 'Muy débil';
            color = 'error';
        } else if (score <= 3) {
            label = 'Débil';
            color = 'warning';
        } else if (score <= 4) {
            label = 'Moderada';
            color = 'info';
        } else {
            label = 'Fuerte';
            color = 'success';
        }

        return { score: Math.max(0, score), label, color, suggestions };
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (
        values: PasswordFormData,
        { setSubmitting }: FormikHelpers<PasswordFormData>
    ): Promise<void> => {
        try {
            // Validaciones de fechas
            if (!values.startAt) {
                setSnackbarMessage('La fecha de inicio es obligatoria');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }

            // Validar que endAt sea posterior a startAt si se proporciona
            if (values.endAt && values.startAt) {
                const startDate = new Date(values.startAt);
                const endDate = new Date(values.endAt);
                
                if (endDate <= startDate) {
                    setSnackbarMessage('La fecha de expiración debe ser posterior a la fecha de inicio');
                    setSnackbarSeverity('error');
                    setSnackbarOpen(true);
                    return;
                }
            }

            // Formatear fechas para el backend
            const formattedStartAt = formatDateForBackend(values.startAt);
            const formattedEndAt = values.endAt ? formatDateForBackend(values.endAt) : undefined;

            if (!formattedStartAt) {
                setSnackbarMessage('Error en el formato de la fecha de inicio');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }

            const passwordData = {
                content: values.content,
                startAt: formattedStartAt,
                endAt: formattedEndAt
            };

            console.log('Datos a enviar al backend:', passwordData);

            let success: boolean;

            if (isEditMode && id) {
                success = await updatePassword(parseInt(id), passwordData);
                setSnackbarMessage(success ? 'Contraseña actualizada exitosamente' : 'Error al actualizar la contraseña');
            } else {
                success = await createPassword(values.user_id as number, passwordData);
                setSnackbarMessage(success ? 'Contraseña creada exitosamente' : 'Error al crear la contraseña');
            }

            setSnackbarSeverity(success ? 'success' : 'error');
            setSnackbarOpen(true);

            if (success) {
                setTimeout(() => navigate('/passwords'), 1500);
            }
        } catch (err) {
            setSnackbarMessage('Error inesperado al procesar la contraseña');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Breadcrumb */}
            <Breadcrumb pageName={isEditMode ? 'Editar Contraseña' : 'Nueva Contraseña'} />

            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <SecurityIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                <Typography variant="h4" component="h1" fontWeight="bold">
                    {isEditMode ? 'Editar Contraseña' : 'Nueva Contraseña'}
                </Typography>
            </Box>

            {/* Formulario */}
            <Card>
                <CardContent>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        enableReinitialize
                        onSubmit={handleSubmit}
                    >
                        {({ values, errors, touched, isSubmitting }) => {
                            const passwordStrength = evaluatePasswordStrength(values.content);

                            return (
                                <Form>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        {/* Selección de Usuario */}
                                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                                            <Box sx={{ flex: { xs: 1, md: 0.5 } }}>
                                                <FormControl 
                                                    fullWidth 
                                                    error={touched.user_id && !!errors.user_id}
                                                    disabled={isEditMode} // No permitir cambiar usuario en edición
                                                >
                                                <InputLabel>Usuario *</InputLabel>
                                                <Field name="user_id">
                                                    {({ field }: any) => (
                                                        <Select
                                                            {...field}
                                                            label="Usuario *"
                                                            startAdornment={
                                                                <InputAdornment position="start">
                                                                    <PersonIcon />
                                                                </InputAdornment>
                                                            }
                                                        >
                                                            <MenuItem value="" disabled>
                                                                {loadingUsers ? 'Cargando usuarios...' : 'Selecciona un usuario'}
                                                            </MenuItem>
                                                            {users.map((user) => (
                                                                <MenuItem key={user.id} value={user.id}>
                                                                    {user.name} ({user.email})
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    )}
                                                </Field>
                                                {touched.user_id && errors.user_id && (
                                                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                                                        {errors.user_id}
                                                    </Typography>
                                                )}
                                            </FormControl>
                                            </Box>
                                        </Box>

                                        {/* Campo de Contraseña */}
                                        <Box>
                                            <Field name="content">
                                                {({ field }: any) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="Contraseña *"
                                                        type={passwordVisible ? 'text' : 'password'}
                                                        placeholder={isEditMode ? 'Ingresa nueva contraseña para cambiar' : 'Ingresa una contraseña segura'}
                                                        error={touched.content && !!errors.content}
                                                        helperText={touched.content && errors.content}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                                                        edge="end"
                                                                        aria-label="toggle password visibility"
                                                                    >
                                                                        {passwordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                    />
                                                )}
                                            </Field>

                                            {/* Indicador de Fortaleza de Contraseña */}
                                            {values.content && (
                                                <Box sx={{ mt: 2 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Fortaleza:
                                                        </Typography>
                                                        <Chip
                                                            label={passwordStrength.label}
                                                            color={passwordStrength.color}
                                                            size="small"
                                                            icon={
                                                                passwordStrength.color === 'success' ? <CheckCircleIcon /> :
                                                                passwordStrength.color === 'error' ? <ErrorIcon /> :
                                                                <WarningIcon />
                                                            }
                                                        />
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={(passwordStrength.score / 5) * 100}
                                                        color={passwordStrength.color}
                                                        sx={{ height: 8, borderRadius: 4 }}
                                                    />
                                                    {passwordStrength.suggestions.length > 0 && (
                                                        <Box sx={{ mt: 1 }}>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Sugerencias:
                                                            </Typography>
                                                            <Stack direction="column" spacing={0.5} sx={{ mt: 0.5 }}>
                                                                {passwordStrength.suggestions.map((suggestion, index) => (
                                                                    <Typography
                                                                        key={index}
                                                                        variant="caption"
                                                                        color="text.secondary"
                                                                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                                                                    >
                                                                        • {suggestion}
                                                                    </Typography>
                                                                ))}
                                                            </Stack>
                                                        </Box>
                                                    )}
                                                </Box>
                                            )}
                                        </Box>

                                        {/* Fechas */}
                                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
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

                                            <Box sx={{ flex: 1 }}>
                                            <Field name="endAt">
                                                {({ field }: any) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="Fecha de Expiración (Opcional)"
                                                        type="datetime-local"
                                                        error={touched.endAt && !!errors.endAt}
                                                        helperText={touched.endAt && errors.endAt || 'Dejar vacío para contraseña sin expiración'}
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                )}
                                            </Field>
                                            </Box>
                                        </Box>

                                        {/* Información Adicional */}
                                        <Box>
                                            <Paper sx={{ p: 2, backgroundColor: 'info.light', color: 'info.contrastText' }}>
                                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                                                    💡 Políticas de Seguridad:
                                                </Typography>
                                                <Typography variant="caption" component="div">
                                                    • Mínimo 8 caracteres (recomendado 12+)
                                                    <br />
                                                    • Al menos una letra mayúscula y una minúscula
                                                    <br />
                                                    • Al menos un número y un carácter especial
                                                    <br />
                                                    • Evitar secuencias obvias y repeticiones
                                                </Typography>
                                            </Paper>
                                        </Box>

                                        {/* Botones de Acción */}
                                        <Box>
                                            <Divider sx={{ my: 2 }} />
                                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<CancelIcon />}
                                                    onClick={() => navigate('/passwords')}
                                                    sx={{ textTransform: 'none' }}
                                                >
                                                    Cancelar
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                                                    disabled={isSubmitting || loading}
                                                    sx={{ textTransform: 'none', minWidth: 140 }}
                                                >
                                                    {isSubmitting 
                                                        ? 'Guardando...' 
                                                        : isEditMode 
                                                            ? 'Actualizar' 
                                                            : 'Crear'
                                                    }
                                                </Button>
                                            </Stack>
                                        </Box>
                                    </Box>
                                </Form>
                            );
                        }}
                    </Formik>
                </CardContent>
            </Card>

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

export default PasswordForm;