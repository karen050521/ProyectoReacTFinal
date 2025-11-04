import api from "../interceptors/axiosInterceptor";
import type { Address } from "../models/Address";

const API_URL = "/addresses"; //  Quitamos /api porque ya está en baseURL

class AddressService {
    async getAddresses(): Promise<Address[]> {
        try {
            const response = await api.get<Address[]>(API_URL);
            return response.data;
        } catch (error) {
            console.error("Error al obtener direcciones:", error);
            return [];
        }
    }

    async getAddressById(id: number): Promise<Address | null> {
        try {
            const response = await api.get<Address>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Dirección no encontrada:", error);
            return null;
        }
    }

    async createAddress(userId: number, address: Omit<Address, "id" | "user_id">): Promise<Address | null> {
        try {
            console.log("Creando dirección para usuario:", userId);
            console.log("Datos de dirección:", address);
            
            const response = await api.post<Address>(`${API_URL}/user/${userId}`, address);
            console.log("Respuesta exitosa:", response.data);
            return response.data;
        } catch (error: any) {
            console.error("Error al crear dirección:", error);
            
            // Mostrar información específica del error
            if (error.response) {
                console.error("Status:", error.response.status);
                console.error("Data:", error.response.data);
                
                // Si es error 400, mostrar mensaje específico
                if (error.response.status === 400) {
                    const errorMessage = error.response.data?.error || error.response.data?.message || "Datos inválidos";
                    console.error("Error 400 - Bad Request:", errorMessage);
                    
                    // Si el error indica que ya existe una dirección
                    if (errorMessage.includes("already exists") || errorMessage.includes("ya existe")) {
                        throw new Error("El usuario ya tiene una dirección registrada. Cada usuario solo puede tener una dirección.");
                    }
                }
            }
            
            return null;
        }
    }

    async updateAddress(id: number, address: Partial<Address>): Promise<Address | null> {
        try {
            const response = await api.put<Address>(`${API_URL}/${id}`, address);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar dirección:", error);
            return null;
        }
    }

    async deleteAddress(id: number): Promise<boolean> {
        try {
            await api.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error("Error al eliminar dirección:", error);
            return false;
        }
    }

    async getAddressByUserId(userId: number): Promise<Address | null> {
        try {
            const response = await api.get<Address>(`${API_URL}/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener dirección del usuario:", error);
            return null;
        }
    }
}

// Exportamos una instancia de la clase para reutilizarla
export const addressService = new AddressService();

// Named exports para compatibilidad con imports existentes
export const getAddressById = (id: number) => addressService.getAddressById(id);
export const updateAddress = (id: number, address: Partial<Address>) => addressService.updateAddress(id, address);
export const createAddress = (userId: number, address: Omit<Address, "id" | "user_id">) => addressService.createAddress(userId, address);