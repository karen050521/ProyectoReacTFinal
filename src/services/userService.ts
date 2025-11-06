
import type { User } from "../models/user";
import api from "../interceptors/axiosInterceptor";


const RAW_API_BASE_USER: string | undefined = (import.meta as any).env?.VITE_API_URL || (import.meta as any).VITE_API_URL || (import.meta as any).env?.CLASES_NUBES || (import.meta as any).CLASES_NUBES || undefined;
const API_BASE_USER = RAW_API_BASE_USER ? RAW_API_BASE_USER.replace(/\/$/, '') : '';
const API_URL = API_BASE_USER ? `${API_BASE_USER}/users` : '/users';

class UserService {
    async getUsers(): Promise<User[]> {
        console.log(API_URL);
        try {
            const response = await api.get<User[]>(API_URL);
            console.log(API_URL);
            
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
