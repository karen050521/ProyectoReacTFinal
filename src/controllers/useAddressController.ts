import { useState, useEffect } from "react";
import { addressService } from "../services/addressService";
import { Address } from "../models/Address";
import api from "../interceptors/axiosInterceptor";

export const useAddressController = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para buscar usuario por email (igual que en create.tsx y list.tsx)
  const findUserByEmail = async (email: string) => {
    try {
      const response = await api.get('/users');
      const users = response.data;
      return users.find((user: any) => user.email === email);
    } catch (error) {
      console.error("Error buscando usuario por email:", error);
      return null;
    }
  };

  const fetchUserAddress = async () => {
    setLoading(true);
    setError(null);
    try {
      // Obtener usuario autenticado actual (Firebase)
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      
      if (!currentUser || !currentUser.email) {
        console.error("No hay usuario autenticado");
        setAddresses([]);
        setLoading(false);
        return;
      }

      console.log("Usuario Firebase autenticado:", currentUser);
      
      // Buscar usuario en backend por email
      const backendUser = await findUserByEmail(currentUser.email);
      
      if (!backendUser || !backendUser.id) {
        console.error("No se encontró usuario en backend con email:", currentUser.email);
        setAddresses([]);
        setLoading(false);
        return;
      }

      console.log("Usuario encontrado en backend:", backendUser);
      
      // Obtener solo la dirección del usuario actual
      const userAddress = await addressService.getAddressByUserId(Number(backendUser.id));
      
      if (userAddress) {
        console.log("Dirección encontrada:", userAddress);
        setAddresses([userAddress]); // Array con una sola dirección
      } else {
        console.log("Usuario no tiene dirección registrada");
        setAddresses([]);
      }
    } catch (err) {
      setError("Error al cargar dirección del usuario");
      console.error(err);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const createAddress = async (address: Omit<Address, "id" | "user_id">) => {
    try {
      // Obtener usuario autenticado actual (Firebase)
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      
      if (!currentUser || !currentUser.email) {
        throw new Error("No se pudo obtener el usuario autenticado o no tiene email");
      }

      // Buscar usuario en backend por email
      const backendUser = await findUserByEmail(currentUser.email);
      
      if (!backendUser || !backendUser.id) {
        throw new Error("No se encontró un usuario en el backend con tu email");
      }

      // Verificar si el usuario ya tiene una dirección
      try {
        const existingAddress = await api.get(`/addresses/user/${backendUser.id}`);
        if (existingAddress.data) {
          throw new Error("Ya tienes una dirección registrada. Cada usuario solo puede tener una dirección.");
        }
      } catch (existingError: any) {
        // Si es 404, significa que no tiene dirección (OK para crear)
        if (existingError.response?.status !== 404) {
          console.error("Error verificando dirección existente:", existingError);
        }
      }

      const newAddress = await addressService.createAddress(Number(backendUser.id), address);
      if (newAddress) {
        await fetchUserAddress(); // Recargar direcciones
        return newAddress;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear dirección");
      throw err;
    }
  };

  const updateAddress = async (id: number, address: Partial<Address>) => {
    try {
      if (!id) {
        throw new Error("No se pudo identificar la dirección a actualizar");
      }
      
      const updated = await addressService.updateAddress(id, address);
      if (updated) {
        await fetchUserAddress(); // Recargar direcciones
        return updated;
      }
    } catch (err) {
      setError("Error al actualizar dirección");
      throw err;
    }
  };

  const deleteAddress = async (id: number) => {
    try {
      const success = await addressService.deleteAddress(id);
      if (success) {
        await fetchUserAddress(); // Recargar direcciones
      }
      return success;
    } catch (err) {
      setError("Error al eliminar dirección");
      throw err;
    }
  };

  const getAddressById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const address = await addressService.getAddressById(id);
      return address;
    } catch (err) {
      setError("Error al obtener dirección");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAddress();
  }, []);

  return {
    addresses,
    loading,
    error,
    fetchUserAddress,
    createAddress,
    updateAddress,
    deleteAddress,
    getAddressById,
    clearError: () => setError(null),
  };
};