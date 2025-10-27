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
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { useAddressController } from "../../../controllers/useAddressController";
import { Address } from "../../../models/Address";

const AddressList: React.FC = () => {
  const { addresses, loading, error, deleteAddress } = useAddressController();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    address: Address | null;
  }>({ open: false, address: null });

  const handleEdit = (address: Address) => {
    // TODO: Navigate to edit form
    console.log("Edit address:", address);
  };

  const handleDelete = async () => {
    if (deleteDialog.address) {
      try {
        await deleteAddress(deleteDialog.address.id!);
        setDeleteDialog({ open: false, address: null });
      } catch (error) {
        console.error("Error deleting address:", error);
      }
    }
  };

  const handleCreate = () => {
    // TODO: Navigate to create form
    console.log("Create new address");
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Cargando direcciones...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h2">
            Direcciones
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Nueva Dirección
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Calle</TableCell>
                <TableCell>Número</TableCell>
                <TableCell>Coordenadas</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {addresses.map((address) => (
                <TableRow key={address.id}>
                  <TableCell>{address.id}</TableCell>
                  <TableCell>{address.street}</TableCell>
                  <TableCell>{address.number}</TableCell>
                  <TableCell>
                    <Chip
                      icon={<LocationIcon />}
                      label={`${address.latitude}, ${address.longitude}`}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{address.user_id}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(address)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() =>
                        setDeleteDialog({ open: true, address })
                      }
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, address: null })}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro que desea eliminar la dirección{" "}
            {deleteDialog.address?.street} {deleteDialog.address?.number}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, address: null })}
          >
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default AddressList;