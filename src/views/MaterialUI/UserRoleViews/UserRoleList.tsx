import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
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
    Chip,
    Tooltip,
    Stack,
    Card,
    CardContent
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    PersonAdd as PersonAddIcon,
    Group as GroupIcon
} from '@mui/icons-material';
import { useUserRoleController } from '../../../controllers/useUserRoleController';
import UserSelect from '../../../components/common/UserSelect';
import RoleSelect from '../../../components/common/RoleSelect';
import FilterBar from '../../../components/common/FilterBar';
import ConfirmDeleteDialog from '../../../components/common/ConfirmDeleteDialog';
import EmptyState from '../../../components/common/EmptyState';
import Notification from '../../../components/common/Notification';
import type { UserRole } from '../../../models/UserRole';

interface UserRoleListProps {
    userId?: number; // Para filtrar por usuario específico
    roleId?: number; // Para filtrar por rol específico
}

const UserRoleList: React.FC<UserRoleListProps> = ({ userId, roleId }) => {
    const navigate = useNavigate();
    const {
        userRoles,
        loading,
        error,
        removeRole,
        refreshUserRoles,
        clearError,
        getUsers,
        getRoles
    } = useUserRoleController();

    // 🎛️ ESTADOS LOCALES
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        userRole: UserRole | null;
    }>({ open: false, userRole: null });
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({ open: false, message: '', severity: 'success' });

    // 🔍 ESTADOS DE FILTROS
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterUserId, setFilterUserId] = useState<number | ''>('');
    const [filterRoleId, setFilterRoleId] = useState<number | ''>('');
    const [filterStatus, setFilterStatus] = useState<string>('');

    // 📊 DATOS AUXILIARES
    const [users, setUsers] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);

    // 📥 CARGAR DATOS AUXILIARES
    const loadAuxiliaryData = async () => {
        try {
            const [usersData, rolesData] = await Promise.all([
                getUsers(),
                getRoles()
            ]);
            setUsers(usersData);
            setRoles(rolesData);
        } catch (err) {
            console.error('Error cargando datos auxiliares:', err);
        }
    };

    // 🔄 CARGAR DATOS INICIALES
    useEffect(() => {
        loadAuxiliaryData();
        // Aplicar filtros iniciales si se pasan como props
        if (userId) setFilterUserId(userId);
        if (roleId) setFilterRoleId(roleId);
    }, [userId, roleId]);

    // 📅 FUNCIÓN PARA FORMATEAR FECHAS (aplicar correcciones de timezone)
    const formatDate = (dateString?: string): string => {
        if (!dateString) return 'N/A';
        try {
            // Limpieza de zona horaria como en PasswordList
            const cleanDateString = dateString
                .replace('Z', '')
                .replace(/[+-]\d{2}:\d{2}$/, '');
            
            const date = new Date(cleanDateString);
            
            if (isNaN(date.getTime())) return 'Fecha inválida';
            
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

    // 🟢 FUNCIÓN PARA DETERMINAR ESTADO DE ASIGNACIÓN
    const getAssignmentStatus = (userRole: UserRole): { 
        status: 'active' | 'expired' | 'expiring' | 'future';
        label: string;
        color: 'success' | 'error' | 'warning' | 'info';
    } => {
        const now = new Date();
        const startDate = new Date(userRole.startAt);
        const endDate = userRole.endAt ? new Date(userRole.endAt) : null;

        // 🔮 FUTURO: Aún no ha iniciado
        if (startDate > now) {
            return { status: 'future', label: 'Futuro', color: 'info' };
        }

        // 🔴 EXPIRADO: Ya venció
        if (endDate && endDate < now) {
            return { status: 'expired', label: 'Expirado', color: 'error' };
        }

        // 🟡 POR EXPIRAR: Expira en menos de 7 días
        if (endDate) {
            const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            if (daysUntilExpiry <= 7) {
                return { status: 'expiring', label: `Expira en ${daysUntilExpiry}d`, color: 'warning' };
            }
        }

        // 🟢 ACTIVO: Vigente
        return { status: 'active', label: 'Activo', color: 'success' };
    };

    // 🔍 OBTENER NOMBRE DE USUARIO
    const getUserName = (userId: number): string => {
        const user = users.find(u => u.id === userId);
        return user ? `${user.name} (${user.email})` : `Usuario #${userId}`;
    };

    // 🎭 OBTENER NOMBRE DE ROL
    const getRoleName = (roleId: number): string => {
        const role = roles.find(r => r.id === roleId);
        return role ? role.name : `Rol #${roleId}`;
    };

    // 🔍 FILTRAR ASIGNACIONES
    const filteredUserRoles = userRoles.filter((userRole) => {
        // Filtro por término de búsqueda
        const userName = getUserName(userRole.user_id).toLowerCase();
        const roleName = getRoleName(userRole.role_id).toLowerCase();
        const matchesSearch = searchTerm === '' || 
            userName.includes(searchTerm.toLowerCase()) || 
            roleName.includes(searchTerm.toLowerCase());

        // Filtro por usuario
        const matchesUser = filterUserId === '' || userRole.user_id === filterUserId;

        // Filtro por rol
        const matchesRole = filterRoleId === '' || userRole.role_id === filterRoleId;

        // Filtro por estado
        const matchesStatus = filterStatus === '' || getAssignmentStatus(userRole).status === filterStatus;

        return matchesSearch && matchesUser && matchesRole && matchesStatus;
    });

    // 🗑️ MANEJAR ELIMINACIÓN
    const handleDelete = async (userRole: UserRole) => {
        setDeleteDialog({ open: true, userRole });
    };

    const confirmDelete = async () => {
        if (!deleteDialog.userRole?.id) return;

        try {
            const success = await removeRole(deleteDialog.userRole.id);
            setSnackbar({
                message: success ? 'Asignación eliminada exitosamente' : 'Error al eliminar asignación',
                severity: success ? 'success' : 'error',
                open: true
            });
        } catch (err) {
            setSnackbar({
                message: 'Error al eliminar la asignación',
                severity: 'error',
                open: true
            });
        }

        setDeleteDialog({ open: false, userRole: null });
    };

    // ✏️ EDITAR ASIGNACIÓN
    const handleEdit = (userRole: UserRole) => {
        navigate(`/user-roles/update/${userRole.id}`);
    };

    // ➕ CREAR NUEVA ASIGNACIÓN
    const handleCreate = () => {
        navigate('/user-roles/assign');
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* 🏠 HEADER */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <GroupIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                    <Typography variant="h4" component="h1" fontWeight="bold">
                        Asignación de Roles
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    onClick={handleCreate}
                    sx={{ textTransform: 'none' }}
                >
                    Asignar Rol
                </Button>
            </Box>

            {/* 🔍 FILTROS */}
            <FilterBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchLabel="Buscar por usuario o rol"
                searchPlaceholder="Escribe nombre de usuario o rol..."
                onRefresh={refreshUserRoles}
                loading={loading}
                filters={[
                    {
                        label: "Filtrar por Usuario",
                        value: filterUserId,
                        onChange: setFilterUserId,
                        options: [],
                        component: (
                            <UserSelect
                                value={filterUserId}
                                onChange={setFilterUserId}
                                label="Filtrar por Usuario"
                                size="small"
                                placeholder="Todos los usuarios"
                            />
                        )
                    },
                    {
                        label: "Filtrar por Rol",
                        value: filterRoleId,
                        onChange: setFilterRoleId,
                        options: [],
                        component: (
                            <RoleSelect
                                value={filterRoleId}
                                onChange={setFilterRoleId}
                                label="Filtrar por Rol"
                                size="small"
                                placeholder="Todos los roles"
                            />
                        )
                    },
                    {
                        label: "Estado",
                        value: filterStatus,
                        onChange: setFilterStatus,
                        options: [
                            { value: '', label: 'Todos los estados' },
                            { value: 'active', label: '🟢 Activo' },
                            { value: 'expiring', label: '🟡 Por Expirar' },
                            { value: 'expired', label: '🔴 Expirado' },
                            { value: 'future', label: '🔵 Futuro' }
                        ]
                    }
                ]}
            />

            {/* 📊 TABLA DE ASIGNACIONES */}
            <Card>
                <CardContent>
                    {loading ? (
                        <EmptyState 
                            icon={<GroupIcon />}
                            title="Cargando asignaciones..."
                            description="Obteniendo datos del servidor"
                            loading={true}
                        />
                    ) : filteredUserRoles.length === 0 ? (
                        <EmptyState
                            icon={<GroupIcon />}
                            title={userRoles.length === 0 
                                ? 'No hay asignaciones de roles registradas'
                                : 'No se encontraron asignaciones con los filtros aplicados'
                            }
                            description={userRoles.length === 0 
                                ? 'Comienza asignando roles a los usuarios del sistema'
                                : 'Intenta modificar los filtros de búsqueda'
                            }
                            actionButton={userRoles.length === 0 ? {
                                text: 'Asignar Primer Rol',
                                onClick: handleCreate,
                                icon: <PersonAddIcon />
                            } : undefined}
                        />
                    ) : (
                        <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: 'grey.50' }}>
                                        <TableCell><strong>Usuario</strong></TableCell>
                                        <TableCell><strong>Rol</strong></TableCell>
                                        <TableCell><strong>Fecha Inicio</strong></TableCell>
                                        <TableCell><strong>Fecha Fin</strong></TableCell>
                                        <TableCell><strong>Estado</strong></TableCell>
                                        <TableCell align="center"><strong>Acciones</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredUserRoles.map((userRole) => {
                                        const status = getAssignmentStatus(userRole);
                                        
                                        return (
                                            <TableRow key={userRole.id} hover>
                                                {/* 👤 Usuario */}
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {getUserName(userRole.user_id)}
                                                    </Typography>
                                                </TableCell>

                                                {/* 🎭 Rol */}
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {getRoleName(userRole.role_id)}
                                                    </Typography>
                                                </TableCell>

                                                {/* 📅 Fecha Inicio */}
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {formatDate(userRole.startAt)}
                                                    </Typography>
                                                </TableCell>

                                                {/* 📅 Fecha Fin */}
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {formatDate(userRole.endAt || undefined) || 'Sin expiración'}
                                                    </Typography>
                                                </TableCell>

                                                {/* 🟢 Estado */}
                                                <TableCell>
                                                    <Chip
                                                        label={status.label}
                                                        color={status.color}
                                                        size="small"
                                                        variant="filled"
                                                    />
                                                </TableCell>

                                                {/* ⚡ Acciones */}
                                                <TableCell align="center">
                                                    <Stack direction="row" spacing={1} justifyContent="center">
                                                        <Tooltip title="Editar fechas">
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => handleEdit(userRole)}
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Eliminar asignación">
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleDelete(userRole)}
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

            {/* 🗑️ DIALOG ELIMINACIÓN */}
            <ConfirmDeleteDialog
                open={deleteDialog.open}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteDialog({ open: false, userRole: null })}
                title="Confirmar Eliminación"
                message="¿Estás seguro de que deseas eliminar esta asignación de rol?"
                itemDetails={deleteDialog.userRole && (
                    <>
                        <Typography variant="body2">
                            <strong>Usuario:</strong> {getUserName(deleteDialog.userRole.user_id)}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Rol:</strong> {getRoleName(deleteDialog.userRole.role_id)}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Período:</strong> {formatDate(deleteDialog.userRole.startAt)} - {formatDate(deleteDialog.userRole.endAt ?? undefined) || 'Sin fin'}
                        </Typography>
                    </>
                )}
            />

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

export default UserRoleList;
