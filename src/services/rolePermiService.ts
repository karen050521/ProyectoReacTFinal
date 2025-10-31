import axios from "axios";
import type { RolePermission } from "../models/RolePermission";

const RAW_API_BASE_RP: string | undefined = (import.meta as any).env?.VITE_API_URL || (import.meta as any).VITE_API_URL || (import.meta as any).env?.CLASES_NUBES || (import.meta as any).CLASES_NUBES || undefined;
const API_BASE_RP = RAW_API_BASE_RP ? RAW_API_BASE_RP.replace(/\/$/, '') : '';
const API_URL = API_BASE_RP ? `${API_BASE_RP}/role-permissions` : '/role-permissions';

class RolePermissionService {
    async getRolePermissions(): Promise<RolePermission[]> {
        try {
            console.debug('RolePermissionService.getRolePermissions -> API_URL=', API_URL);
            const response = await axios.get<RolePermission[]>(API_URL);
            console.debug('RolePermissionService.getRolePermissions -> status=', response.status, 'count=', Array.isArray(response.data) ? response.data.length : 0);
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
