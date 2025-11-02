import axios from "axios";
import type { Permission } from "../models/Permission";

const RAW_API_BASE_PERM: string | undefined = (import.meta as any).env?.VITE_API_URL || (import.meta as any).VITE_API_URL || (import.meta as any).env?.CLASES_NUBES || (import.meta as any).CLASES_NUBES || undefined;
const API_BASE_PERM = RAW_API_BASE_PERM ? RAW_API_BASE_PERM.replace(/\/$/, '') : '';
const API_URL = API_BASE_PERM ? `${API_BASE_PERM}/permissions` : '/permissions';

class PermissionService {
    async getPermissions(): Promise<Permission[]> {
        try {
            console.debug('PermissionService.getPermissions -> API_URL=', API_URL);
            const response = await axios.get<Permission[]>(API_URL);
            console.debug('PermissionService.getPermissions -> status=', response.status, 'count=', Array.isArray(response.data) ? response.data.length : 0);
            return response.data;
        } catch (error) {
            console.error("Error al obtener permisos:", error);
            return [];
        }
    }

    async getPermissionById(id: number): Promise<Permission | null> {
        try {
            const response = await axios.get<Permission>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Permiso no encontrado:", error);
            return null;
        }
    }

    async createPermission(permission: Omit<Permission, "id">): Promise<Permission | null> {
        try {
            const response = await axios.post<Permission>(API_URL, permission);
            return response.data;
        } catch (error) {
            console.error("Error al crear permiso:", error);
            return null;
        }
    }

    async updatePermission(id: number, permission: Partial<Permission>): Promise<Permission | null> {
        try {
            const response = await axios.put<Permission>(`${API_URL}/${id}`, permission);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar permiso:", error);
            return null;
        }
    }

    async deletePermission(id: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error("Error al eliminar permiso:", error);
            return false;
        }
    }

    // GET /api/permissions/grouped/role/{roleId} → permisos agrupados por rol
    async getPermissionsByRole(roleId: number): Promise<Permission[]> {
        try {
            const response = await axios.get<Permission[]>(`${API_URL}/grouped/role/${roleId}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener permisos por rol:", error);
            return [];
        }
    }
}

// Exportamos una instancia de la clase para reutilizarla
export const permissionService = new PermissionService  ();

// Named exports para compatibilidad con imports existentes
export const getPermissions = () => permissionService.getPermissions();
export const getPermissionById = (id: number) => permissionService.getPermissionById(id);
export const createPermission = (permission: Omit<Permission, "id">) => permissionService.createPermission(permission);
export const updatePermission = (id: number, permission: Partial<Permission>) => permissionService.updatePermission(id, permission);
export const deletePermission = (id: number) => permissionService.deletePermission(id);
export const getPermissionsByRole = (roleId: number) => permissionService.getPermissionsByRole(roleId);
