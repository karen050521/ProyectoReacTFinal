"use client"
import { useState } from 'react';
import { User } from '../../models/user';
import UserFormValidator from '../../components/Users/UserFormValidator'; 

import Swal from 'sweetalert2';
import  { createUser }  from "../../services/userService";
import Breadcrumb from '../../components/Breadcrumb';
import { useNavigate } from "react-router-dom";
import {
    Paper,
    Typography,
    ThemeProvider,
    createTheme,
} from "@mui/material";

type UIMode = "tailwind" | "material";

const App = () => {
    const navigate = useNavigate();
    const [uiMode, setUiMode] = useState<UIMode>("tailwind");

    const theme = createTheme({
        palette: {
            mode: 'light',
        },
    });

    // Lógica de creación
    const handleCreateUser = async (user: User) => {

        try {
            const createdUser = await createUser(user);
            if (createdUser) {
                Swal.fire({
                    title: "Completado",
                    text: "Se ha creado correctamente el registro",
                    icon: "success",
                    timer: 3000
                })
                console.log("Usuario creado con éxito:", createdUser);
                navigate("/users");
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Existe un problema al momento de crear el registro",
                    icon: "error",
                    timer: 3000
                })
            }
        } catch (error) {
            console.error("Error creating user:", error);
            Swal.fire({
                title: "Error",
                text: "Existe un problema al momento de crear el registro",
                icon: "error",
                timer: 3000
            })
        }
    };
    // ============ RENDER TAILWIND ============
    const renderTailwind = () => (
        <>
            <Breadcrumb pageName="Crear Usuario" />
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Crear Nuevo Usuario</h2>
                <UserFormValidator
                    handleCreate={handleCreateUser}
                    mode={1} // 1 significa creación
                />
            </div>
        </>
    );

    // ============ RENDER MATERIAL UI ============
    const renderMaterialUI = () => (
        <ThemeProvider theme={theme}>
            <>
                <Breadcrumb pageName="Crear Usuario" />
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h4" component="h2" fontWeight="bold" mb={3}>
                        Crear Nuevo Usuario
                    </Typography>
                    <UserFormValidator
                        handleCreate={handleCreateUser}
                        mode={1} // 1 significa creación
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

export default App;
