import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PasswordForm from '../../views/MaterialUI/PasswordViews/PasswordForm';
import Breadcrumb from '../../components/Breadcrumb';
import {
    ThemeProvider,
    createTheme,
} from "@mui/material";
import useColorMode from "../../hooks/useColorMode";

type UIMode = "tailwind" | "material";

/**
 * Página para crear una nueva contraseña
 * Muestra el formulario de creación de contraseñas
 */
const CreatePasswordPage: React.FC = () => {
    const [uiMode, setUiMode] = useState<UIMode>("material");
    const [colorMode] = useColorMode();
    const [searchParams] = useSearchParams();

    const theme = createTheme({
        palette: {
            mode: colorMode === 'dark' ? 'dark' : 'light',
        },
    });

    // Obtener userId de los query params si existe
    const userIdParam = searchParams.get('userId');
    
    useEffect(() => {
        // Si viene de userPasswords, usar Material UI por defecto
        if (userIdParam) {
            setUiMode("material");
        }
    }, [userIdParam]);

    // ============ RENDER TAILWIND ============
    const renderTailwind = () => (
        <>
            <Breadcrumb pageName="Nueva Contraseña" />
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Crear Nueva Contraseña</h2>
                <div className="bg-white dark:bg-boxdark">
                    <PasswordForm isEditMode={false} />
                </div>
            </div>
        </>
    );

    // ============ RENDER MATERIAL UI ============
    const renderMaterialUI = () => (
        <ThemeProvider theme={theme}>
            <PasswordForm isEditMode={false} />
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

export default CreatePasswordPage;