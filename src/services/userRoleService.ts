import axios from "axios";
import type { UserRole } from "../models/UserRole";

const API_URL = (import.meta as any).env.CLASES_NUBES + "/user-roles" || "/user-roles";

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

    async getUserRoleById(id: string): Promise<UserRole | null> {
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

    async updateUserRole(id: string, userRole: Partial<UserRole>): Promise<UserRole | null> {
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

// Named exports para compatibilidad con imports existentes
export const getUserRoles = () => userRoleService.getUserRoles();
export const getUserRoleById = (id: string) => userRoleService.getUserRoleById(id);
export const createUserRole = (userRole: Omit<UserRole, "id">) => userRoleService.createUserRole(userRole);
export const updateUserRole = (id: string, userRole: Partial<UserRole>) => userRoleService.updateUserRole(id, userRole);
export const deleteUserRole = (id: string) => userRoleService.deleteUserRole(id);
