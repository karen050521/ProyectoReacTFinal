import axios from "axios";
import type { Role } from "../models/Role";

const API_URL = (import.meta as any).env.VITE_API_URL + "/roles" || "";

class RoleService {
    async getRoles(): Promise<Role[]> {
        try {
            const response = await axios.get<Role[]>(API_URL);
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
