/**
 * COMPONENTE DE EJEMPLO - ALTERNANCIA DE ESTILOS
 * 
 * Este componente muestra cómo implementar la alternancia entre Tailwind CSS y Material UI
 * SIN MODIFICAR los estilos Tailwind existentes.
 * 
 * INSTRUCCIONES:
 * 1. Copia este patrón para cualquier componente que necesites convertir
 * 2. La versión Tailwind DEBE mantenerse exactamente igual (sin cambios)
 * 3. La versión Material UI va dentro del if (styleMode === 'materialui')
 */

import { useThemeStyle } from '../context/ThemeStyleContext';
// Importaciones de Material UI (solo si styleMode === 'materialui')
import { Card, CardContent, CardHeader, Typography, TextField, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Tema Material UI con colores amarillos
const materialTheme = createTheme({
  palette: {
    primary: {
      main: '#FFC107', // Amarillo
      light: '#FFD54F',
      dark: '#FFA000',
    },
    secondary: {
      main: '#FF9800', // Naranja
    },
    background: {
      default: '#FFFDE7', // Amarillo muy claro
      paper: '#FFF9C4',
    },
  },
});

const ExampleComponent = () => {
  const { styleMode } = useThemeStyle();

  // ============================================================
  // VERSIÓN MATERIAL UI (AMARILLO)
  // ============================================================
  if (styleMode === 'materialui') {
    return (
      <ThemeProvider theme={materialTheme}>
        <div style={{ padding: '24px', backgroundColor: '#FFFDE7', minHeight: '100vh' }}>
          <Typography variant="h4" sx={{ mb: 3, color: '#F57F17', fontWeight: 'bold' }}>
            🟡 Material UI Example
          </Typography>

          <Card sx={{ mb: 3, backgroundColor: '#FFF9C4' }}>
            <CardHeader 
              title="Ejemplo de Card con Material UI"
              sx={{ 
                backgroundColor: '#FFC107',
                color: '#000',
                fontWeight: 'bold'
              }}
            />
            <CardContent>
              <Typography variant="body1" sx={{ mb: 2, color: '#F57F17' }}>
                Este es un ejemplo de cómo se vería con Material UI y colores amarillos.
              </Typography>
              
              <TextField 
                fullWidth
                label="Nombre"
                variant="outlined"
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#FFFDE7',
                    '&:hover fieldset': {
                      borderColor: '#FFC107',
                    },
                  },
                }}
              />
              
              <TextField 
                fullWidth
                label="Email"
                variant="outlined"
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#FFFDE7',
                    '&:hover fieldset': {
                      borderColor: '#FFC107',
                    },
                  },
                }}
              />
              
              <Button 
                variant="contained" 
                sx={{ 
                  backgroundColor: '#FFC107',
                  color: '#000',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#FFA000',
                  }
                }}
              >
                Guardar
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ backgroundColor: '#FFF9C4' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1, color: '#F57F17' }}>
                📝 Información
              </Typography>
              <Typography variant="body2" sx={{ color: '#F9A825' }}>
                Esta es la versión con Material UI.
                Los colores principales son amarillos (#FFC107, #FFD54F, etc.)
              </Typography>
            </CardContent>
          </Card>
        </div>
      </ThemeProvider>
    );
  }

  // ============================================================
  // VERSIÓN TAILWIND CSS (AZUL) - MANTENER EXACTAMENTE IGUAL
  // ============================================================
  return (
    <div className="p-6 bg-gray-50 dark:bg-boxdark min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-[#1E3A8A] dark:text-white">
        🔵 Tailwind CSS Example
      </h1>

      {/* Card Principal */}
      <div className="mb-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark" style={{ backgroundColor: '#2563EB' }}>
          <h3 className="font-bold text-white">
            Ejemplo de Card con Tailwind CSS
          </h3>
        </div>
        
        <div className="p-6.5">
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Este es un ejemplo de cómo se ve actualmente con Tailwind CSS y colores azules.
          </p>

          {/* Input Nombre */}
          <div className="mb-4">
            <label className="mb-2.5 block text-sm font-medium text-gray-700 dark:text-white">
              Nombre
            </label>
            <input
              type="text"
              placeholder="Ingrese su nombre"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          {/* Input Email */}
          <div className="mb-4">
            <label className="mb-2.5 block text-sm font-medium text-gray-700 dark:text-white">
              Email
            </label>
            <input
              type="email"
              placeholder="Ingrese su email"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          {/* Botón */}
          <button
            style={{ backgroundColor: '#2563EB', color: '#ffffff' }}
            className="py-2 px-6 font-semibold rounded-md hover:opacity-90"
          >
            Guardar
          </button>
        </div>
      </div>

      {/* Card Información */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="p-6.5">
          <h3 className="text-lg font-semibold mb-2 text-[#1E3A8A] dark:text-white">
            📝 Información
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Esta es la versión con Tailwind CSS.
            Los colores principales son azules (#2563EB, #1E3A8A, etc.)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExampleComponent;
