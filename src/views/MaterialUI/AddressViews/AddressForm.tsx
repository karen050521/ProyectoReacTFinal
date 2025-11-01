import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
  Breadcrumbs,
  Link,
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAddressController } from "../../../controllers/useAddressController";

interface AddressFormProps {
  mode: 'create' | 'edit';
}

const AddressForm: React.FC<AddressFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { createAddress, updateAddress, getAddressById, error, clearError } = useAddressController();
  const [loading, setLoading] = useState(false);
  const [loadingForm, setLoadingForm] = useState(mode === 'edit');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const validationSchema = Yup.object({
    street: Yup.string()
      .min(3, "La calle debe tener al menos 3 caracteres")
      .max(100, "La calle no puede exceder 100 caracteres")
      .required("La calle es obligatoria"),
    number: Yup.string()
      .min(1, "El número debe tener al menos 1 caracter")
      .max(10, "El número no puede exceder 10 caracteres")
      .required("El número es obligatorio"),
    latitude: Yup.number()
      .min(-90, "La latitud debe estar entre -90 y 90")
      .max(90, "La latitud debe estar entre -90 y 90")
      .nullable(),
    longitude: Yup.number()
      .min(-180, "La longitud debe estar entre -180 y 180")
      .max(180, "La longitud debe estar entre -180 y 180")
      .nullable(),
  });

  const formik = useFormik({
    initialValues: {
      street: "",
      number: "",
      latitude: "",
      longitude: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const addressData = {
          street: values.street,
          number: values.number,
          latitude: values.latitude === "" ? null : Number(values.latitude),
          longitude: values.longitude === "" ? null : Number(values.longitude),
        };

        if (mode === 'create') {
          await createAddress(addressData);
          setSnackbar({
            open: true,
            message: 'Dirección creada correctamente',
            severity: 'success'
          });
        } else if (mode === 'edit' && id) {
          const addressWithId = { ...addressData, id: Number(id) };
          await updateAddress(Number(id), addressWithId);
          setSnackbar({
            open: true,
            message: 'Dirección actualizada correctamente',
            severity: 'success'
          });
        }
        
        // Redirigir después de un breve delay para mostrar el mensaje
        setTimeout(() => {
          navigate('/addresses');
        }, 1500);
      } catch (error) {
        console.error("Error saving address:", error);
        const errorMessage = error instanceof Error ? error.message : 'Error al guardar la dirección';
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    },
  });

  // Cargar datos de la dirección si estamos en modo edición
  useEffect(() => {
    if (mode === 'edit' && id) {
      const loadAddress = async () => {
        try {
          setLoadingForm(true);
          const address = await getAddressById(Number(id));
          if (address) {
            formik.setValues({
              street: address.street || "",
              number: address.number || "",
              latitude: address.latitude !== undefined && address.latitude !== null ? address.latitude.toString() : "",
              longitude: address.longitude !== undefined && address.longitude !== null ? address.longitude.toString() : "",
            });
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
          setLoadingForm(false);
        }
      };
      loadAddress();
    }
  }, [mode, id]);

  const handleCancel = () => {
    navigate('/addresses');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
    if (error) clearError();
  };

  if (loadingForm) {
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

  return (
    <>
      <Card>
        <CardContent>
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link
              component="button"
              variant="body1"
              onClick={() => navigate('/addresses')}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Mi Dirección
            </Link>
            <Typography color="text.primary">
              {mode === 'create' ? 'Crear Dirección' : 'Editar Dirección'}
            </Typography>
          </Breadcrumbs>

          {/* Título */}
          <Box display="flex" alignItems="center" mb={3}>
            <LocationIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h5" component="h1">
              {mode === 'create' ? 'Crear Nueva Dirección' : 'Editar Dirección'}
            </Typography>
          </Box>

          {/* Alerta de error */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
              {error}
            </Alert>
          )}

          {/* Formulario */}
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              {/* Calle */}
              <Grid size={{ xs: 12, md: 8 }}>
                <TextField
                  fullWidth
                  id="street"
                  name="street"
                  label="Calle"
                  value={formik.values.street}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.street && Boolean(formik.errors.street)}
                  helperText={formik.touched.street && formik.errors.street}
                  required
                />
              </Grid>

              {/* Número */}
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  id="number"
                  name="number"
                  label="Número"
                  value={formik.values.number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.number && Boolean(formik.errors.number)}
                  helperText={formik.touched.number && formik.errors.number}
                  required
                />
              </Grid>

              {/* Latitud */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  id="latitude"
                  name="latitude"
                  label="Latitud (Opcional)"
                  type="number"
                  inputProps={{ step: "any" }}
                  value={formik.values.latitude}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.latitude && Boolean(formik.errors.latitude)}
                  helperText={formik.touched.latitude && formik.errors.latitude || "Ejemplo: -34.6118"}
                />
              </Grid>

              {/* Longitud */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  id="longitude"
                  name="longitude"
                  label="Longitud (Opcional)"
                  type="number"
                  inputProps={{ step: "any" }}
                  value={formik.values.longitude}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.longitude && Boolean(formik.errors.longitude)}
                  helperText={formik.touched.longitude && formik.errors.longitude || "Ejemplo: -58.3960"}
                />
              </Grid>

              {/* Información adicional */}
              <Grid size={{ xs: 12 }}>
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Nota:</strong> Las coordenadas de latitud y longitud son opcionales. 
                    Si las proporcionas, asegúrate de que sean válidas para una mejor geolocalización.
                  </Typography>
                </Alert>
              </Grid>

              {/* Botones */}
              <Grid size={{ xs: 12 }}>
                <Box display="flex" gap={2} justifyContent="flex-end" mt={2}>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    startIcon={<CancelIcon />}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={loading || !formik.isValid}
                    color={mode === 'create' ? 'primary' : 'success'}
                  >
                    {loading 
                      ? 'Guardando...' 
                      : mode === 'create' 
                        ? 'Crear Dirección' 
                        : 'Actualizar Dirección'
                    }
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
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

export default AddressForm;