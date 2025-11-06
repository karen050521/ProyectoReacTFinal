import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getSessionById, updateSession } from "../../services/sessionService";
import Swal from "sweetalert2";

import { Session } from '../../models/Session';
import SessionFormValidator from '../../components/session/sessionForm';
import Breadcrumb from "../../components/Breadcrumb";
import useColorMode from '../../hooks/useColorMode';

// Material UI imports
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, Paper } from '@mui/material';

type UIMode = "tailwind" | "material";

const UpdateSessionPage = () => {
    const { id } = useParams(); // Obtener el ID de la URL
    
    const navigate = useNavigate();
    const [session, setSession] = useState<Session | null>(null);
    const [uiMode, setUiMode] = useState<UIMode>("tailwind");
    const [colorMode] = useColorMode();

    // Material UI theme
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: colorMode === 'dark' ? 'dark' : 'light',
                    primary: {
                        main: colorMode === 'light' ? '#f59e0b' : '#3b82f6',
                    },
                    background: {
                        default: colorMode === 'light' ? '#fffbeb' : '#121212',
                        paper: colorMode === 'light' ? '#fef3c7' : '#1e1e1e',
                    },
                },
            }),
        [colorMode]
    );

    // Cargar datos de la sesión después del montaje
    useEffect(() => {
        console.log("Id->"+id)
        const fetchSession = async () => {
            if (!id) return; // Evitar errores si el ID no está disponible
            const sessionData = await getSessionById(id);
            setSession(sessionData);
        };

        fetchSession();
    }, [id]);

    const handleUpdateSession = async (theSession: Session) => {
        try {
            const updatedSession = await updateSession(theSession.id || "", theSession);
            if (updatedSession) {
                Swal.fire({
                    title: "Completado",
                    text: "Se ha actualizado correctamente el registro",
                    icon: "success",
                    timer: 3000
                });
                navigate("/sessions"); // Redirección en React Router
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Existe un problema al momento de actualizar el registro",
                    icon: "error",
                    timer: 3000
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Existe un problema al momento de actualizar el registro",
                icon: "error",
                timer: 3000
            });
        }
    };

    if (!session) {
        return (
            <div className="bg-white dark:bg-boxdark rounded-lg shadow-md p-6">
                <div className="text-center text-gray-700 dark:text-gray-300">Cargando...</div>
            </div>
        );
    }

    const handleGoBack = () => {
        navigate("/sessions");
    };

    const renderTailwind = () => (
        <div className="bg-white dark:bg-boxdark rounded-lg shadow-md p-6">
            <SessionFormValidator
                handleUpdate={handleUpdateSession}
                mode={2} // 2 significa actualización
                session={session}
            />
        </div>
    );

    const renderMaterialUI = () => (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg">
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <SessionFormValidator
                        handleUpdate={handleUpdateSession}
                        mode={2} // 2 significa actualización
                        session={session}
                    />
                </Paper>
            </Container>
        </ThemeProvider>
    );

    return (
        <>
            <Breadcrumb pageName="Actualizar Sesión" />
            
            {/* Botón Volver y selector UI */}
            <div className="mb-6 flex flex-wrap gap-4 justify-between items-center">
                <button
                    onClick={handleGoBack}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-center font-medium text-white hover:bg-opacity-90 dark:bg-meta-4 dark:hover:bg-opacity-90"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver
                </button>

                <div className="flex gap-2">
                    <button
                        onClick={() => setUiMode("tailwind")}
                        className={`rounded px-4 py-2 font-medium transition-colors ${
                            uiMode === "tailwind"
                                ? "bg-primary text-white dark:bg-meta-4"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-meta-3 dark:text-white dark:hover:bg-meta-4"
                        }`}
                    >
                        Tailwind
                    </button>
                    <button
                        onClick={() => setUiMode("material")}
                        className={`rounded px-4 py-2 font-medium transition-colors ${
                            uiMode === "material"
                                ? "bg-primary text-white dark:bg-meta-4"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-meta-3 dark:text-white dark:hover:bg-meta-4"
                        }`}
                    >
                        Material UI
                    </button>
                </div>
            </div>

            {/* Renderizado condicional */}
            {uiMode === "tailwind" ? renderTailwind() : renderMaterialUI()}
        </>
    );
};

export default UpdateSessionPage;
