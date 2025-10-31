import axios from "axios";
import type { Role } from "../models/Role";

const RAW_API_BASE_ROLE: string | undefined = (import.meta as any).env?.VITE_API_URL || (import.meta as any).VITE_API_URL || (import.meta as any).env?.CLASES_NUBES || (import.meta as any).CLASES_NUBES || undefined;
const API_BASE_ROLE = RAW_API_BASE_ROLE ? RAW_API_BASE_ROLE.replace(/\/$/, '') : '';
const API_URL = API_BASE_ROLE ? `${API_BASE_ROLE}/roles` : '/roles';

class RoleService {
    async getRoles(): Promise<Role[]> {
        try {
            console.debug('RoleService.getRoles -> API_URL=', API_URL);
            const response = await axios.get<Role[]>(API_URL);
            console.debug('RoleService.getRoles -> status=', response.status, 'count=', Array.isArray(response.data) ? response.data.length : 0);
            return response.data;
        } catch (error) {
            console.error("Error al obtener roles:", error);
            return [];
        }
    }

    async getRoleById(id: number): Promise<Role | null> {
        try {
            const response = await axios.get<Role>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Rol no encontrado:", error);
            return null;
        }
    }

    async createRole(role: Omit<Role, "id">): Promise<Role | null> {
        try {
            const response = await axios.post<Role>(API_URL, role);
            return response.data;
        } catch (error) {
            console.error("Error al crear rol:", error);
            return null;
        }
    }

    async updateRole(id: number, role: Partial<Role>): Promise<Role | null> {
        try {
            const response = await axios.put<Role>(`${API_URL}/${id}`, role);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar rol:", error);
            return null;
        }
    }

    async deleteRole(id: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/${id}`);
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
