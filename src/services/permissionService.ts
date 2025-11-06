import { api } from "../interceptors/axiosInterceptor";
import type { Permission } from "../models/Permission";

class PermissionService {
    async getPermissions(): Promise<Permission[]> {
        try {
            const response = await api.get<Permission[]>('/permissions');
            return response.data;
        } catch (error) {
            console.error("Error al obtener permisos:", error);
            return [];
        }
    }

    async getPermissionById(id: number): Promise<Permission | null> {
        try {
            const response = await api.get<Permission>(`/permissions/${id}`);
            return response.data;
        } catch (error) {
            console.error("Permiso no encontrado:", error);
            return null;
        }
    }

    async createPermission(permission: Omit<Permission, "id">): Promise<Permission | null> {
        try {
            const response = await api.post<Permission>('/permissions', permission, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error al crear permiso:", error);
            return null;
        }
    }

    async updatePermission(id: number, permission: Partial<Permission>): Promise<Permission | null> {
        try {
            const response = await api.put<Permission>(`/permissions/${id}`, permission, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error al actualizar permiso:", error);
            return null;
        }
    }

    async deletePermission(id: number): Promise<boolean> {
        try {
            await api.delete(`/permissions/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return true;
        } catch (error) {
            console.error("Error al eliminar permiso:", error);
            return false;
        }
    }

    // GET /api/permissions/grouped/role/{roleId} → permisos agrupados por rol
    async getPermissionsByRole(roleId: number): Promise<Permission[]> {
        try {
            const response = await api.get<Permission[]>(`/permissions/grouped/role/${roleId}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener permisos por rol:", error);
            return [];
        }
    }
}

// Exportamos una instancia de la clase para reutilizarla
export const permissionService = new PermissionService();

// Named exports para compatibilidad con imports existentes
export const getPermissions = () => permissionService.getPermissions();
export const getPermissionById = (id: number) => permissionService.getPermissionById(id);
export const createPermission = (permission: Omit<Permission, "id">) => permissionService.createPermission(permission);
export const updatePermission = (id: number, permission: Partial<Permission>) => permissionService.updatePermission(id, permission);
export const deletePermission = (id: number) => permissionService.deletePermission(id);
export const getPermissionsByRole = (roleId: number) => permissionService.getPermissionsByRole(roleId);
