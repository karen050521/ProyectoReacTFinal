import React, { useState } from "react";
import {
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
  Box,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  LocationOn as LocationIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAddressController } from "../../../controllers/useAddressController";
import { Address } from "../../../models/Address";

const AddressList: React.FC = () => {
  const navigate = useNavigate();
  const { addresses, loading, error, deleteAddress, clearError } = useAddressController();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    address: Address | null;
  }>({ open: false, address: null });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const handleEdit = (address: Address) => {
    navigate(`/addresses/update/${address.id}`);
  };

  const handleDelete = async () => {
    if (deleteDialog.address) {
      try {
        const success = await deleteAddress(deleteDialog.address.id!);
        if (success) {
          setSnackbar({
            open: true,
            message: 'Dirección eliminada correctamente',
            severity: 'success'
          });
        }
        setDeleteDialog({ open: false, address: null });
      } catch (error) {
        console.error("Error deleting address:", error);
        setSnackbar({
          open: true,
          message: 'Error al eliminar la dirección',
          severity: 'error'
        });
      }
    }
  };

  const handleCreate = () => {
    navigate('/addresses/create');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
    if (error) clearError();
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Cargando tu dirección...
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
              <HomeIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h5" component="h2">
                Mi Dirección
              </Typography>
            </Box>
            {addresses.length === 0 && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreate}
                size="large"
              >
                Agregar Mi Dirección
              </Button>
            )}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
              {error}
            </Alert>
          )}

          {addresses.length === 0 ? (
            <Box textAlign="center" py={8}>
              <HomeIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No tienes una dirección registrada
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Agrega tu dirección para poder utilizarla en el sistema
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreate}
                size="large"
              >
                Crear Mi Primera Dirección
              </Button>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.50' }}>
                    <TableCell><strong>ID</strong></TableCell>
                    <TableCell><strong>Calle</strong></TableCell>
                    <TableCell><strong>Número</strong></TableCell>
                    <TableCell><strong>Coordenadas</strong></TableCell>
                    <TableCell><strong>Fecha Creación</strong></TableCell>
                    <TableCell align="center"><strong>Acciones</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {addresses.map((address) => (
                    <TableRow key={address.id} hover>
                      <TableCell>
                        <Chip label={address.id} size="small" color="primary" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {address.street}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {address.number}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {address.latitude && address.longitude ? (
                          <Chip
                            icon={<LocationIcon />}
                            label={`${address.latitude?.toFixed(4)}, ${address.longitude?.toFixed(4)}`}
                            variant="outlined"
                            size="small"
                            color="success"
                          />
                        ) : (
                          <Chip
                            label="Sin coordenadas"
                            variant="outlined"
                            size="small"
                            color="default"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {address.created_at ? new Date(address.created_at).toLocaleDateString('es-ES') : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(address)}
                          color="primary"
                          title="Editar dirección"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() =>
                            setDeleteDialog({ open: true, address })
                          }
                          color="error"
                          title="Eliminar dirección"
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon />
                        </IconButton>
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
        onClose={() => setDeleteDialog({ open: false, address: null })}
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
            ¿Está seguro que desea eliminar la dirección{" "}
            <strong>{deleteDialog.address?.street} {deleteDialog.address?.number}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, address: null })}
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

export default AddressList;