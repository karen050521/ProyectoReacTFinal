import axios from "axios";

// Lista de rutas que no deben ser interceptadas
const EXCLUDED_ROUTES = ["/login", "/register"];

const api = axios.create({
    baseURL: (import.meta as any).env.VITE_API_URL, // Cambia la URL base según tu API
    headers: { "Content-Type": "application/json" },
});

// Interceptor de solicitud
api.interceptors.request.use(
    (config) => {
        // Verificar si la URL está en la lista de excluidas
        if (EXCLUDED_ROUTES.some((route) => config.url?.includes(route))) {
            return config;
        }
        
        // Intentar obtener token de sesión
        const sessionToken = localStorage.getItem("session");
        if (sessionToken) {
            console.log("🔑 Agregando token de sesión:", sessionToken.substring(0, 20) + "...");
            config.headers.Authorization = `Bearer ${sessionToken}`;
            return config;
        }
        
        // Fallback: intentar obtener token del usuario (legacy)
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userToken = user["token"];
        if (userToken) {
            console.log("🔑 Agregando token del usuario:", userToken.substring(0, 20) + "...");
            config.headers.Authorization = `Bearer ${userToken}`;
            return config;
        }
        
        console.warn("⚠️ No se encontró token de autenticación");
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de respuesta
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            console.log("No autorizado, redirigiendo a login...");
            window.location.href = "/login"; // Redirigir si la sesión expira
        }
        return Promise.reject(error);
    }
);

export { api };
export default api;
