import React, { useEffect, useState } from "react";
import { Role } from "../../models/Role";
import { roleService } from "../../services/roleService";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as RoleIcon
} from "@mui/icons-material";

const ListRolePermissions: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const rolesData = await roleService.getRoles();
            console.debug('RolePermission.list fetchData -> received', rolesData);
            setRoles(rolesData);
        } catch (error) {
            console.error("Error fetching roles:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleManagePermissions = (role: Role) => {
        navigate(`/role-permissions/manage/${role.id}`);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                        <CircularProgress />
                        <Typography variant="body1" sx={{ ml: 2 }}>
                            Cargando roles...
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Box display="flex" alignItems="center">
                        <SettingsIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h5" component="h2">
                            Gestión de Permisos por Rol
                        </Typography>
                    </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" mb={3}>
                    Selecciona un rol para gestionar sus permisos
                </Typography>

                {roles.length === 0 ? (
                    <Box textAlign="center" py={8}>
                        <RoleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No hay roles registrados
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={3}>
                            Crea roles primero para poder gestionar sus permisos
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/roles/create')}
                            size="large"
                        >
                            Crear Primer Rol
                        </Button>
                    </Box>
                ) : (
                    <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                                    <TableCell><strong>ID</strong></TableCell>
                                    <TableCell><strong>Nombre</strong></TableCell>
                                    <TableCell><strong>Descripción</strong></TableCell>
                                    <TableCell><strong>Fecha Creación</strong></TableCell>
                                    <TableCell align="center"><strong>Gestionar Permisos</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {roles.map((role) => (
                                    <TableRow key={role.id} hover>
                                        <TableCell>
                                            <Chip label={role.id} size="small" color="primary" variant="outlined" />
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                <RoleIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                                                <Typography variant="body2" fontWeight="medium">
                                                    {role.name}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {role.description || 'Sin descripción'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {formatDate(role.created_at)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                startIcon={<SettingsIcon />}
                                                onClick={() => handleManagePermissions(role)}
                                                sx={{ 
                                                    textTransform: 'none',
                                                    fontWeight: 'medium'
                                                }}
                                            >
                                                Manage Permissions
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </CardContent>
        </Card>
    );
};

export default ListRolePermissions;