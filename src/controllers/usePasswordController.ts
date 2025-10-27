import { useState, useEffect } from "react";
import { passwordService } from "../services/passwordService";
import { Password } from "../models/Password";

export const usePasswordController = () => {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPasswords = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await passwordService.getPasswords();
      setPasswords(data);
    } catch (err) {
      setError("Error al cargar contraseñas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPasswordsByUserId = async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await passwordService.getPasswordsByUserId(userId);
      setPasswords(data);
      return data;
    } catch (err) {
      setError("Error al cargar historial de contraseñas");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createPassword = async (userId: number, password: Omit<Password, "id" | "user_id">) => {
    try {
      const newPassword = await passwordService.createPassword(userId, password);
      if (newPassword) {
        await fetchPasswordsByUserId(userId);
        return newPassword;
      }
    } catch (err) {
      setError("Error al crear contraseña");
      throw err;
    }
  };

  const updatePassword = async (id: number, password: Partial<Password>) => {
    try {
      const updated = await passwordService.updatePassword(id, password);
      if (updated) {
        await fetchPasswords();
        return updated;
      }
    } catch (err) {
      setError("Error al actualizar contraseña");
      throw err;
    }
  };

  const deletePassword = async (id: number) => {
    try {
      const success = await passwordService.deletePassword(id);
      if (success) {
        await fetchPasswords();
      }
      return success;
    } catch (err) {
      setError("Error al eliminar contraseña");
      throw err;
    }
  };

  useEffect(() => {
    fetchPasswords();
  }, []);

  return {
    passwords,
    loading,
    error,
    fetchPasswords,
    fetchPasswordsByUserId,
    createPassword,
    updatePassword,
    deletePassword,
  };
};