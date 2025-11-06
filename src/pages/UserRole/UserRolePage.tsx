import React from 'react';
import UserRoleList from '../../views/MaterialUI/UserRoleViews/UserRoleList';
import { PermissionGuard } from '../../guards';

/**
 * Página principal para la gestión de asignación de roles
 * Muestra la lista de todas las asignaciones de roles del sistema
 */
const UserRolePage: React.FC = () => {
    return (
        <PermissionGuard 
            url="/user-roles" 
            method="GET"
            fallback={
                <div className="p-6 text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h2>
                    <p className="text-gray-600">No tienes permisos para gestionar roles de usuarios.</p>
                    <p className="text-sm text-gray-500 mt-2">Esta función requiere permisos de administrador.</p>
                </div>
            }
        >
            <UserRoleList />
        </PermissionGuard>
    );
};

export default UserRolePage;