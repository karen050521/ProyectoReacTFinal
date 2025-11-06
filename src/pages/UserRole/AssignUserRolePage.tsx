import React from 'react';
import UserRoleForm from '../../views/MaterialUI/UserRoleViews/UserRoleForm';
import { PermissionGuard } from '../../guards';

/**
 * Página para asignar un rol a un usuario
 * Muestra el formulario de asignación de roles
 */
const AssignUserRolePage: React.FC = () => {
    return (
        <PermissionGuard 
            url="/user-roles" 
            method="POST"
            fallback={
                <div className="p-6 text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h2>
                    <p className="text-gray-600">No tienes permisos para asignar roles a usuarios.</p>
                    <p className="text-sm text-gray-500 mt-2">Esta función requiere permisos de administrador.</p>
                </div>
            }
        >
            <UserRoleForm isEditMode={false} />
        </PermissionGuard>
    );
};

export default AssignUserRolePage;
