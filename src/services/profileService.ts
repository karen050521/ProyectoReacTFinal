import axios from "axios";
import type { Profile } from "../models/Profile";

const API_URL = import.meta.env.VITE_API_URL + "/users" || "";

class ProfileService {
    async getProfiles(): Promise<Profile[]> {
        try {
            const response = await axios.get<Profile[]>(API_URL);
            return response.data;
        } catch (error) {
            console.error("Error al obtener perfiles:", error);
            return [];
        }
    }

    async getProfileById(id: number): Promise<Profile | null> {
        try {
            const response = await axios.get<Profile>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Perfil no encontrado:", error);
            return null;
        }
    }

    async createProfile(profile: Omit<Profile, "id">): Promise<Profile | null> {
        try {
            const response = await axios.post<Profile>(API_URL, profile);
            return response.data;
        } catch (error) {
            console.error("Error al crear perfil:", error);
            return null;
        }
    }

    async updateProfile(id: number, profile: Partial<Profile>): Promise<Profile | null> {
        try {
            const response = await axios.put<Profile>(`${API_URL}/${id}`, profile);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
            return null;
        }
    }

    async deleteProfile(id: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error("Error al eliminar perfil:", error);
            return false;
        }
    }
}

// Exportamos una instancia de la clase para reutilizarla
export const profileService = new ProfileService();
