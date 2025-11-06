import { useState } from 'react';
import { useParams } from 'react-router-dom';
import PasswordForm from '../../views/MaterialUI/PasswordViews/PasswordForm';
import Breadcrumb from '../../components/Breadcrumb';
import {
    ThemeProvider,
    createTheme,
} from "@mui/material";
import useColorMode from "../../hooks/useColorMode";

type UIMode = "tailwind" | "material";

/**
 * Página para editar una contraseña existente
 * Muestra el formulario de edición con los datos cargados
 */
const UpdatePasswordPage: React.FC = () => {
    const [uiMode, setUiMode] = useState<UIMode>("material");
    const [colorMode] = useColorMode();
    const { id } = useParams<{ id: string }>();

    const theme = createTheme({
        palette: {
            mode: colorMode === 'dark' ? 'dark' : 'light',
        },
    });

    // ============ RENDER TAILWIND ============
    const renderTailwind = () => (
        <>
            <Breadcrumb pageName="Editar Contraseña" />
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                    Editar Contraseña #{id}
                </h2>
                <div className="bg-white dark:bg-boxdark">
                    <PasswordForm isEditMode={true} />
                </div>
            </div>
        </>
    );

    // ============ RENDER MATERIAL UI ============
    const renderMaterialUI = () => (
        <ThemeProvider theme={theme}>
            <PasswordForm isEditMode={true} />
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

export default UpdatePasswordPage;