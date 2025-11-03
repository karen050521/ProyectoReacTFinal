import React from 'react';
import { useParams } from 'react-router-dom';
import UserRoleList from '../../views/MaterialUI/UserRoleViews/UserRoleList';
import UserRoleForm from '../../views/MaterialUI/UserRoleViews/UserRoleForm';

/**
 * Página principal unificada para la gestión de UserRoles
 * Maneja todos los casos: list, create, edit, filter by user/role
 */
const UserRolePage: React.FC = () => {
    const { action, id, userId, roleId } = useParams<{ 
        action?: 'assign' | 'update' | 'user' | 'role';
        id?: string;
        userId?: string;
        roleId?: string;
    }>();

    // 📝 FORMULARIO: Crear o editar
    if (action === 'assign') {
        return <UserRoleForm isEditMode={false} />;
    }

    if (action === 'update' && id) {
        return <UserRoleForm isEditMode={true} />;
    }

    // 📊 LISTA: Con filtros opcionales
    const userIdFilter = action === 'user' && userId ? parseInt(userId) : undefined;
    const roleIdFilter = action === 'role' && roleId ? parseInt(roleId) : undefined;

    return <UserRoleList userId={userIdFilter} roleId={roleIdFilter} />;
};

export default UserRolePage;