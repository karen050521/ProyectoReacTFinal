import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import { Home as HomeIcon } from "@mui/icons-material";
import Breadcrumb from "../../components/Breadcrumb";

export default function AddressList(): JSX.Element {
  const navigate = useNavigate();
  const [styleMode, setStyleMode] = useState<"tailwind" | "material">("tailwind");

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/users");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

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

  if (styleMode === "material") {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <ToggleButtons />
        <Paper elevation={3} sx={{ p: 4 }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Redirigiendo a Usuarios...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Serás redirigido en 3 segundos
          </Typography>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => navigate("/users")}
          >
            Ir Ahora
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Addresses" />
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setStyleMode("tailwind")}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              styleMode === "tailwind"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Tailwind
          </button>
          <button
            onClick={() => setStyleMode("material")}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              styleMode === "material"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Material UI
          </button>
        </div>

        <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-800 dark:text-white text-lg mb-4">
            Redirigiendo a Usuarios...
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Serás redirigido en 3 segundos
          </p>
          <button
            onClick={() => navigate("/users")}
            className="bg-primary text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
          >
            Ir Ahora
          </button>
        </div>
      </div>
    </>
  );
}
