import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
  Breadcrumbs,
  Link
} from "@mui/material";
import {
  AdminPanelSettings as RoleIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from "@mui/icons-material";
import { useRoleController } from "../../../controllers/useRoleController";

interface RoleFormProps {
  mode: 'create' | 'edit';
}

const RoleForm: React.FC<RoleFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { createRole, updateRole, getRoleById, error, clearError } = useRoleController();
  const [loading, setLoading] = useState(false);
  const [loadingForm, setLoadingForm] = useState(mode === 'edit');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre no puede exceder 50 caracteres")
      .required("El nombre es obligatorio"),
    description: Yup.string()
      .max(255, "La descripción no puede exceder 255 caracteres")
      .nullable(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const roleData = {
          name: values.name.trim(),
          description: values.description.trim() || null,
        };

        if (mode === 'create') {
          await createRole(roleData);
          setSnackbar({
            open: true,
            message: 'Rol creado correctamente',
            severity: 'success'
          });
        } else if (mode === 'edit' && id) {
          const roleWithId = { ...roleData, id: Number(id) };
          await updateRole(Number(id), roleWithId);
          setSnackbar({
            open: true,
            message: 'Rol actualizado correctamente',
            severity: 'success'
          });
        }
        
        // Redirigir después de un breve delay para mostrar el mensaje
        setTimeout(() => {
          navigate('/roles');
        }, 1500);
      } catch (error) {
        console.error("Error saving role:", error);
        const errorMessage = error instanceof Error ? error.message : 'Error al guardar el rol';
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

  // Cargar datos del rol si estamos en modo edición
  useEffect(() => {
    if (mode === 'edit' && id) {
      const loadRole = async () => {
        try {
          setLoadingForm(true);
          const role = await getRoleById(Number(id));
          if (role) {
            formik.setValues({
              name: role.name || "",
              description: role.description || "",
            });
          } else {
            setSnackbar({
              open: true,
              message: 'No se pudo cargar el rol',
              severity: 'error'
            });
            navigate('/roles');
          }
        } catch (error) {
          console.error("Error loading role:", error);
          setSnackbar({
            open: true,
            message: 'Error al cargar el rol',
            severity: 'error'
          });
          navigate('/roles');
        } finally {
          setLoadingForm(false);
        }
      };
      loadRole();
    }
  }, [mode, id]);

  const handleCancel = () => {
    navigate('/roles');
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
              Cargando rol...
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
              onClick={() => navigate('/roles')}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <RoleIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Gestión de Roles
            </Link>
            <Typography color="text.primary">
              {mode === 'create' ? 'Crear Rol' : 'Editar Rol'}
            </Typography>
          </Breadcrumbs>

          {/* Título */}
          <Box display="flex" alignItems="center" mb={3}>
            <RoleIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h5" component="h1">
              {mode === 'create' ? 'Crear Nuevo Rol' : 'Editar Rol'}
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
              {/* Nombre del rol */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Nombre del Rol *"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  variant="outlined"
                  placeholder="Ej: Administrador, Usuario, Moderador"
                />
              </Grid>

              {/* Descripción */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Descripción"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                  variant="outlined"
                  multiline
                  rows={3}
                  placeholder="Describe las responsabilidades y permisos de este rol..."
                />
              </Grid>

              {/* Botones */}
              <Grid size={{ xs: 12 }}>
                <Box display="flex" gap={2} justifyContent="flex-end">
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
                    startIcon={<SaveIcon />}
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      mode === 'create' ? 'Crear Rol' : 'Actualizar Rol'
                    )}
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

export default RoleForm;