import { useState, useEffect } from 'react';
import { roleService } from '../services/roleService';
import api from '../interceptors/axiosInterceptor';
import type { Role } from '../models/Role';

export interface User {
    id: number;
    name: string;
    email: string;
}

/**
 * Hook reutilizable para cargar datos auxiliares (usuarios y roles)
 * Usado en UserRoleList, UserRoleForm y otros componentes
 */
export const useAuxiliaryData = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const loadUsers = async (): Promise<User[]> => {
        try {
            const response = await api.get('/users');
            const usersData = response.data;
            setUsers(usersData);
            return usersData;
        } catch (err) {
            console.error('Error al obtener usuarios:', err);
            setError('Error al cargar usuarios');
            return [];
        }
    };

    const loadRoles = async (): Promise<Role[]> => {
        try {
            const rolesData = await roleService.getRoles();
            setRoles(rolesData);
            return rolesData;
        } catch (err) {
            console.error('Error al obtener roles:', err);
            setError('Error al cargar roles');
            return [];
        }
    };

    const loadAuxiliaryData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            await Promise.all([
                loadUsers(),
                loadRoles()
            ]);
        } catch (err) {
            console.error('Error cargando datos auxiliares:', err);
            setError('Error al cargar datos auxiliares');
        } finally {
            setLoading(false);
        }
    };

    // Funciones auxiliares para obtener nombres
    const getUserName = (userId: number): string => {
        const user = users.find(u => u.id === userId);
        return user ? `${user.name} (${user.email})` : `Usuario #${userId}`;
    };

    const getRoleName = (roleId: number): string => {
        const role = roles.find(r => r.id === roleId);
        return role ? role.name : `Rol #${roleId}`;
    };

    // Cargar datos al montar el hook
    useEffect(() => {
        loadAuxiliaryData();
    }, []);

    return {
        // Estados
        users,
        roles,
        loading,
        error,
        
        // Métodos
        loadUsers,
        loadRoles,
        loadAuxiliaryData,
        getUserName,
        getRoleName,
        
        // Utilidades
        clearError: () => setError(null)
    };
};