import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById } from "../../services/userService";
import { User } from '../../models/user';
import Breadcrumb from "../../components/Breadcrumb";
import {
    Button,
    Paper,
    Typography,
    Box,
    Divider,
    ThemeProvider,
    createTheme,
    CssBaseline,
} from "@mui/material";
import useColorMode from "../../hooks/useColorMode";

type UIMode = "tailwind" | "material";

const ViewUserPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [uiMode, setUiMode] = useState<UIMode>("tailwind");
    const [colorMode] = useColorMode();

    // Crear tema de Material UI que respete el modo oscuro y use colores amarillos en claro
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: colorMode === 'dark' ? 'dark' : 'light',
                    primary: {
                        main: colorMode === 'light' ? '#f59e0b' : '#3b82f6',
                    },
                    secondary: {
                        main: colorMode === 'light' ? '#eab308' : '#8b5cf6',
                    },
                    background: {
                        default: colorMode === 'light' ? '#fffbeb' : '#121212',
                        paper: colorMode === 'light' ? '#fef3c7' : '#1e1e1e',
                    },
                },
            }),
        [colorMode]
    );

    useEffect(() => {
        const fetchUser = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const userData = await getUserById(Number.parseInt(id));
                setUser(userData);
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    if (loading) {
        return (
            <>
                <Breadcrumb pageName="Ver Usuario" />
                <div className="p-6 bg-white dark:bg-boxdark rounded-md shadow-md">
                    <p className="text-gray-500 dark:text-gray-300">Cargando...</p>
                </div>
            </>
        );
    }

    if (!user) {
        return (
            <>
                <Breadcrumb pageName="Ver Usuario" />
                <div className="p-6 bg-white dark:bg-boxdark rounded-md shadow-md">
                    <p className="text-red-500">Usuario no encontrado</p>
                    <button
                        onClick={() => navigate("/users")}
                        style={{ backgroundColor: '#6b7280', color: '#ffffff' }}
                        className="mt-4 py-2 px-6 font-semibold rounded-md hover:opacity-90"
                    >
                        Volver a la lista
                    </button>
                </div>
            </>
        );
    }

    // ============ RENDER TAILWIND ============
    const renderTailwind = () => (
        <>
            <Breadcrumb pageName="Ver Usuario" />
            <div className="p-6 bg-white dark:bg-boxdark rounded-md shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Información del Usuario</h2>
                
                <div className="grid grid-cols-1 gap-6">
                    {/* ID */}
                    <div className="border-b border-stroke dark:border-strokedark pb-4">
                        <p className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">ID</p>
                        <p className="text-lg text-gray-800 dark:text-white">{user.id}</p>
                    </div>

                    {/* Nombre */}
                    <div className="border-b border-stroke dark:border-strokedark pb-4">
                        <p className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Nombre</p>
                        <p className="text-lg text-gray-800 dark:text-white">{user.name}</p>
                    </div>

                    {/* Email */}
                    <div className="border-b border-stroke dark:border-strokedark pb-4">
                        <p className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</p>
                        <p className="text-lg text-gray-800 dark:text-white">{user.email}</p>
                    </div>

                    {/* Fecha de creación */}
                    {user.created_at && (
                        <div className="border-b border-stroke dark:border-strokedark pb-4">
                            <p className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Fecha de Creación</p>
                            <p className="text-lg text-gray-800 dark:text-white">
                                {new Date(user.created_at).toLocaleString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    )}

                    {/* Última actualización */}
                    {user.updated_at && (
                        <div className="border-b border-stroke dark:border-strokedark pb-4">
                            <p className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Última Actualización</p>
                            <p className="text-lg text-gray-800 dark:text-white">
                                {new Date(user.updated_at).toLocaleString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    )}
                </div>

                {/* Botones de acción */}
                <div className="flex gap-4 mt-8">
                    <button
                        onClick={() => navigate(`/users/update/${user.id}`)}
                        style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                        className="py-2 px-6 font-semibold rounded-md hover:opacity-90"
                    >
                        Editar Usuario
                    </button>
                    <button
                        onClick={() => navigate("/users")}
                        style={{ backgroundColor: '#6b7280', color: '#ffffff' }}
                        className="py-2 px-6 font-semibold rounded-md hover:opacity-90"
                    >
                        Volver a la lista
                    </button>
                </div>
            </div>
        </>
    );

    // ============ RENDER MATERIAL UI ============
    const renderMaterialUI = () => (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ 
                bgcolor: 'background.default',
                minHeight: '100vh',
                pb: 3,
                '& *': {
                    color: colorMode === 'light' ? 'inherit' : undefined,
                }
            }}>
                <Breadcrumb pageName="Ver Usuario" />
                <Box sx={{ px: 3 }}>
                    <Paper 
                        sx={{ 
                            p: 3, 
                            bgcolor: 'background.paper',
                            color: 'text.primary'
                        }}
                    >
                        <Typography variant="h4" component="h2" fontWeight="bold" mb={3}>
                            Información del Usuario
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* ID */}
                        <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>ID</Typography>
                            <Typography variant="h6">{user.id}</Typography>
                            <Divider sx={{ mt: 1 }} />
                        </Box>

                        {/* Nombre */}
                        <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>Nombre</Typography>
                            <Typography variant="h6">{user.name}</Typography>
                            <Divider sx={{ mt: 1 }} />
                        </Box>

                        {/* Email */}
                        <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>Email</Typography>
                            <Typography variant="h6">{user.email}</Typography>
                            <Divider sx={{ mt: 1 }} />
                        </Box>

                        {/* Fecha de creación */}
                        {user.created_at && (
                            <Box>
                                <Typography variant="body2" color="text.secondary" gutterBottom>Fecha de Creación</Typography>
                                <Typography variant="h6">
                                    {new Date(user.created_at).toLocaleString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </Typography>
                                <Divider sx={{ mt: 1 }} />
                            </Box>
                        )}

                        {/* Última actualización */}
                        {user.updated_at && (
                            <Box>
                                <Typography variant="body2" color="text.secondary" gutterBottom>Última Actualización</Typography>
                                <Typography variant="h6">
                                    {new Date(user.updated_at).toLocaleString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </Typography>
                                <Divider sx={{ mt: 1 }} />
                            </Box>
                        )}
                    </Box>

                    {/* Botones de acción */}
                    <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => navigate(`/users/update/${user.id}`)}
                        >
                            Editar Usuario
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/users")}
                        >
                            Volver a la lista
                        </Button>
                    </Box>
                </Paper>
                </Box>
            </Box>
        </ThemeProvider>
    );

    return (
        <div>
            {/* Selector de UI Mode */}
            <div className="mb-6 flex justify-end gap-3">
                <button
                    onClick={() => setUiMode("tailwind")}
                    className={`rounded px-4 py-2 font-medium transition-colors ${
                        uiMode === "tailwind"
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-black hover:bg-gray-300 dark:bg-meta-4 dark:text-white"
                    }`}
                >
                    Tailwind
                </button>
                <button
                    onClick={() => setUiMode("material")}
                    className={`rounded px-4 py-2 font-medium transition-colors ${
                        uiMode === "material"
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-black hover:bg-gray-300 dark:bg-meta-4 dark:text-white"
                    }`}
                >
                    Material UI
                </button>
            </div>

            {/* Renderizado condicional */}
            {uiMode === "tailwind" ? renderTailwind() : renderMaterialUI()}
        </div>
    );
};

export default ViewUserPage;
