import axios from "axios";
import type { Session } from "../models/Session";

const API_URL = import.meta.env.VITE_API_URL + "/sessions" || "";

class SessionService {
    async getSessions(): Promise<Session[]> {
        try {
            const response = await axios.get<Session[]>(API_URL);
            return response.data;
        } catch (error) {
            console.error("Error al obtener sesiones:", error);
            return [];
        }
    }

    async getSessionById(id: number): Promise<Session | null> {
        try {
            const response = await axios.get<Session>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Sesión no encontrada:", error);
            return null;
        }
    }

    async createSession(session: Omit<Session, "id">): Promise<Session | null> {
        try {
            const response = await axios.post<Session>(API_URL, session);
            return response.data;
        } catch (error) {
            console.error("Error al crear sesión:", error);
            return null;
        }
    }

    async updateSession(id: number, session: Partial<Session>): Promise<Session | null> {
        try {
            const response = await axios.put<Session>(`${API_URL}/${id}`, session);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar sesión:", error);
            return null;
        }
    }

    async deleteSession(id: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error("Error al eliminar sesión:", error);
            return false;
        }
    }
}

// Exportamos una instancia de la clase para reutilizarla
export const sessionService = new SessionService();
