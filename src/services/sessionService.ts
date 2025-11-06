
import type { Session } from "../models/Session";
import api from "../interceptors/axiosInterceptor";

const RAW_API_BASE_SESS: string | undefined = (import.meta as any).env?.VITE_API_URL || (import.meta as any).VITE_API_URL || (import.meta as any).env?.CLASES_NUBES || (import.meta as any).CLASES_NUBES || undefined;
const API_BASE_SESS = RAW_API_BASE_SESS ? RAW_API_BASE_SESS.replace(/\/$/, '') : '';
const API_URL = API_BASE_SESS ? `${API_BASE_SESS}/sessions` : '/sessions';

class SessionService {
    async getSessions(): Promise<Session[]> {
        try {
            console.debug('SessionService.getSessions -> API_URL=', API_URL);
            const response = await api.get<Session[]>(API_URL);
            console.debug('SessionService.getSessions -> status=', response.status, 'count=', Array.isArray(response.data) ? response.data.length : 0);
            return response.data;
        } catch (error) {
            console.error("Error al obtener sesiones:", error);
            return [];
        }
    }

    async getSessionById(id: string): Promise<Session | null> {
        try {
            const response = await api.get<Session>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Sesión no encontrada:", error);
            return null;
        }
    }

    async getSessionsByUserId(userId: number): Promise<Session[]> {
        try {
            console.debug('SessionService.getSessionsByUserId -> userId=', userId);
            const endpoint = API_BASE_SESS ? `${API_BASE_SESS}/sessions/user/${userId}` : `/sessions/user/${userId}`;
            console.debug('SessionService.getSessionsByUserId -> endpoint=', endpoint);
            const response = await api.get<Session[]>(endpoint);
            console.debug('SessionService.getSessionsByUserId -> status=', response.status, 'count=', Array.isArray(response.data) ? response.data.length : 0);
            return response.data;
        } catch (error) {
            console.error("Error al obtener sesiones del usuario:", error);
            return [];
        }
    }

    async createSession(session: Omit<Session, "id">): Promise<Session | null> {
        try {
            // La API espera POST /api/sessions/user/{userId} con el body sin user_id
            const userId = session.user_id;
            const endpoint = API_BASE_SESS ? `${API_BASE_SESS}/sessions/user/${userId}` : `/sessions/user/${userId}`;
            console.debug('SessionService.createSession -> endpoint=', endpoint, 'session=', session);
            
            // Crear copia del objeto sin user_id ya que va en la URL
            const { user_id, ...sessionBody } = session;
            
            const response = await api.post<Session>(endpoint, sessionBody);
            console.debug('SessionService.createSession -> status=', response.status);
            return response.data;
        } catch (error) {
            console.error("Error al crear sesión:", error);
            return null;
        }
    }

    async updateSession(id: string, session: Partial<Session>): Promise<Session | null> {
        try {
            // La API espera PUT /api/sessions/{session_id}
            const endpoint = `${API_URL}/${id}`;
            console.debug('SessionService.updateSession -> endpoint=', endpoint, 'session=', session);
            
            const response = await api.put<Session>(endpoint, session);
            console.debug('SessionService.updateSession -> status=', response.status);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar sesión:", error);
            return null;
        }
    }

    async deleteSession(id: string, userId?: number): Promise<boolean> {
        try {
            // La API espera DELETE /api/sessions/{session_id}
            const endpoint = `${API_URL}/${id}`;
            
            console.debug('SessionService.deleteSession -> endpoint=', endpoint);
            await api.delete(endpoint);
            console.debug('SessionService.deleteSession -> success');
            return true;
        } catch (error) {
            console.error("Error al eliminar sesión:", error);
            return false;
        }
    }
}

// Exportamos una instancia de la clase para reutilizarla
export const sessionService = new SessionService();

// Named exports para compatibilidad con imports existentes
export const getSessions = () => sessionService.getSessions();
export const getSessionById = (id: string) => sessionService.getSessionById(id);
export const getSessionsByUserId = (userId: number) => sessionService.getSessionsByUserId(userId);
export const createSession = (session: Omit<Session, "id">) => sessionService.createSession(session);
export const updateSession = (id: string, session: Partial<Session>) => sessionService.updateSession(id, session);
export const deleteSession = (id: string, userId?: number) => sessionService.deleteSession(id, userId);
