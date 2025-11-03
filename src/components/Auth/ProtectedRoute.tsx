import { Navigate, Outlet } from "react-router-dom";
import { useIsAuthenticated } from "@azure/msal-react";

// Función para verificar si el usuario está autenticado con el sistema tradicional
const isTraditionalAuth = () => {
    const user = localStorage.getItem("user");
    return !!user;
};

// Componente de Ruta Protegida
const ProtectedRoute = () => {
    // Verificar autenticación de Microsoft
    const isMicrosoftAuth = useIsAuthenticated();
    
    // Verificar autenticación tradicional
    const isTraditionalAuthenticated = isTraditionalAuth();
    
    // Permitir acceso si está autenticado con cualquiera de los dos métodos
    const isAuthenticated = isMicrosoftAuth || isTraditionalAuthenticated;
    
    return isAuthenticated ? <Outlet /> : <Navigate to="/auth/signin" replace />;
};

export default ProtectedRoute;
