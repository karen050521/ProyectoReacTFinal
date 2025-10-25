import axios from "axios";
import type { UserRole } from "../models/UserRole";

const API_URL = (import.meta as any).env.VITE_API_URL + "/users" || "";

class UserRoleService {
    async getUserRoles(): Promise<UserRole[]> {
        try {
            const response = await axios.get<UserRole[]>(API_URL);
            return response.data;
        } catch (error) {
            console.error("Error al obtener roles de usuario:", error);
            return [];
        }
    }

    async getUserRoleById(id: number): Promise<UserRole | null> {
        try {
            const response = await axios.get<UserRole>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Role de usuario no encontrado:", error);
            return null;
        }
    }

    async createUserRole(userRole: Omit<UserRole, "id">): Promise<UserRole | null> {
        try {
            const response = await axios.post<UserRole>(API_URL, userRole);
            return response.data;
        } catch (error) {
            console.error("Error al crear rol de usuario:", error);
            return null;
        }
    }

    async updateUserRole(id: number, userRole: Partial<UserRole>): Promise<UserRole | null> {
        try {
            const response = await axios.put<UserRole>(`${API_URL}/${id}`, userRole);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar rol de usuario:", error);
            return null;
        }
    }

    async deleteUserRole(id: string): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error("Error al eliminar rol de usuario:", error);
            return false;
        }
    }
}

// Exportamos una instancia de la clase para reutilizarla
export const userRoleService = new UserRoleService();
