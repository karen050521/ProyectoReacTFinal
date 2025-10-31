import axios from "axios";

import type { Password } from "../models/Password";

// Build API base URL safely. Support both VITE_API_URL and legacy CLASES_NUBES
const RAW_API_BASE_PW: string | undefined = (import.meta as any).env?.VITE_API_URL || (import.meta as any).VITE_API_URL || (import.meta as any).env?.CLASES_NUBES || (import.meta as any).CLASES_NUBES || undefined;
const API_BASE_PW = RAW_API_BASE_PW ? RAW_API_BASE_PW.replace(/\/$/, '') : '';
const API_URL = API_BASE_PW ? `${API_BASE_PW}/passwords` : '/passwords';

class PasswordService {
    async getPasswords(): Promise<Password[]> {
        try {
            console.debug('PasswordService.getPasswords -> API_URL=', API_URL);
            const response = await axios.get<Password[]>(API_URL);
            console.debug('PasswordService.getPasswords -> status=', response.status, 'count=', Array.isArray(response.data) ? response.data.length : 0);
            return response.data;
        } catch (error) {
            console.error("Error al obtener las contraseñas:", error);
            return [];
        }
    }

    async getPasswordById(id: number): Promise<Password | null> {
        try {
            const response = await axios.get<Password>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Contraseña no encontrada:", error);
            return null;
        }
    }

    async createPassword(password: Omit<Password, "id">): Promise<Password | null> {
        try {
            const response = await axios.post<Password>(API_URL, password);
            return response.data;
        } catch (error) {
            console.error("Error al crear la contraseña:", error);
            return null;
        }
    }

    async updatePassword(id: number, password: Partial<Password>): Promise<Password | null> {
        try {
            const response = await axios.put<Password>(`${API_URL}/${id}`, password);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar la contraseña:", error);
            return null;
        }
    }

    async deletePassword(id: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error("Error al eliminar la contraseña:", error);
            return false;
        }
    }
}

// Exportamos una instancia de la clase para reutilizarla
export const passwordService = new PasswordService();

// Named exports para compatibilidad con imports existentes
export const getPasswords = () => passwordService.getPasswords();
export const getPasswordById = (id: number) => passwordService.getPasswordById(id);
export const createPassword = (password: Omit<Password, "id">) => passwordService.createPassword(password);
export const updatePassword = (id: number, password: Partial<Password>) => passwordService.updatePassword(id, password);
export const deletePassword = (id: number) => passwordService.deletePassword(id);
