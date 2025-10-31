import { User } from "../models/user";
import { store } from "../store/store";
import { setUser } from "../store/userSlice";
import api from "../interceptors/axiosInterceptor";

// Interfaz específica para login
interface LoginCredentials {
    email: string;
    password: string;
}

class SecurityService extends EventTarget {
    keySession: string;
    API_URL: string;
    user: User;
    theAuthProvider:any;
    constructor() {
        super();

        this.keySession = 'session';
        this.API_URL = (import.meta as any).env.VITE_API_URL || ""; // Reemplaza con la URL real
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            this.user = JSON.parse(storedUser);
        } else {
            this.user = { name: '', email: '' } as User;
        }
    }

    async login(credentials: LoginCredentials) {
        console.log("llamando api " + `${this.API_URL}/login`)
        try {

            const response = await fetch(`${this.API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            
            // Guardar usuario y token por separado
            localStorage.setItem("user", JSON.stringify(data.user || data));
            
            // Guardar token de sesión si existe en la respuesta
            if (data.token) {
                localStorage.setItem(this.keySession, data.token);
                console.log("✅ Token guardado:", data.token);
            } else if (data.access_token) {
                localStorage.setItem(this.keySession, data.access_token);
                console.log("✅ Access token guardado:", data.access_token);
            } else {
                console.warn("⚠️ No se encontró token en la respuesta del backend");
            }
            
            // Actualizar Redux store
            store.dispatch(setUser(data.user || data));
            
            // 🔥 NOTIFICAR AL AuthContext QUE HAY NUEVA SESIÓN
            window.dispatchEvent(new CustomEvent('authStateChanged', {
                detail: { user: data.user || data, token: data.token || data.access_token }
            }));
            
            return data;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }

    // Método para login con Firebase OAuth usando endpoints existentes
    async loginWithFirebase(firebaseUser: any) {
        console.log("🔗 Integrando usuario de Firebase con backend...");
        
        // 🔍 DEBUG: Verificar datos del usuario Firebase
        console.log("🔍 DEBUG: Datos recibidos de Firebase:", {
            uid: firebaseUser.id,
            email: firebaseUser.email,
            name: firebaseUser.name,
            displayName: firebaseUser.displayName
        });

        // 🚨 VALIDACIÓN: Verificar que tenemos email
        if (!firebaseUser.email || firebaseUser.email.trim() === '') {
            console.error("❌ CRÍTICO: Usuario Firebase sin email válido");
            throw new Error("Usuario Firebase no tiene email válido. Contacta soporte.");
        }

        try {
            // 1. Primero intentar crear usuario directamente (si existe, obtendremos error)
            let backendUser = null;
            
            console.log("🔗 Intentando crear/obtener usuario en backend...");
            const userData = {
                name: firebaseUser.displayName || firebaseUser.name || 'Usuario Firebase',
                email: firebaseUser.email,
                provider: 'google'
            };
            
            console.log("🔍 Datos para enviar al backend:", userData);
            
            try {
                // Intentar crear usuario
                const createUserResponse = await fetch(`${this.API_URL}/users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });
                
                if (createUserResponse.ok) {
                    backendUser = await createUserResponse.json();
                    console.log(" Usuario creado en backend:", backendUser.id);
                } else if (createUserResponse.status === 400) {
                    // Usuario ya existe, buscar por email
                    console.log(" Usuario ya existe, buscando por email...");
                    
                    const usersResponse = await fetch(`${this.API_URL}/users`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    });
                    
                    if (usersResponse.ok) {
                        const users = await usersResponse.json();
                        console.log("📋 Usuarios obtenidos:", users.length);
                        
                        backendUser = users.find((user: any) => 
                            user.email === firebaseUser.email
                        );
                        
                        if (backendUser) {
                            console.log("✅ Usuario existente encontrado:", backendUser.id);
                        } else {
                            throw new Error("Usuario existe pero no se pudo encontrar por email");
                        }
                    } else {
                        throw new Error("No se pudo obtener lista de usuarios");
                    }
                } else {
                    const errorData = await createUserResponse.json();
                    throw new Error(`Error del servidor: ${errorData.error || createUserResponse.statusText}`);
                }
                
            } catch (fetchError) {
                console.error("Error en creación/búsqueda de usuario:", fetchError);
                throw fetchError;
            }
            
            if (!backendUser) {
                throw new Error("No se pudo crear ni encontrar el usuario en el backend");
            }
            
            // 2. Crear sesión para el usuario
            console.log("Creando sesión en backend...");
            console.log("URL de sesión:", `${this.API_URL}/sessions/user/${backendUser.id}`);
            console.log("User ID:", backendUser.id);
            
            // Primero probar conectividad básica del backend
            try {
                console.log("Probando conectividad con backend...");
                const testResponse = await fetch(`${this.API_URL}/users`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                console.log("Conectividad backend OK, status:", testResponse.status);
            } catch (connectError) {
                console.error("Error de conectividad backend:", connectError);
                throw new Error("Backend no está disponible");
            }
            
            // Crear fecha de expiración (24 horas desde ahora) en formato string
            const expirationDate = new Date();
            expirationDate.setHours(expirationDate.getHours() + 24);
            const expirationString = expirationDate.toISOString().slice(0, 19).replace('T', ' ');
            
            const sessionData = {
                state: 'active',
                expiration: expirationString  // Formato: "YYYY-MM-DD HH:MM:SS"
                // token se generará automáticamente en el backend
            };
            
            console.log("Enviando datos de sesión:", sessionData);
            
            try {
                // Usar el interceptor axios del proyecto para mejor manejo de CORS
                const sessionResponse = await api.post(
                    `/sessions/user/${backendUser.id}`,
                    sessionData
                );
                
                console.log("Respuesta de sesión status:", sessionResponse.status);
                console.log("Respuesta de sesión ok:", sessionResponse.status === 200 || sessionResponse.status === 201);
                
                const sessionData_response = sessionResponse.data;
                console.log("Sesión creada exitosamente. Token:", sessionData_response.token?.substring(0, 20) + "...");
                
                if (!sessionData_response.token) {
                    throw new Error("No se recibió token en la respuesta de sesión");
                }
                
                // 3. Guardar datos en localStorage
                const userToStore = {
                    ...backendUser,
                    provider: 'google',
                    firebase_uid: firebaseUser.uid
                };
                
                localStorage.setItem("user", JSON.stringify(userToStore));
                localStorage.setItem(this.keySession, sessionData_response.token);
                
                // 4. Actualizar Redux store
                store.dispatch(setUser(userToStore));
                
                // 5. Notificar al AuthContext
                window.dispatchEvent(new CustomEvent('authStateChanged', {
                    detail: { user: userToStore, token: sessionData_response.token }
                }));
                
                console.log("Integración Firebase-Backend completada exitosamente");
                
                return {
                    user: userToStore,
                    session: sessionData_response,
                    message: "Firebase login integrado con backend"
                };
                
            } catch (sessionError) {
                console.error('Error específico creando sesión:', sessionError);
                const errorMessage = sessionError instanceof Error ? sessionError.message : String(sessionError);
                throw new Error(`Falló la creación de sesión: ${errorMessage}`);
            }
            
        } catch (error) {
            console.error('Error durante integración Firebase-Backend:', error);
            throw error;
        }
    }
    getUser() {
        return this.user;
    }
    logout() {
        this.user = { name: '', email: '' } as User;
        localStorage.removeItem("user");
        localStorage.removeItem(this.keySession); // Limpiar token de sesión
        store.dispatch(setUser(null)); // Limpiar Redux store
        this.dispatchEvent(new CustomEvent("userChange", { detail: null }));
        console.log("✅ Usuario deslogueado y token eliminado");
    }

    isAuthenticated() {
        return localStorage.getItem(this.keySession) !== null;
    }

    getToken() {
        return localStorage.getItem(this.keySession);
    }
}

export default new SecurityService();
