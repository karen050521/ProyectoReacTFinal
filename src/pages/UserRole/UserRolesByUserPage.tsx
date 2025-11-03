import React from 'react';
import { useParams } from 'react-router-dom';
import UserRoleList from '../../views/MaterialUI/UserRoleViews/UserRoleList';

/**
 * Página para mostrar las asignaciones de un usuario específico
 * Útil cuando se navega desde el perfil de un usuario
 */
const UserRolesByUserPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    
    return <UserRoleList userId={userId ? parseInt(userId, 10) : undefined} />;
};

export default UserRolesByUserPage;