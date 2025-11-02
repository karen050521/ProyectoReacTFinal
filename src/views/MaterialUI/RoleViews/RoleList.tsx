import React, { useState } from "react";
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress,
  Tooltip
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as RoleIcon
} from "@mui/icons-material";
import { useRoleController } from "../../../controllers/useRoleController";
import { Role } from "../../../models/Role";

const RoleList: React.FC = () => {
  const navigate = useNavigate();
  const { roles, loading, error, deleteRole, clearError } = useRoleController();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    role: Role | null;
  }>({ open: false, role: null });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const handleEdit = (role: Role) => {
    navigate(`/roles/update/${role.id}`);
  };

  const handleDelete = async () => {
    if (deleteDialog.role) {
      try {
        const success = await deleteRole(deleteDialog.role.id!);
        if (success) {
          setSnackbar({
            open: true,
            message: 'Rol eliminado correctamente',
            severity: 'success'
          });
        }
        setDeleteDialog({ open: false, role: null });
      } catch (error) {
        console.error("Error deleting role:", error);
        setSnackbar({
          open: true,
          message: 'Error al eliminar el rol',
          severity: 'error'
        });
      }
    }
  };

  const handleCreate = () => {
    navigate('/roles/create');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
    if (error) clearError();
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
    <>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center">
              <RoleIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h5" component="h2">
                Gestión de Roles
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
              size="large"
            >
              Crear Nuevo Rol
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
              {error}
            </Alert>
          )}

          {roles.length === 0 ? (
            <Box textAlign="center" py={8}>
              <RoleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No hay roles registrados
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Crea el primer rol para empezar a gestionar los permisos del sistema
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreate}
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
                    <TableCell><strong>Última Actualización</strong></TableCell>
                    <TableCell align="center"><strong>Acciones</strong></TableCell>
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
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(role.updated_at)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Editar rol">
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(role)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar rol">
                          <IconButton
                            color="error"
                            onClick={() => setDeleteDialog({ open: true, role })}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Dialog de confirmación de eliminación */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, role: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <DeleteIcon color="error" sx={{ mr: 1 }} />
            Confirmar Eliminación
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro que desea eliminar el rol{" "}
            <strong>{deleteDialog.role?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer y puede afectar a los usuarios que tengan este rol asignado.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, role: null })}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RoleList;