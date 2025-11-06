import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getUserById, updateUser } from "../../services/userService";
import Swal from "sweetalert2";

import { User } from '../../models/user';
import UserFormValidator from '../../components/Users/UserFormValidator';
import Breadcrumb from "../../components/Breadcrumb";
import {
    Paper,
    Typography,
    ThemeProvider,
    createTheme,
} from "@mui/material";

type UIMode = "tailwind" | "material";

const UpdateUserPage = () => {
    const { id } = useParams(); // Obtener el ID de la URL
    
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [uiMode, setUiMode] = useState<UIMode>("tailwind");

    const theme = createTheme({
        palette: {
            mode: 'light',
        },
    });

    // Cargar datos del usuario después del montaje
    useEffect(() => {
        console.log("Id->"+id)
        const fetchUser = async () => {
            if (!id) return; // Evitar errores si el ID no está disponible
            const userData = await getUserById(Number.parseInt(id));
            setUser(userData);
        };

        fetchUser();
    }, [id]);

    const handleUpdateUser = async (theUser: User) => {
        try {
            const updatedUser = await updateUser(Number(theUser.id) || 0, theUser);
            if (updatedUser) {
                Swal.fire({
                    title: "Completado",
                    text: "Se ha actualizado correctamente el registro",
                    icon: "success",
                    timer: 3000
                });
                navigate("/users"); // Redirección en React Router
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Existe un problema al momento de actualizar el registro",
                    icon: "error",
                    timer: 3000
                });
            }
        } catch (error) {
            console.error("Error updating user:", error);
            Swal.fire({
                title: "Error",
                text: "Existe un problema al momento de actualizar el registro",
                icon: "error",
                timer: 3000
            });
        }
    };

    if (!user) {
        return (
            <div className="p-6">
                <p className="text-gray-500 dark:text-gray-300">Cargando...</p>
            </div>
        );
    }

    // ============ RENDER TAILWIND ============
    const renderTailwind = () => (
        <>
            <Breadcrumb pageName="Actualizar Usuario" />
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Actualizar Usuario</h2>
                <UserFormValidator
                    handleUpdate={handleUpdateUser}
                    mode={2} // 2 significa actualización
                    user={user}
                />
            </div>
        </>
    );

    // ============ RENDER MATERIAL UI ============
    const renderMaterialUI = () => (
        <ThemeProvider theme={theme}>
            <>
                <Breadcrumb pageName="Actualizar Usuario" />
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h4" component="h2" fontWeight="bold" mb={3}>
                        Actualizar Usuario
                    </Typography>
                    <UserFormValidator
                        handleUpdate={handleUpdateUser}
                        mode={2} // 2 significa actualización
                        user={user}
                    />
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

export default UpdateUserPage;
