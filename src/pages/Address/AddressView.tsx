import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import api from "../../interceptors/axiosInterceptor";
import type { Address } from "../../models/Address";
import { getUserById } from "../../services/userService";
import Breadcrumb from "../../components/Breadcrumb";

const defaultLat = 5.0703;
const defaultLng = -75.5138;

export default function AddressView(): JSX.Element {
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();

  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [styleMode, setStyleMode] = useState<"tailwind" | "material">("tailwind");

  useEffect(() => {
    async function fetchAddress() {
      if (!userId) return;
      setLoading(true);
      try {
        const endpoint = `/addresses/user/${userId}`;
        const resp = await api.get<Address | null>(endpoint);
        const data = resp.data as any;
        if (data) {
          setAddress(data);
        }
      } catch (err: any) {
        console.error("Error fetching address:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAddress();
  }, [userId]);

  useEffect(() => {
    async function fetchUserName() {
      if (!userId) return;
      try {
        const numericId = Number(userId);
        if (Number.isNaN(numericId)) return;
        const user = await getUserById(numericId);
        if (user) {
          setUserName(user.name ?? null);
        }
      } catch (err) {
        console.debug("Error fetching user name:", err);
      }
    }
    fetchUserName();
  }, [userId]);

  const getMapUrl = () => {
    const lat = address?.latitude ?? defaultLat;
    const lng = address?.longitude ?? defaultLng;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;
  };

  // Toggle buttons component
  const ToggleButtons = () => (
    <Box sx={{ mb: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
      <Button
        variant={styleMode === "tailwind" ? "contained" : "outlined"}
        onClick={() => setStyleMode("tailwind")}
        sx={{ minWidth: 120 }}
      >
        Tailwind
      </Button>
      <Button
        variant={styleMode === "material" ? "contained" : "outlined"}
        onClick={() => setStyleMode("material")}
        sx={{ minWidth: 120 }}
      >
        Material UI
      </Button>
    </Box>
  );

  // Material UI Version
  if (styleMode === "material") {
    if (loading) {
      return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <ToggleButtons />
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        </Container>
      );
    }

    if (!address) {
      return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <ToggleButtons />
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom color="text.secondary">
              No hay dirección registrada
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Este usuario no tiene una dirección guardada.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
                onClick={() => navigate(`/addresses/edit/${userId}`)}
              >
                Crear Dirección
              </Button>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/users")}
              >
                Volver a Usuarios
              </Button>
            </Box>
          </Paper>
        </Container>
      );
    }

    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <ToggleButtons />
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
          <LocationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {userName ? `Dirección de ${userName}` : 'Dirección del Usuario'}
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <iframe
                key={`map-${address.latitude}-${address.longitude}`}
                src={getMapUrl()}
                title="OpenStreetMap"
                style={{ 
                  width: '100%', 
                  height: '500px', 
                  minHeight: '500px',
                  border: 'none',
                  borderRadius: '4px'
                }}
                loading="eager"
              />
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Detalles de la Dirección
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                    Calle
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {address.street || 'N/A'}
                  </Typography>
                  <Divider sx={{ mt: 1 }} />
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                    Número
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {address.number || 'N/A'}
                  </Typography>
                  <Divider sx={{ mt: 1 }} />
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                    Latitud
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {address.latitude}
                  </Typography>
                  <Divider sx={{ mt: 1 }} />
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                    Longitud
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {address.longitude}
                  </Typography>
                  <Divider sx={{ mt: 1 }} />
                </Box>

                {address.created_at && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                      Fecha de Creación
                    </Typography>
                    <Typography variant="body2">
                      {new Date(address.created_at).toLocaleString('es-ES')}
                    </Typography>
                    <Divider sx={{ mt: 1 }} />
                  </Box>
                )}

                {address.updated_at && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                      Última Actualización
                    </Typography>
                    <Typography variant="body2">
                      {new Date(address.updated_at).toLocaleString('es-ES')}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/addresses/edit/${userId}`)}
                  fullWidth
                >
                  Editar Dirección
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate("/users")}
                  fullWidth
                >
                  Volver a Usuarios
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }

  // Tailwind Version
  if (loading) {
    return (
      <>
        <Breadcrumb pageName={userName ? `${userName} - Dirección` : 'Dirección'} />
        <div className="flex flex-col items-center mb-6">
          <div className="mb-6 flex gap-4">
            <button
              onClick={() => setStyleMode("tailwind")}
              className="px-6 py-2 rounded-md font-medium bg-primary text-white"
            >
              Tailwind
            </button>
            <button
              onClick={() => setStyleMode("material")}
              className="px-6 py-2 rounded-md font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Material UI
            </button>
          </div>
        </div>
        <div className="p-6 bg-white dark:bg-boxdark rounded-md shadow-md">
          <p className="text-gray-500">Cargando...</p>
        </div>
      </>
    );
  }

  if (!address) {
    return (
      <>
        <Breadcrumb pageName={userName ? `${userName} - Dirección` : 'Dirección'} />
        <div className="flex flex-col items-center mb-6">
          <div className="mb-6 flex gap-4">
            <button
              onClick={() => setStyleMode("tailwind")}
              className="px-6 py-2 rounded-md font-medium bg-primary text-white"
            >
              Tailwind
            </button>
            <button
              onClick={() => setStyleMode("material")}
              className="px-6 py-2 rounded-md font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Material UI
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-boxdark p-6 rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4">No hay dirección registrada</h2>
          <p className="mb-4">Este usuario no tiene una dirección guardada.</p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/addresses/edit/${userId}`)}
              className="bg-success text-white py-2 px-6 rounded-md hover:bg-green-700"
            >
              Crear Dirección
            </button>
            <button
              onClick={() => navigate("/users")}
              className="bg-gray-200 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-300"
            >
              Volver a Usuarios
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb pageName={userName ? `${userName} - Dirección` : 'Dirección'} />
      <div className="flex flex-col items-center mb-6">
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setStyleMode("tailwind")}
            className="px-6 py-2 rounded-md font-medium bg-primary text-white"
          >
            Tailwind
          </button>
          <button
            onClick={() => setStyleMode("material")}
            className="px-6 py-2 rounded-md font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Material UI
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Mapa */}
        <div className="w-2/3">
          <div className="bg-white dark:bg-boxdark p-4 rounded-md shadow-md">
            <iframe
              key={`map-${address.latitude}-${address.longitude}`}
              src={getMapUrl()}
              title="OpenStreetMap"
              className="w-full"
              style={{ height: '500px', minHeight: '500px' }}
            />
          </div>
        </div>

        {/* Información */}
        <div className="w-1/3">
          <div className="bg-white dark:bg-boxdark p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4">Detalles de la Dirección</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Calle</p>
                <p className="font-medium">{address.street || 'N/A'}</p>
                <hr className="mt-2" />
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Número</p>
                <p className="font-medium">{address.number || 'N/A'}</p>
                <hr className="mt-2" />
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Latitud</p>
                <p className="font-medium">{address.latitude}</p>
                <hr className="mt-2" />
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Longitud</p>
                <p className="font-medium">{address.longitude}</p>
                <hr className="mt-2" />
              </div>

              {address.created_at && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Fecha de Creación</p>
                  <p className="text-sm">{new Date(address.created_at).toLocaleString('es-ES')}</p>
                  <hr className="mt-2" />
                </div>
              )}

              {address.updated_at && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Última Actualización</p>
                  <p className="text-sm">{new Date(address.updated_at).toLocaleString('es-ES')}</p>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => navigate(`/addresses/edit/${userId}`)}
                className="w-full bg-success text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Editar Dirección
              </button>
              <button
                onClick={() => navigate("/users")}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
              >
                Volver a Usuarios
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
