import React, { useEffect, useState, useMemo } from "react";
import GenericTable from "../../components/GenericTable";
import { Role } from "../../models/Role";
import {roleService} from "../../services/roleService";

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

const ListRoles: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);
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
    }, []);

    const fetchData = async () => {
        try {
            const roles = await roleService.getRoles();
            setRoles(roles);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const handleAction = (action: string, item: Role) => {
        if (action === "edit") {
            console.log("Edit role:", item);
            navigate(`/roles/update/${item.id}`);
        } else if (action === "permissions") {
            console.log("Manage permissions for role:", item);
            navigate(`/role-permissions/manage/${item.id}`);
        } else if (action === "delete") {
            console.log("Delete role :", item);
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
                    const success = await roleService.deleteRole(item.id!);
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
        }
    };

    // ============ RENDER TAILWIND ============
    const renderTailwind = () => (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Role List</h2>
                <button
                    onClick={() => navigate("/roles/create")}
                    style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                    className="py-2 px-6 font-semibold rounded-md hover:opacity-90 flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Nuevo Rol
                </button>
            </div>
            <GenericTable
                data={roles}
                columns={["id", "name", "description"]}
                actions={[
                    { name: "edit", label: "Edit" },
                    { name: "permissions", label: "Permissions" },
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
                        Role List
                    </Typography>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => navigate("/roles/create")}
                    >
                        Nuevo Rol
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
                                <TableCell><strong>Description</strong></TableCell>
                                <TableCell align="center"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {roles.map((role) => (
                                <TableRow key={role.id} hover>
                                    <TableCell>{role.id}</TableCell>
                                    <TableCell>{role.name}</TableCell>
                                    <TableCell>{role.description}</TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                                            <Chip
                                                label="Edit"
                                                size="small"
                                                color="primary"
                                                onClick={() => handleAction("edit", role)}
                                                clickable
                                            />
                                            <Chip
                                                label="Permissions"
                                                size="small"
                                                color="info"
                                                onClick={() => handleAction("permissions", role)}
                                                clickable
                                            />
                                            <Chip
                                                label="Delete"
                                                size="small"
                                                color="error"
                                                onClick={() => handleAction("delete", role)}
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

export default ListRoles;