import { useEffect, useState } from "react";
import { Password } from "../../models/Password";
import { passwordService } from "../../services/passwordService";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Box,
    ThemeProvider,
    createTheme,
    Chip,
} from "@mui/material";
import useColorMode from "../../hooks/useColorMode";

type UIMode = "tailwind" | "material";

const ListPasswords = () => {
    const [passwords, setPasswords] = useState<Password[]>([]);
    const [loading, setLoading] = useState(true);
    const [uiMode, setUiMode] = useState<UIMode>("tailwind");
    const [colorMode] = useColorMode();
    const navigate = useNavigate();

    const theme = createTheme({
        palette: {
            mode: colorMode === 'dark' ? 'dark' : 'light',
        },
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const passwordsData = await passwordService.getPasswords();
            console.debug('Password.list fetchData -> received', passwordsData);
            setPasswords(passwordsData);
        } catch (error) {
            console.error("Error fetching passwords:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (password: Password) => {
        Swal.fire({
            title: "Eliminación",
            text: "¿Está seguro de querer eliminar esta contraseña?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "No"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const success = await passwordService.deletePassword(password.id!);
                if (success) {
                    Swal.fire({
                        title: "Eliminado",
                        text: "La contraseña se ha eliminado",
                        icon: "success"
                    });
                    fetchData();
                }
            }
        });
    };

    // ============ RENDER TAILWIND ============
    const renderTailwind = () => (
        <>
            <Breadcrumb pageName="Contraseñas" />
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="px-4 py-6 md:px-6 xl:px-7.5 flex justify-between items-center">
                    <h4 className="text-xl font-semibold text-black dark:text-white">
                        Todas las Contraseñas
                    </h4>
                    <button
                        onClick={() => navigate("/passwords/create")}
                        className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
                    >
                        Nueva Contraseña
                    </button>
                </div>

                {loading ? (
                    <div className="p-10 text-center">
                        <p className="text-black dark:text-white">Cargando...</p>
                    </div>
                ) : passwords.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        No hay contraseñas registradas
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <th className="px-4 py-4 font-medium text-black dark:text-white">
                                        ID
                                    </th>
                                    <th className="px-4 py-4 font-medium text-black dark:text-white">
                                        Usuario ID
                                    </th>
                                    <th className="px-4 py-4 font-medium text-black dark:text-white">
                                        Contenido
                                    </th>
                                    <th className="px-4 py-4 font-medium text-black dark:text-white">
                                        Inicio
                                    </th>
                                    <th className="px-4 py-4 font-medium text-black dark:text-white">
                                        Fin
                                    </th>
                                    <th className="px-4 py-4 font-medium text-black dark:text-white text-center">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {passwords.map((password) => (
                                    <tr
                                        key={password.id}
                                        className="border-b border-[#eee] dark:border-strokedark"
                                    >
                                        <td className="px-4 py-5 text-black dark:text-white">
                                            {password.id}
                                        </td>
                                        <td className="px-4 py-5 text-black dark:text-white">
                                            {password.user_id}
                                        </td>
                                        <td className="px-4 py-5 font-mono text-black dark:text-white">
                                            {'•'.repeat(8)}
                                        </td>
                                        <td className="px-4 py-5 text-black dark:text-white">
                                            {password.startAt
                                                ? new Date(password.startAt).toLocaleDateString()
                                                : 'N/A'}
                                        </td>
                                        <td className="px-4 py-5 text-black dark:text-white">
                                            {password.endAt
                                                ? new Date(password.endAt).toLocaleDateString()
                                                : 'N/A'}
                                        </td>
                                        <td className="px-4 py-5">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        navigate(`/passwords/update/${password.id}`)
                                                    }
                                                    className="hover:text-primary text-blue-600 dark:text-blue-400 font-medium"
                                                >
                                                    Ver
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(password)}
                                                    className="hover:text-danger text-red-600 dark:text-red-400 font-medium"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );

    // ============ RENDER MATERIAL UI ============
    const renderMaterialUI = () => (
        <ThemeProvider theme={theme}>
            <>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Contraseñas
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Gestión de todas las contraseñas del sistema
                    </Typography>
                </Box>

                <Paper sx={{ p: 3 }}>
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">Todas las Contraseñas</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate("/passwords/create")}
                        >
                            Nueva Contraseña
                        </Button>
                    </Box>

                    {loading ? (
                        <Typography textAlign="center" py={5}>
                            Cargando...
                        </Typography>
                    ) : passwords.length === 0 ? (
                        <Typography color="text.secondary" textAlign="center" py={5}>
                            No hay contraseñas registradas
                        </Typography>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>ID</strong></TableCell>
                                        <TableCell><strong>Usuario ID</strong></TableCell>
                                        <TableCell><strong>Contenido</strong></TableCell>
                                        <TableCell><strong>Inicio</strong></TableCell>
                                        <TableCell><strong>Fin</strong></TableCell>
                                        <TableCell align="center"><strong>Acciones</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {passwords.map((password) => (
                                        <TableRow key={password.id} hover>
                                            <TableCell>{password.id}</TableCell>
                                            <TableCell>{password.user_id}</TableCell>
                                            <TableCell>
                                                <Box component="span" sx={{ fontFamily: 'monospace' }}>
                                                    {'•'.repeat(8)}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                {password.startAt
                                                    ? new Date(password.startAt).toLocaleDateString()
                                                    : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {password.endAt
                                                    ? new Date(password.endAt).toLocaleDateString()
                                                    : 'N/A'}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                    <Chip
                                                        label="Ver"
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => navigate(`/passwords/update/${password.id}`)}
                                                        clickable
                                                    />
                                                    <Chip
                                                        label="Eliminar"
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDelete(password)}
                                                        clickable
                                                    />
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            </>
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

export default ListPasswords;