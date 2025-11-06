import { useState, useEffect } from "react";
import { passwordService } from "../services/passwordService";
import type { Password } from "../models/Password";

interface UsePasswordControllerReturn {
    passwords: Password[];
    loading: boolean;
    error: string | null;
    createPassword: (userId: number, passwordData: Omit<Password, "id" | "user_id">) => Promise<boolean>;
    updatePassword: (id: number, passwordData: Partial<Password>) => Promise<boolean>;
    deletePassword: (id: number) => Promise<boolean>;
    getPasswordById: (id: number) => Promise<Password | null>;
    getPasswordsByUserId: (userId: number) => Promise<void>;
    refreshPasswords: () => Promise<void>;
    currentPasswordId: number | null;
    setCurrentPasswordId: (id: number | null) => void;
    clearError: () => void;
}

export const usePasswordController = (): UsePasswordControllerReturn => {
    const [passwords, setPasswords] = useState<Password[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPasswordId, setCurrentPasswordId] = useState<number | null>(null);

    // Función para limpiar errores
    const clearError = (): void => {
        setError(null);
    };

    // Función para obtener todas las contraseñas
    const fetchAllPasswords = async (): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const data = await passwordService.getPasswords();
            setPasswords(data);
        } catch (err) {
            setError("Error al cargar las contraseñas");
            console.error("Error fetching passwords:", err);
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener contraseñas por usuario específico
    const getPasswordsByUserId = async (userId: number): Promise<void> => {
        console.log('🎛️ Controller getPasswordsByUserId - userId:', userId);
        setLoading(true);
        setError(null);
        try {
            const data = await passwordService.getPasswordsByUserId(userId);
            console.log('📊 Datos recibidos del servicio:', data);
            console.log('📊 Cantidad de contraseñas encontradas:', data.length);
            
            // 🐛 Debug detallado: mostrar user_id de cada contraseña
            data.forEach((password, index) => {
                console.log(`  Password ${index + 1}: user_id=${password.user_id}, id=${password.id}`);
            });
            
            setPasswords(data);
        } catch (err) {
            console.error('❌ Error en getPasswordsByUserId:', err);
            setError("Error al cargar el historial de contraseñas del usuario");
            console.error("Error fetching user passwords:", err);
        } finally {
            setLoading(false);
        }
    };

    // Función para crear una nueva contraseña
    const createPassword = async (
        userId: number, 
        passwordData: Omit<Password, "id" | "user_id">
    ): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const newPassword = await passwordService.createPassword(userId, passwordData);
            if (newPassword) {
                // Actualizar la lista local agregando la nueva contraseña
                setPasswords(prev => [...prev, newPassword]);
                return true;
            }
            setError("Error al crear la contraseña");
            return false;
        } catch (err) {
            setError("Error al crear la contraseña");
            console.error("Error creating password:", err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Función para actualizar una contraseña existente
    const updatePassword = async (
        id: number, 
        passwordData: Partial<Password>
    ): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const updatedPassword = await passwordService.updatePassword(id, passwordData);
            if (updatedPassword) {
                // Actualizar la lista local
                setPasswords(prev => 
                    prev.map(password => 
                        password.id === id ? updatedPassword : password
                    )
                );
                return true;
            }
            setError("Error al actualizar la contraseña");
            return false;
        } catch (err) {
            setError("Error al actualizar la contraseña");
            console.error("Error updating password:", err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Función para eliminar una contraseña
    const deletePassword = async (id: number): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const success = await passwordService.deletePassword(id);
            if (success) {
                // Remover de la lista local
                setPasswords(prev => prev.filter(password => password.id !== id));
                return true;
            }
            setError("Error al eliminar la contraseña");
            return false;
        } catch (err) {
            setError("Error al eliminar la contraseña");
            console.error("Error deleting password:", err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener una contraseña específica por ID
    const getPasswordById = async (id: number): Promise<Password | null> => {
        setLoading(true);
        setError(null);
        try {
            const password = await passwordService.getPasswordById(id);
            return password;
        } catch (err) {
            setError("Error al obtener la contraseña");
            console.error("Error fetching password by ID:", err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Función para refrescar la lista de contraseñas
    const refreshPasswords = async (): Promise<void> => {
        await fetchAllPasswords();
    };

    // Cargar todas las contraseñas al montar el componente
    useEffect(() => {
        fetchAllPasswords();
    }, []);

    return {
        passwords,
        loading,
        error,
        createPassword,
        updatePassword,
        deletePassword,
        getPasswordById,
        getPasswordsByUserId,
        refreshPasswords,
        currentPasswordId,
        setCurrentPasswordId,
        clearError,
    };
};