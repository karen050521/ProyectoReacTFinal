
import type { UserRole } from "../models/UserRole";
import api from "../interceptors/axiosInterceptor";

const RAW_API_BASE_UR: string | undefined = (import.meta as any).env?.VITE_API_URL || (import.meta as any).VITE_API_URL || (import.meta as any).env?.CLASES_NUBES || (import.meta as any).CLASES_NUBES || undefined;
const API_BASE_UR = RAW_API_BASE_UR ? RAW_API_BASE_UR.replace(/\/$/, '') : '';
const API_URL = API_BASE_UR ? `${API_BASE_UR}/user-roles` : '/user-roles';

class UserRoleService {
    async getUserRoles(): Promise<UserRole[]> {
        try {
            console.debug('UserRoleService.getUserRoles -> API_URL=', API_URL);
            const response = await api.get<UserRole[]>(API_URL);
            console.debug('UserRoleService.getUserRoles -> status=', response.status, 'count=', Array.isArray(response.data) ? response.data.length : 0);
            return response.data;
        } catch (error) {
            console.error("Error al obtener roles de usuario:", error);
            return [];
        }
    }

    async getUserRoleById(id: string): Promise<UserRole | null> {
        try {
            const response = await api.get<UserRole>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Role de usuario no encontrado:", error);
            return null;
        }
    }

    async createUserRole(userRole: Omit<UserRole, "id">): Promise<UserRole | null> {
        try {
            const response = await api.post<UserRole>(API_URL, userRole);
            return response.data;
        } catch (error) {
            console.error("Error al crear rol de usuario:", error);
            return null;
        }
    }

    async updateUserRole(id: string, userRole: Partial<UserRole>): Promise<UserRole | null> {
        try {
            const response = await api.put<UserRole>(`${API_URL}/${id}`, userRole);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar rol de usuario:", error);
            return null;
        }
    }

    async deleteUserRole(id: string): Promise<boolean> {
        try {
            await api.delete(`${API_URL}/${id}`);
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
