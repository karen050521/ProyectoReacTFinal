import api from "../interceptors/axiosInterceptor";
import type { Password } from "../models/Password";

const API_URL = "/passwords"; // ✅ Quitamos /api porque ya está en baseURL

class PasswordService {
    async getPasswords(): Promise<Password[]> {
        try {
            const response = await api.get<Password[]>(API_URL);
            return response.data;
        } catch (error) {
            console.error("Error al obtener las contraseñas:", error);
            return [];
        }
    }

    async getPasswordById(id: number): Promise<Password | null> {
        try {
            const response = await api.get<Password>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Contraseña no encontrada:", error);
            return null;
        }
    }

    async createPassword(userId: number, password: Omit<Password, "id" | "user_id">): Promise<Password | null> {
        try {
            const response = await api.post<Password>(`${API_URL}/user/${userId}`, password);
            return response.data;
        } catch (error) {
            console.error("Error al crear la contraseña:", error);
            return null;
        }
    }

    async updatePassword(id: number, password: Partial<Password>): Promise<Password | null> {
        try {
            const response = await api.put<Password>(`${API_URL}/${id}`, password);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar la contraseña:", error);
            return null;
        }
    }

    async deletePassword(id: number): Promise<boolean> {
        try {
            await api.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error("Error al eliminar la contraseña:", error);
            return false;
        }
    }

    async getPasswordsByUserId(userId: number): Promise<Password[]> {
        try {
            const response = await api.get<Password[]>(`${API_URL}/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error("❌ Error al obtener contraseñas del usuario:", error);
            return [];
        }
    }
}

// Exportamos una instancia de la clase para reutilizarla
export const passwordService = new PasswordService();

// Named exports para compatibilidad con imports existentes
export const getPasswordById = (id: number) => passwordService.getPasswordById(id);
export const updatePassword = (id: number, password: Partial<Password>) => passwordService.updatePassword(id, password);
export const createPassword = (userId: number, password: Omit<Password, "id" | "user_id">) => passwordService.createPassword(userId, password);