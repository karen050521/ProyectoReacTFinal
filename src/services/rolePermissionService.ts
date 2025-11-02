import axios from "axios";
import type { RolePermission } from "../models/RolePermission";

const RAW_API_BASE_RP: string | undefined = (import.meta as any).env?.VITE_API_URL || (import.meta as any).VITE_API_URL || (import.meta as any).env?.CLASES_NUBES || (import.meta as any).CLASES_NUBES || undefined;
const API_BASE_RP = RAW_API_BASE_RP ? RAW_API_BASE_RP.replace(/\/$/, '') : '';
const API_URL = API_BASE_RP ? `${API_BASE_RP}/role-permissions` : '/role-permissions';

class RolePermissionService {
    // GET /api/role-permissions → listar relaciones rol-permiso
    async getRolePermissions(): Promise<RolePermission[]> {
        try {
            console.debug('RolePermissionService.getRolePermissions -> API_URL=', API_URL);
            const response = await axios.get<RolePermission[]>(API_URL);
            console.debug('RolePermissionService.getRolePermissions -> status=', response.status, 'count=', Array.isArray(response.data) ? response.data.length : 0);
            return response.data;
        } catch (error) {
            console.error("Error al obtener relaciones rol-permiso:", error);
            return [];
        }
    }

    // GET /api/role-permissions/{id} → obtener relación
    async getRolePermissionById(id: string): Promise<RolePermission | null> {
        try {
            const response = await axios.get<RolePermission>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Relación rol-permiso no encontrada:", error);
            return null;
        }
    }

    // POST /api/role-permissions/role/{roleId}/permission/{permissionId} → asignar permiso a rol
    async assignPermissionToRole(roleId: number, permissionId: number): Promise<RolePermission | null> {
        try {
            const response = await axios.post<RolePermission>(`${API_URL}/role/${roleId}/permission/${permissionId}`);
            return response.data;
        } catch (error) {
            console.error("Error al asignar permiso a rol:", error);
            return null;
        }
    }

    // DELETE /api/role-permissions/role/{roleId}/permission/{permissionId} → eliminar asignación
    async removePermissionFromRole(roleId: number, permissionId: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/role/${roleId}/permission/${permissionId}`);
            return true;
        } catch (error) {
            console.error("Error al eliminar asignación rol-permiso:", error);
            return false;
        }
    }

    // CRUD básico genérico
    async createRolePermission(rolePermission: Omit<RolePermission, "id">): Promise<RolePermission | null> {
        try {
            const response = await axios.post<RolePermission>(API_URL, rolePermission);
            return response.data;
        } catch (error) {
            console.error("Error al crear relación rol-permiso:", error);
            return null;
        }
    }

    async updateRolePermission(id: string, rolePermission: Partial<RolePermission>): Promise<RolePermission | null> {
        try {
            const response = await axios.put<RolePermission>(`${API_URL}/${id}`, rolePermission);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar relación rol-permiso:", error);
            return null;
        }
    }

    async deleteRolePermission(id: string): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error("Error al eliminar relación rol-permiso:", error);
            return false;
        }
    }
}

// Exportamos una instancia de la clase para reutilizarla
export const rolePermissionService = new RolePermissionService();

// Named exports para compatibilidad con imports existentes
export const getRolePermissions = () => rolePermissionService.getRolePermissions();
export const getRolePermissionById = (id: string) => rolePermissionService.getRolePermissionById(id);
export const assignPermissionToRole = (roleId: number, permissionId: number) => rolePermissionService.assignPermissionToRole(roleId, permissionId);
export const removePermissionFromRole = (roleId: number, permissionId: number) => rolePermissionService.removePermissionFromRole(roleId, permissionId);
export const createRolePermission = (rolePermission: Omit<RolePermission, "id">) => rolePermissionService.createRolePermission(rolePermission);
export const updateRolePermission = (id: string, rolePermission: Partial<RolePermission>) => rolePermissionService.updateRolePermission(id, rolePermission);
export const deleteRolePermission = (id: string) => rolePermissionService.deleteRolePermission(id);