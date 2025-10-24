import axios from "axios";

import type { Password } from "../models/Password";

const API_URL = import.meta.env.VITE_API_URL + "/passwords" || "";

class PasswordService {
    async getPasswords(): Promise<Password[]> {
        try {
            const response = await axios.get<Password[]>(API_URL);
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
