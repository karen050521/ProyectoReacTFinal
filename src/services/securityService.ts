import { User } from "../models/user";
import { store } from "../store/store";
import { setUser } from "../store/userSlice";

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
            
            return data;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }

    // Nuevo método para login con Firebase OAuth
    async loginWithFirebase(firebaseUser: any) {
        console.log("🔥 Enviando usuario de Firebase al backend...");
        try {
            const firebaseToken = await firebaseUser.getIdToken();
            
            const response = await fetch(`${this.API_URL}/auth/firebase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${firebaseToken}`
                },
                body: JSON.stringify({
                    firebase_uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName,
                    photo_url: firebaseUser.photoURL
                }),
            });

            if (!response.ok) {
                throw new Error('Firebase authentication with backend failed');
            }

            const data = await response.json();
            
            // Guardar usuario y token del backend
            localStorage.setItem("user", JSON.stringify(data.user || data));
            
            if (data.token) {
                localStorage.setItem(this.keySession, data.token);
                console.log("✅ Token del backend guardado después de Firebase OAuth");
            }
            
            store.dispatch(setUser(data.user || data));
            
            return data;
        } catch (error) {
            console.error('Error during Firebase backend integration:', error);
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
