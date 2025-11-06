
import type { Address } from "../models/Address";
import api from "../interceptors/axiosInterceptor";

// Build API base URL from environment safely. Prefer import.meta.env.VITE_API_URL
const RAW_API_BASE: string | undefined = (import.meta as any).env?.VITE_API_URL || (import.meta as any).VITE_API_URL || undefined;
const API_BASE = RAW_API_BASE ? RAW_API_BASE.replace(/\/$/, '') : '';
const API_URL = API_BASE ? `${API_BASE}/addresses` : '/addresses';

class AddressService {
    async getAddresses(): Promise<Address[]> {
        try {
                // debug: log resolved API_URL and response info
                console.debug('AddressService.getAddresses -> API_URL=', API_URL);
                const response = await api.get<Address[]>(API_URL);
                console.debug('AddressService.getAddresses -> status=', response.status, 'count=', Array.isArray(response.data) ? response.data.length : 0);
            return response.data;
        } catch (error) {
            console.error("Error al obtener direcciones :", error);
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

    async createAddress(address: Omit<Address, "id">): Promise<Address | null> {
        try {
            const response = await api.post<Address>(API_URL, address);
            return response.data;
        } catch (error) {
            console.error("Error al crear dirección:", error);
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
}

// Exportamos una instancia de la clase para reutilizarla
export const addressService = new AddressService();
