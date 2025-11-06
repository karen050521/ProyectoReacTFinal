import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Password } from "../../models/Password";
import { passwordService } from "../../services/passwordService";
import { getUserById } from "../../services/userService";
import { User } from "../../models/user";
import Swal from "sweetalert2";
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

const UserPasswordsPage = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState<Password[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [uiMode, setUiMode] = useState<UIMode>("tailwind");
    const [colorMode] = useColorMode();

    const theme = createTheme({
        palette: {
            mode: colorMode === 'dark' ? 'dark' : 'light',
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;
            
            setLoading(true);
            try {
                // Obtener usuario
                const userData = await getUserById(Number.parseInt(userId));
                setUser(userData);

                // Obtener passwords del usuario
                const allPasswords = await passwordService.getPasswords();
                const userPasswords = allPasswords.filter(
                    (pwd: Password) => pwd.user_id === Number.parseInt(userId)
                );
                setPasswords(userPasswords);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

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
                    // Recargar passwords
                    const allPasswords = await passwordService.getPasswords();
                    const userPasswords = allPasswords.filter(
                        (pwd: Password) => pwd.user_id === Number.parseInt(userId!)
                    );
                    setPasswords(userPasswords);
                }
            }
        });
    };

    if (loading) {
        return (
            <div className="p-6">
                <p className="text-gray-500 dark:text-gray-300">Cargando...</p>
            </div>
        );
    }

    // ============ RENDER TAILWIND ============
    const renderTailwind = () => (
        <>
            <Breadcrumb pageName={`Passwords - ${user?.name || 'Usuario'}`} />
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center">
                    <h3 className="font-medium text-black dark:text-white text-xl">
                        Contraseñas de {user?.name || 'Usuario'}
                    </h3>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate(`/passwords/create?userId=${userId}`)}
                            className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90"
                        >
                            Nueva Contraseña
                        </button>
                        <button
                            onClick={() => navigate("/users")}
                            className="inline-flex items-center justify-center rounded-md border border-stroke py-2 px-6 text-center font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                        >
                            Volver
                        </button>
                    </div>
                </div>

                <div className="p-6.5">
                    {passwords.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400">No hay contraseñas registradas para este usuario.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                        <th className="py-4 px-4 font-medium text-black dark:text-white">ID</th>
                                        <th className="py-4 px-4 font-medium text-black dark:text-white">Contenido</th>
                                        <th className="py-4 px-4 font-medium text-black dark:text-white">Inicio</th>
                                        <th className="py-4 px-4 font-medium text-black dark:text-white">Fin</th>
                                        <th className="py-4 px-4 font-medium text-black dark:text-white text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {passwords.map((password) => (
                                        <tr key={password.id} className="border-b border-stroke dark:border-strokedark">
                                            <td className="py-4 px-4 text-black dark:text-white">{password.id}</td>
                                            <td className="py-4 px-4 text-black dark:text-white">
                                                <span className="font-mono">{'•'.repeat(8)}</span>
                                            </td>
                                            <td className="py-4 px-4 text-black dark:text-white">
                                                {password.startAt ? new Date(password.startAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="py-4 px-4 text-black dark:text-white">
                                                {password.endAt ? new Date(password.endAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => navigate(`/passwords/update/${password.id}`)}
                                                        className="inline-flex items-center justify-center rounded bg-primary py-1.5 px-4 text-center font-medium text-white hover:bg-opacity-90"
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(password)}
                                                        className="inline-flex items-center justify-center rounded bg-danger py-1.5 px-4 text-center font-medium text-white hover:bg-opacity-90"
                                                    >
                                                        Delete
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
            </div>
        </>
    );

    // ============ RENDER MATERIAL UI ============
    const renderMaterialUI = () => (
        <ThemeProvider theme={theme}>
            <>
                <Breadcrumb pageName={`Passwords - ${user?.name || 'Usuario'}`} />
                <Paper sx={{ p: 3 }}>
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h4" component="h2" fontWeight="bold">
                            Contraseñas de {user?.name || 'Usuario'}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => navigate(`/passwords/create?userId=${userId}`)}
                            >
                                Nueva Contraseña
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate("/users")}
                            >
                                Volver
                            </Button>
                        </Box>
                    </Box>

                    {passwords.length === 0 ? (
                        <Typography color="text.secondary">
                            No hay contraseñas registradas para este usuario.
                        </Typography>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>ID</strong></TableCell>
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
                                            <TableCell>
                                                <Box component="span" sx={{ fontFamily: 'monospace' }}>
                                                    {'•'.repeat(8)}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                {password.startAt ? new Date(password.startAt).toLocaleDateString() : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {password.endAt ? new Date(password.endAt).toLocaleDateString() : 'N/A'}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                    <Chip
                                                        label="View"
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => navigate(`/passwords/update/${password.id}`)}
                                                        clickable
                                                    />
                                                    <Chip
                                                        label="Delete"
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

export default UserPasswordsPage;
