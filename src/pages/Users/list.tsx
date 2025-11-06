import React, { useEffect, useState, useMemo } from "react";
import GenericTable from "../../components/GenericTable";
import { User } from "../../models/user";
import {userService} from "../../services/userService";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
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

const ListUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [uiMode, setUiMode] = useState<UIMode>("tailwind");
    const [colorMode] = useColorMode();
    const navigate = useNavigate();

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

        fetchData();
        console.log("Users fetched:", users);
    }, []);

    const fetchData = async () => {
        try {
            const users = await userService.getUsers();
            setUsers(users);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleAction = (action: string, item: User) => {
        if (action === "view") {
            navigate(`/users/view/${item.id}`);
        } else if (action === "edit") {
            console.log("Edit user:", item);
            navigate(`/users/update/${item.id}`);
        } else if (action === "delete") {
            console.log("Delete user:", item);
            Swal.fire({
                title: "Eliminación",
                text: "Está seguro de querer eliminar el registro?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, eliminar",
                cancelButtonText: "No"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const success = await userService.deleteUser(Number(item.id!));
                    if (success) {
                        Swal.fire({
                            title: "Eliminado",
                            text: "El registro se ha eliminado",
                            icon: "success"
                        });
                    }
                    // 🔹 Vuelve a obtener los usuarios después de eliminar uno
                    fetchData();
                }
            });
        } else if (action === "profile") {
            navigate(`/profiles/user/${item.id}`);
        } else if (action === "address") {
            navigate(`/addresses/user/${item.id}`);
        } else if (action === "signature") {
            navigate(`/signatures/user/${item.id}`);
        } else if (action === "devices") {
            navigate(`/devices/user/${item.id}`);
        } else if (action === "passwords") {
            navigate(`/passwords/user/${item.id}`);
        } else if (action === "sessions") {
            navigate(`/sessions/user/${item.id}`);
        }
    };

    // ============ RENDER TAILWIND ============
    const renderTailwind = () => (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">User List</h2>
                <button
                    onClick={() => navigate("/users/create")}
                    style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                    className="py-2 px-6 font-semibold rounded-md hover:opacity-90 flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Nuevo Usuario
                </button>
            </div>
            <GenericTable
                data={users}
                columns={["id", "name", "email"]}
                actions={[
                    { name: "view", label: "View" },
                    { name: "profile", label: "Profile" },
                    { name: "address", label: "Address" },
                    { name: "signature", label: "Signature" },
                    { name: "devices", label: "Devices" },
                    { name: "passwords", label: "Passwords" },
                    { name: "sessions", label: "Sessions" },
                    { name: "edit", label: "Edit" },
                    { name: "delete", label: "Delete" },
                ]}
                onAction={handleAction}
            />
        </div>
    );

    // ============ RENDER MATERIAL UI ============
    const renderMaterialUI = () => (
        <ThemeProvider theme={theme}>
            <Box sx={{ 
                p: 3, 
                bgcolor: 'background.default',
                minHeight: '100vh',
                color: 'text.primary'
            }}>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" component="h2" fontWeight="bold">
                        User List
                    </Typography>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => navigate("/users/create")}
                    >
                        Nuevo Usuario
                    </Button>
                </Box>
                
                <TableContainer 
                    component={Paper} 
                    sx={{ 
                        bgcolor: 'background.paper',
                        color: 'text.primary'
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>ID</strong></TableCell>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Email</strong></TableCell>
                                <TableCell align="center"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} hover>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                                            <Chip
                                                label="View"
                                                size="small"
                                                color="info"
                                                onClick={() => handleAction("view", user)}
                                                clickable
                                            />
                                            <Chip
                                                label="Profile"
                                                size="small"
                                                color="primary"
                                                onClick={() => handleAction("profile", user)}
                                                clickable
                                            />
                                            <Chip
                                                label="Address"
                                                size="small"
                                                color="secondary"
                                                onClick={() => handleAction("address", user)}
                                                clickable
                                            />
                                            <Chip
                                                label="Signature"
                                                size="small"
                                                color="default"
                                                onClick={() => handleAction("signature", user)}
                                                clickable
                                            />
                                            <Chip
                                                label="Devices"
                                                size="small"
                                                color="default"
                                                onClick={() => handleAction("devices", user)}
                                                clickable
                                            />
                                            <Chip
                                                label="Passwords"
                                                size="small"
                                                color="warning"
                                                onClick={() => handleAction("passwords", user)}
                                                clickable
                                            />
                                            <Chip
                                                label="Sessions"
                                                size="small"
                                                color="info"
                                                onClick={() => handleAction("sessions", user)}
                                                clickable
                                            />
                                            <Chip
                                                label="Edit"
                                                size="small"
                                                color="primary"
                                                onClick={() => handleAction("edit", user)}
                                                clickable
                                            />
                                            <Chip
                                                label="Delete"
                                                size="small"
                                                color="error"
                                                onClick={() => handleAction("delete", user)}
                                                clickable
                                            />
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </ThemeProvider>
    );

    return (
        <div>
            {/* Selector de UI Mode */}
            <div className="mb-6 flex justify-end gap-3 p-6 pb-0">
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

export default ListUsers;