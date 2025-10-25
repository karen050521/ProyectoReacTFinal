import axios from "axios";
import type { RolePermission } from "../models/RolePermission";

const API_URL = (import.meta as any).env.VITE_API_URL + "/role-permissions" || "";

class RolePermissionService {
    async getRolePermissions(): Promise<RolePermission[]> {
        try {
            const response = await axios.get<RolePermission[]>(API_URL);
            return response.data;
        } catch (error) {
            console.error("Error al obtener permisos de rol:", error);
            return [];
        }
    }

    async getRolePermissionById(id: number): Promise<RolePermission | null> {
        try {
            const response = await axios.get<RolePermission>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Permiso de rol no encontrado:", error);
            return null;
        }
    }

    async createRolePermission(rolePermission: Omit<RolePermission, "id">): Promise<RolePermission | null> {
        try {
            const response = await axios.post<RolePermission>(API_URL, rolePermission);
            return response.data;
        } catch (error) {
            console.error("Error al crear permiso de rol:", error);
            return null;
        }
    }

    async updateRolePermission(id: number, rolePermission: Partial<RolePermission>): Promise<RolePermission | null> {
        try {
            const response = await axios.put<RolePermission>(`${API_URL}/${id}`, rolePermission);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar permiso de rol:", error);
            return null;
        }
    }

    async deleteRolePermission(id: string): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error("Error al eliminar permiso de rol:", error);
            return false;
        }
    }
}

// Exportamos una instancia de la clase para reutilizarla
export const rolePermissionService = new RolePermissionService();
