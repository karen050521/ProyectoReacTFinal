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

    // PUT /api/roles/{roleId}/permissions → actualización bulk de permisos
    async updateRolePermissionsBulk(roleId: number, permissionIds: number[]): Promise<boolean> {
        try {
            console.log(`🔄 Bulk update permissions for role ${roleId}:`, permissionIds);
            await api.put(`/roles/${roleId}/permissions`, {
                permissionIds: permissionIds
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(`✅ Bulk update successful for role ${roleId}`);
            return true;
        } catch (error) {
            console.error("❌ Error in bulk permissions update:", error);
            return false;
        }
    }

    // Método para actualizar permisos usando diff (si no hay bulk)
    async updateRolePermissionsDiff(roleId: number, newPermissionIds: number[]): Promise<boolean> {
        try {
            console.log(`🔄 Diff update permissions for role ${roleId}`);
            
            // 1. Obtener permisos actuales
            const currentRolePermissions = await this.getPermissionsByRoleId(roleId);
            const currentPermissionIds = currentRolePermissions.map(rp => rp.permission_id);
            
            // 2. Calcular diferencias
            const toAdd = newPermissionIds.filter(id => !currentPermissionIds.includes(id));
            const toRemove = currentPermissionIds.filter(id => !newPermissionIds.includes(id));
            
            console.log(`📊 Permissions to add:`, toAdd);
            console.log(`📊 Permissions to remove:`, toRemove);
            
            // 3. Aplicar cambios
            let success = true;
            
            // Agregar nuevos permisos
            for (const permissionId of toAdd) {
                const result = await this.assignPermissionToRole(roleId, permissionId);
                if (!result) {
                    console.error(`❌ Failed to add permission ${permissionId}`);
                    success = false;
                }
            }
            
            // Remover permisos
            for (const permissionId of toRemove) {
                const result = await this.removePermissionFromRole(roleId, permissionId);
                if (!result) {
                    console.error(`❌ Failed to remove permission ${permissionId}`);
                    success = false;
                }
            }
            
            console.log(`${success ? '✅' : '❌'} Diff update completed for role ${roleId}`);
            return success;
        } catch (error) {
            console.error("❌ Error in diff permissions update:", error);
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