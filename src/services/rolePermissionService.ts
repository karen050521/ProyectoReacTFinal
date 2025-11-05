import { api } from "../interceptors/axiosInterceptor";
import type { RolePermission } from "../models/RolePermission";

class RolePermissionService {
    // GET /api/role-permissions → listar relaciones rol-permiso
    async getRolePermissions(): Promise<RolePermission[]> {
        try {
            const response = await api.get<RolePermission[]>('/role-permissions');
            return response.data;
        } catch (error) {
            console.error("Error al obtener relaciones rol-permiso:", error);
            return [];
        }
    }

    // GET /api/role-permissions/{id} → obtener relación
    async getRolePermissionById(id: string): Promise<RolePermission | null> {
        try {
            const response = await api.get<RolePermission>(`/role-permissions/${id}`);
            return response.data;
        } catch (error) {
            console.error("Relación rol-permiso no encontrada:", error);
            return null;
        }
    }

    // GET /api/role-permissions/role/{roleId} → obtener permisos de un rol
    async getPermissionsByRoleId(roleId: number): Promise<RolePermission[]> {
        try {
            const response = await api.get<RolePermission[]>(`/role-permissions/role/${roleId}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener permisos del rol:", error);
            return [];
        }
    }

    // POST /api/role-permissions/role/{roleId}/permission/{permissionId} → asignar permiso a rol
    async assignPermissionToRole(roleId: number, permissionId: number): Promise<RolePermission | null> {
        try {
            const response = await api.post<RolePermission>(
                `/role-permissions/role/${roleId}/permission/${permissionId}`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error al asignar permiso a rol:", error);
            return null;
        }
    }

    // DELETE /api/role-permissions/role/{roleId}/permission/{permissionId} → eliminar asignación
    async removePermissionFromRole(roleId: number, permissionId: number): Promise<boolean> {
        try {
            await api.delete(
                `/role-permissions/role/${roleId}/permission/${permissionId}`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return true;
        } catch (error) {
            console.error("Error al eliminar asignación rol-permiso:", error);
            return false;
        }
    }

    // CRUD básico genérico
    async createRolePermission(rolePermission: Omit<RolePermission, "id">): Promise<RolePermission | null> {
        try {
            const response = await api.post<RolePermission>('/role-permissions', rolePermission);
            return response.data;
        } catch (error) {
            console.error("Error al crear relación rol-permiso:", error);
            return null;
        }
    }

    async updateRolePermission(id: string, rolePermission: Partial<RolePermission>): Promise<RolePermission | null> {
        try {
            const response = await api.put<RolePermission>(`/role-permissions/${id}`, rolePermission);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar relación rol-permiso:", error);
            return null;
        }
    }

    async deleteRolePermission(id: string): Promise<boolean> {
        try {
            await api.delete(`/role-permissions/${id}`);
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
export const getPermissionsByRoleId = (roleId: number) => rolePermissionService.getPermissionsByRoleId(roleId);
export const assignPermissionToRole = (roleId: number, permissionId: number) => rolePermissionService.assignPermissionToRole(roleId, permissionId);
export const removePermissionFromRole = (roleId: number, permissionId: number) => rolePermissionService.removePermissionFromRole(roleId, permissionId);
export const createRolePermission = (rolePermission: Omit<RolePermission, "id">) => rolePermissionService.createRolePermission(rolePermission);
export const updateRolePermission = (id: string, rolePermission: Partial<RolePermission>) => rolePermissionService.updateRolePermission(id, rolePermission);
export const deleteRolePermission = (id: string) => rolePermissionService.deleteRolePermission(id);