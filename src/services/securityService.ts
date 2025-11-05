import { User } from "../models/user";
import { store } from "../store/store";
import { setUser } from "../store/userSlice";

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
            this.user = {} as User;
        }
    }

    async login(user: User) {
        console.log("llamando api " + `${this.API_URL}/login`)
        try {

            const response = await fetch(`${this.API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            // Guardamos el objeto user completo
            localStorage.setItem("user", JSON.stringify(data));
            // Si la respuesta incluye token, guardarlo también en la clave de sesión
            if (data && (data as any).token) {
                try {
                    localStorage.setItem(this.keySession, (data as any).token);
                } catch (e) {
                    console.warn('No se pudo guardar session token en localStorage', e);
                }
            }
            // Actualizamos el user en memoria si viene en la respuesta
            if (data && (data as any).user) {
                this.user = (data as any).user as User;
            } else {
                // Si el servicio devuelve directamente el user en data
                this.user = data as User;
            }
            store.dispatch(setUser(data));
            return data;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }
    getUser() {
        return this.user;
    }
    logout() {
        this.user = {} as User;
        localStorage.removeItem("user");
        localStorage.removeItem(this.keySession);
        this.dispatchEvent(new CustomEvent("userChange", { detail: null }));
    }

    isAuthenticated() {
        return localStorage.getItem(this.keySession) !== null;
    }

    getToken() {
        return localStorage.getItem(this.keySession);
    }
}

export default new SecurityService();
