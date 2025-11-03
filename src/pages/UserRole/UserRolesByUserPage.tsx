import React from 'react';
import { useParams } from 'react-router-dom';
import UserRoleList from '../../views/MaterialUI/UserRoleViews/UserRoleList';

/**
 * Página alternativa para mostrar las asignaciones por usuario específico
 * Útil cuando se navega desde el perfil de un usuario
 */
const UserRolesByUserPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    
    return <UserRoleList userId={parseInt(userId || '0')} />;
};

export default UserRolesByUserPage;