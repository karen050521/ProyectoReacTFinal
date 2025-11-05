import { User } from "../models/user";
import { store } from "../store/store";
import { setUser } from "../store/userSlice";
import api from "../interceptors/axiosInterceptor";
import { UserStorageManager } from "../utils/userStorageManager";

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
        this.API_URL = (import.meta as any).env.VITE_API_URL_MOCK || ""; // Reemplaza con la URL real
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
            
            // 🔥 USAR EL NUEVO STORAGE MANAGER
            const userToStore = data.user || data;
            const token = data.token || data.access_token;
            
            if (token) {
                UserStorageManager.saveUser(userToStore, token);
                console.log("✅ Usuario y token guardados con UserStorageManager");
            } else {
                UserStorageManager.saveUser(userToStore);
                console.warn("⚠️ No se encontró token en la respuesta del backend");
            }
            
            // Actualizar Redux store
            store.dispatch(setUser(userToStore));
            
            // NOTIFICAR AL AuthContext QUE HAY NUEVA SESIÓN
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
        console.log("Integrando usuario de Firebase con backend...");
        
        // DEBUG: Verificar datos del usuario Firebase
        console.log("DEBUG: Datos recibidos de Firebase:", {
            uid: firebaseUser.id,
            email: firebaseUser.email,
            name: firebaseUser.name,
            displayName: firebaseUser.displayName
        });

        // VALIDACIÓN: Verificar que tenemos email
        if (!firebaseUser.email || firebaseUser.email.trim() === '') {
            console.error("CRÍTICO: Usuario Firebase sin email válido");
            throw new Error("Usuario Firebase no tiene email válido. Contacta soporte.");
        }

        try {
            // 1. Primero intentar crear usuario directamente (si existe, obtendremos error)
            let backendUser = null;
            
            console.log("Intentando crear/obtener usuario en backend...");
            const userData = {
                name: firebaseUser.displayName || firebaseUser.name || 'Usuario Firebase',
                email: firebaseUser.email,
                provider: 'google'
            };
            
            console.log("Datos para enviar al backend:", userData);
            
            try {
                // Intentar crear usuario
                const createUserResponse = await fetch(`${this.API_URL}/users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });
                
                if (createUserResponse.ok) {
                    backendUser = await createUserResponse.json();
                    console.log("Usuario creado en backend:", backendUser.id);
                } else if (createUserResponse.status === 400) {
                    // Usuario ya existe, buscar por email
                    console.log("Usuario ya existe, buscando por email...");
                    
                    const usersResponse = await fetch(`${this.API_URL}/users`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    });
                    
                    if (usersResponse.ok) {
                        const users = await usersResponse.json();
                        console.log("Usuarios obtenidos:", users.length);
                        
                        backendUser = users.find((user: any) => 
                            user.email === firebaseUser.email
                        );
                        
                        if (backendUser) {
                            console.log("Usuario existente encontrado:", backendUser.id);
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
                
                // 3. Guardar datos con UserStorageManager
                const userToStore = {
                    ...backendUser,
                    provider: 'google',
                    firebase_uid: firebaseUser.uid
                };
                
                UserStorageManager.saveUser(userToStore, sessionData_response.token);
                
                // 4. Actualizar Redux store
                store.dispatch(setUser(userToStore));
                
                // 5. Notificar al AuthContext
                window.dispatchEvent(new CustomEvent('authStateChanged', {
                    detail: { user: userToStore, token: sessionData_response.token }
                }));
                
                console.log("✅ Integración Firebase-Backend completada exitosamente");
                
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

    // Método para login con Microsoft MSAL usando endpoints existentes
    async loginWithMicrosoft(microsoftUser: any) {
        console.log("Integrando usuario de Microsoft con backend...");
        
        // DEBUG: Verificar datos del usuario Microsoft
        console.log("DEBUG: Datos recibidos de Microsoft:", {
            id: microsoftUser.id,
            email: microsoftUser.email,
            displayName: microsoftUser.displayName,
            userPrincipalName: microsoftUser.userPrincipalName
        });

        // VALIDACIÓN: Verificar que tenemos email
        const email = microsoftUser.email || microsoftUser.userPrincipalName;
        if (!email || email.trim() === '') {
            console.error("CRÍTICO: Usuario Microsoft sin email válido");
            throw new Error("Usuario Microsoft no tiene email válido. Contacta soporte.");
        }

        try {
            // 1. Primero intentar crear usuario directamente (si existe, obtendremos error)
            let backendUser = null;
            
            console.log("Intentando crear/obtener usuario en backend...");
            const userData = {
                name: microsoftUser.displayName || 'Usuario Microsoft',
                email: email,
                provider: 'microsoft'
            };
            
            console.log("Datos para enviar al backend:", userData);
            
            try {
                // Intentar crear usuario
                const createUserResponse = await fetch(`${this.API_URL}/users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });
                
                console.log("Respuesta creación usuario - Status:", createUserResponse.status);
                
                if (createUserResponse.ok) {
                    // Usuario creado exitosamente
                    backendUser = await createUserResponse.json();
                    console.log("✅ Usuario Microsoft creado en backend:", backendUser.id);
                } else if (createUserResponse.status === 409) {
                    // Usuario ya existe, buscarlo
                    console.log("Usuario ya existe, buscando por email...");
                    const findUserResponse = await fetch(`${this.API_URL}/users/email/${encodeURIComponent(email)}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    });
                    
                    if (findUserResponse.ok) {
                        backendUser = await findUserResponse.json();
                        console.log("✅ Usuario Microsoft encontrado en backend:", backendUser.id);
                    } else {
                        throw new Error(`No se pudo encontrar usuario existente: ${findUserResponse.status}`);
                    }
                } else {
                    throw new Error(`Error ${createUserResponse.status}: ${await createUserResponse.text()}`);
                }
                
            } catch (fetchError) {
                console.error("Error en creación/búsqueda de usuario:", fetchError);
                throw fetchError;
            }
            
            if (!backendUser) {
                throw new Error("No se pudo crear ni encontrar el usuario en el backend");
            }
            
            // 2. Crear sesión para el usuario (reutilizar lógica de Firebase)
            console.log("Creando sesión en backend...");
            
            const expirationDate = new Date();
            expirationDate.setHours(expirationDate.getHours() + 24);
            const expirationString = expirationDate.toISOString().slice(0, 19).replace('T', ' ');
            
            const sessionData = {
                state: 'active',
                expiration: expirationString
            };
            
            try {
                const sessionResponse = await api.post(
                    `/sessions/user/${backendUser.id}`,
                    sessionData
                );
                
                const sessionData_response = sessionResponse.data;
                console.log("Sesión Microsoft creada exitosamente. Token:", sessionData_response.token?.substring(0, 20) + "...");
                
                // 3. Guardar en localStorage
                const userToStore = {
                    ...backendUser,
                    provider: 'microsoft',
                    microsoftData: {
                        id: microsoftUser.id,
                        userPrincipalName: microsoftUser.userPrincipalName,
                        jobTitle: microsoftUser.jobTitle,
                        officeLocation: microsoftUser.officeLocation
                    }
                };
                
                UserStorageManager.saveUser(userToStore, sessionData_response.token);
                
                // 4. Actualizar store Redux
                store.dispatch(setUser(userToStore));
                this.user = userToStore;
                
                // 5. Emitir evento para AuthProvider
                window.dispatchEvent(new CustomEvent('authStateChanged', {
                    detail: { user: userToStore, token: sessionData_response.token }
                }));
                
                console.log("✅ Integración Microsoft-Backend completada exitosamente");
                
                return {
                    user: userToStore,
                    session: sessionData_response,
                    message: "Microsoft login integrado con backend"
                };
                
            } catch (sessionError) {
                console.error('Error específico creando sesión:', sessionError);
                const errorMessage = sessionError instanceof Error ? sessionError.message : String(sessionError);
                throw new Error(`Falló la creación de sesión: ${errorMessage}`);
            }
            
        } catch (error) {
            console.error('Error durante integración Microsoft-Backend:', error);
            throw error;
        }
    }
    getUser() {
        return this.user;
    }
    logout() {
        console.log("🔄 Iniciando logout completo...");
        
        // Limpiar usuario interno
        this.user = { name: '', email: '' } as User;
        
        // 🔥 USAR EL NUEVO STORAGE MANAGER PARA LIMPIEZA COMPLETA
        UserStorageManager.clearUser();
        
        // 🔥 LIMPIEZA ESPECÍFICA DE MICROSOFT/MSAL
        // MSAL guarda datos con prefijos específicos
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (
                key.startsWith('msal.') ||           // Cache de MSAL
                key.startsWith('msal-') ||           // Tokens MSAL
                key.includes('microsoft') ||         // Datos Microsoft
                key.includes('accessToken') ||       // Tokens de acceso
                key.includes('idToken') ||           // Tokens ID
                key.includes('refreshToken') ||      // Tokens refresh
                key.includes('azure') ||             // Datos Azure
                key.includes('graph')                // Datos Microsoft Graph
            )) {
                keysToRemove.push(key);
            }
        }
        
        // Remover todas las claves encontradas
        keysToRemove.forEach(key => {
            console.log(`🗑️ Removiendo clave: ${key}`);
            localStorage.removeItem(key);
        });
        
        // 🔥 LIMPIEZA ESPECÍFICA DE FIREBASE/GOOGLE
        const firebaseKeysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (
                key.startsWith('firebase:') ||       // Cache Firebase
                key.includes('google') ||            // Datos Google
                key.includes('gapi') ||              // Google API
                key.includes('oauth')                // OAuth tokens
            )) {
                firebaseKeysToRemove.push(key);
            }
        }
        
        firebaseKeysToRemove.forEach(key => {
            console.log(`🗑️ Removiendo clave Firebase: ${key}`);
            localStorage.removeItem(key);
        });
        
        // Limpiar Redux store
        store.dispatch(setUser(null));
        
        // Emitir evento de cambio
        this.dispatchEvent(new CustomEvent("userChange", { detail: null }));
        
        console.log("✅ Logout completo - LocalStorage limpiado");
        console.log("📊 Claves restantes en localStorage:", localStorage.length);
    }

    isAuthenticated() {
        return localStorage.getItem(this.keySession) !== null;
    }

    getToken() {
        return localStorage.getItem(this.keySession);
    }
}

export default new SecurityService();
