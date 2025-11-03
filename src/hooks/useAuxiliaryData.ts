/**
 * 🪝 Hook reutilizable para cargar datos auxiliares (users y roles)
 * 
 * Elimina la duplicación de código en:
 * - UserRoleList.tsx
 * - UserSelect.tsx  
 * - RoleSelect.tsx
 * - PasswordList.tsx
 * - PasswordForm.tsx
 * - Y cualquier otro componente que necesite estos datos
 */

import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { roleService } from '../services/roleService';
import type { User } from '../models/user';
import type { Role } from '../models/Role';

interface UseAuxiliaryDataReturn {
    users: User[];
    roles: Role[];
    loading: boolean;
    error: string | null;
    getUserName: (userId: number) => string;
    getRoleName: (roleId: number) => string;
    refetchUsers: () => Promise<void>;
    refetchRoles: () => Promise<void>;
}

export const useAuxiliaryData = (): UseAuxiliaryDataReturn => {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 👤 CARGAR USUARIOS
    const loadUsers = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const usersData = await userService.getUsers();
            setUsers(usersData);
            console.log('✅ useAuxiliaryData: Users loaded:', usersData.length);
        } catch (err) {
            console.error('❌ useAuxiliaryData: Error loading users:', err);
            setError('Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    // 🎭 CARGAR ROLES
    const loadRoles = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const rolesData = await roleService.getRoles();
            setRoles(rolesData);
            console.log('✅ useAuxiliaryData: Roles loaded:', rolesData.length);
        } catch (err) {
            console.error('❌ useAuxiliaryData: Error loading roles:', err);
            setError('Error al cargar roles');
        } finally {
            setLoading(false);
        }
    };

    // 🔍 FUNCIÓN PARA OBTENER NOMBRE DE USUARIO POR ID
    const getUserName = (userId: number): string => {
        const user = users.find(u => u.id === userId);
        if (!user) {
            console.warn(`⚠️ useAuxiliaryData: User not found for ID ${userId}`);
            return `Usuario ${userId}`;
        }
        return user.name || user.email || `Usuario ${userId}`;
    };

    // 🔍 FUNCIÓN PARA OBTENER NOMBRE DE ROL POR ID
    const getRoleName = (roleId: number): string => {
        const role = roles.find(r => r.id === roleId);
        if (!role) {
            console.warn(`⚠️ useAuxiliaryData: Role not found for ID ${roleId}`);
            return `Rol ${roleId}`;
        }
        return role.name || `Rol ${roleId}`;
    };

    // 🔄 FUNCIONES DE RE-FETCH (para casos que necesiten refrescar datos)
    const refetchUsers = async (): Promise<void> => {
        await loadUsers();
    };

    const refetchRoles = async (): Promise<void> => {
        await loadRoles();
    };

    // 🚀 CARGAR DATOS AL MONTAR EL HOOK
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Cargar ambos en paralelo para mejor performance
                await Promise.all([
                    loadUsers(),
                    loadRoles()
                ]);
                console.log('🎉 useAuxiliaryData: All data loaded successfully');
            } catch (err) {
                console.error('❌ useAuxiliaryData: Error in initial load:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return {
        users,
        roles,
        loading,
        error,
        getUserName,
        getRoleName,
        refetchUsers,
        refetchRoles
    };
};