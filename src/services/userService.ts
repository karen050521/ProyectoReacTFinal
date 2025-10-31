import api from "../interceptors/axiosInterceptor";
import type { User } from "../models/user";

const API_URL = "/users"; // Quitamos /api porque ya está en baseURL del interceptor

class UserService {
    async getUsers(): Promise<User[]> {
        console.log("Obteniendo usuarios desde:", API_URL);
        try {
            const response = await api.get<User[]>(API_URL);
            console.log("Usuarios obtenidos:", response.data.length);
            return response.data;
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            return [];
        }
    }

    async getUserById(id: number): Promise<User | null> {
        try {
            const response = await api.get<User>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Usuario no encontrado:", error);
            return null;
        }
    }

    async createUser(user: Omit<User, "id">): Promise<User | null> {
        try {
            const response = await api.post<User>(API_URL, user);
            return response.data;
        } catch (error) {
            console.error("Error al crear  usuario:", error);
            return null;
        }
    }

    async updateUser(id: number, user: Partial<User>): Promise<User| null> {
        try {
            const response = await api.put<User>(`${API_URL}/${id}`, user);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar rol de usuario:", error);
            return null;
        }
    }

    async deleteUser(id: number): Promise<boolean> {
        try {
            await api.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            return false;
        }
    }
}
export const userService = new UserService();
// Named exports para compatibilidad con imports existentes
export const getUserById = (id: number) => userService.getUserById(id);
export const updateUser = (id: number, user: Partial<User>) => userService.updateUser(id, user);
export const createUser = (user: Omit<User, "id">) => userService.createUser(user);
