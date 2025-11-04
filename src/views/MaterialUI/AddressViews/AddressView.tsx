import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
  Breadcrumbs,
  Link,
  Paper,
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  Map as MapIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useAddressController } from "../../../controllers/useAddressController";
import { Address } from "../../../models/Address";

// Coordenadas por defecto
const defaultLat = 28.221;
const defaultLng = -31.155;

const AddressView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getAddressById, error, clearError } = useAddressController();
  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  // Función para generar URL del mapa de OpenStreetMap
  const getMapUrl = (lat: number, lng: number) => {
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;
  };

  // Cargar datos de la dirección
  useEffect(() => {
    if (id) {
      const loadAddress = async () => {
        try {
          setLoading(true);
          const addressData = await getAddressById(Number(id));
          if (addressData) {
            setAddress(addressData);
          } else {
            setSnackbar({
              open: true,
              message: 'No se pudo cargar la dirección',
              severity: 'error'
            });
            navigate('/addresses');
          }
        } catch (error) {
          console.error("Error loading address:", error);
          setSnackbar({
            open: true,
            message: 'Error al cargar la dirección',
            severity: 'error'
          });
          navigate('/addresses');
        } finally {
          setLoading(false);
        }
      };
      loadAddress();
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/addresses/update/${address?.id}`);
  };

  const handleBack = () => {
    navigate('/addresses');
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
              Cargando dirección...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (!address) {
    return (
      <Card>
        <CardContent>
          <Box textAlign="center" py={8}>
            <LocationIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Dirección no encontrada
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              No se pudo cargar la información de la dirección
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
            >
              Volver a Direcciones
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const lat = address.latitude ?? defaultLat;
  const lng = address.longitude ?? defaultLng;

  return (
    <>
      <Card>
        <CardContent>
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link
              component="button"
              variant="body1"
              onClick={handleBack}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Mi Dirección
            </Link>
            <Typography color="text.primary">
              Ver Dirección
            </Typography>
          </Breadcrumbs>

          {/* Título */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center">
              <LocationIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
              <Typography variant="h5" component="h1">
                Detalles de la Dirección
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              color="primary"
            >
              Editar Dirección
            </Button>
          </Box>

          {/* Alerta de error */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Sección del Mapa */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <MapIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" component="h3">
                  Ubicación en el Mapa
                </Typography>
              </Box>
              
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2
                }}
              >
                {/* Iframe del mapa */}
                <Box 
                  sx={{ 
                    width: '100%', 
                    height: 500, 
                    border: '1px solid #ddd', 
                    borderRadius: 1,
                    overflow: 'hidden'
                  }}
                >
                  <iframe
                    key={`map-${lat}-${lng}`}
                    src={getMapUrl(lat, lng)}
                    title="OpenStreetMap"
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      border: 'none',
                      borderRadius: '4px'
                    }}
                    loading="eager"
                  />
                </Box>
              </Paper>
            </Grid>

            {/* Información de la dirección */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  height: 'fit-content'
                }}
              >
                <Typography variant="h6" component="h3" gutterBottom>
                  Información de la Dirección
                </Typography>
                
                <Box display="flex" flexDirection="column" gap={3}>
                  {/* ID */}
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      ID
                    </Typography>
                    <Chip label={address.id} size="small" color="primary" variant="outlined" />
                  </Box>

                  {/* Calle */}
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Calle
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {address.street || 'N/A'}
                    </Typography>
                  </Box>

                  {/* Número */}
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Número
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {address.number || 'N/A'}
                    </Typography>
                  </Box>

                  {/* Latitud */}
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Latitud
                    </Typography>
                    <Typography variant="body1">
                      {address.latitude !== null ? address.latitude?.toFixed(6) : 'No especificada'}
                    </Typography>
                  </Box>

                  {/* Longitud */}
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Longitud
                    </Typography>
                    <Typography variant="body1">
                      {address.longitude !== null ? address.longitude?.toFixed(6) : 'No especificada'}
                    </Typography>
                  </Box>

                  {/* Coordenadas */}
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Coordenadas
                    </Typography>
                    {address.latitude && address.longitude ? (
                      <Chip
                        icon={<LocationIcon />}
                        label={`${address.latitude.toFixed(4)}, ${address.longitude.toFixed(4)}`}
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
                  </Box>

                  {/* Fecha de creación */}
                  {address.created_at && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Fecha de Creación
                      </Typography>
                      <Typography variant="body1">
                        {new Date(address.created_at).toLocaleString('es-ES')}
                      </Typography>
                    </Box>
                  )}

                  {/* Última actualización */}
                  {address.updated_at && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Última Actualización
                      </Typography>
                      <Typography variant="body1">
                        {new Date(address.updated_at).toLocaleString('es-ES')}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Botones */}
                <Box mt={4} display="flex" flexDirection="column" gap={2}>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                    color="primary"
                    fullWidth
                  >
                    Editar Dirección
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    fullWidth
                  >
                    Volver a Direcciones
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

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

export default AddressView;