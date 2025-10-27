import { useState, useEffect } from "react";
import { addressService } from "../services/addressService";
import { Address } from "../models/Address";

export const useAddressController = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await addressService.getAddresses();
      setAddresses(data);
    } catch (err) {
      setError("Error al cargar direcciones");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createAddress = async (userId: number, address: Omit<Address, "id" | "user_id">) => {
    try {
      const newAddress = await addressService.createAddress(userId, address);
      if (newAddress) {
        await fetchAddresses();
        return newAddress;
      }
    } catch (err) {
      setError("Error al crear dirección");
      throw err;
    }
  };

  const updateAddress = async (id: number, address: Partial<Address>) => {
    try {
      const updated = await addressService.updateAddress(id, address);
      if (updated) {
        await fetchAddresses();
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
        await fetchAddresses();
      }
      return success;
    } catch (err) {
      setError("Error al eliminar dirección");
      throw err;
    }
  };

  const getAddressByUserId = async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const address = await addressService.getAddressByUserId(userId);
      return address;
    } catch (err) {
      setError("Error al obtener dirección del usuario");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return {
    addresses,
    loading,
    error,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    getAddressByUserId,
  };
};