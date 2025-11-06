import { api } from "../interceptors/axiosInterceptor";
import type { Role } from "../models/Role";

class RoleService {
    async getRoles(): Promise<Role[]> {
        try {
            const response = await api.get<Role[]>('/roles');
            return response.data;
        } catch (error) {
            console.error("Error al obtener roles:", error);
            return [];
        }
    }

    async getRoleById(id: number): Promise<Role | null> {
        try {
            const response = await api.get<Role>(`/roles/${id}`);
            return response.data;
        } catch (error) {
            console.error("Rol no encontrado:", error);
            return null;
        }
    }

    async createRole(role: Omit<Role, "id">): Promise<Role | null> {
        try {
            const response = await api.post<Role>('/roles', role, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error al crear rol:", error);
            return null;
        }
    }

    async updateRole(id: number, role: Partial<Role>): Promise<Role | null> {
        try {
            const response = await api.put<Role>(`/roles/${id}`, role, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error al actualizar rol:", error);
            return null;
        }
    }

    async deleteRole(id: number): Promise<boolean> {
        try {
            await api.delete(`/roles/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return true;
        } catch (error) {
            console.error("Error al eliminar rol:", error);
            return false;
        }
    }
}

// Exportamos una instancia de la clase para reutilizarla
export const roleService = new RoleService();

// Named exports para compatibilidad con imports existentes
export const getRoles = () => roleService.getRoles();
export const getRoleById = (id: number) => roleService.getRoleById(id);
export const createRole = (role: Omit<Role, "id">) => roleService.createRole(role);
export const updateRole = (id: number, role: Partial<Role>) => roleService.updateRole(id, role);
export const deleteRole = (id: number) => roleService.deleteRole(id);
