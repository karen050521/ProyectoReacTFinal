import React from 'react';
import UserRoleList from '../../views/MaterialUI/UserRoleViews/UserRoleList';

/**
 * Página alternativa para mostrar las asignaciones por usuario específico
 * Útil cuando se navega desde el perfil de un usuario
 */
const UserRolesByUserPage: React.FC = () => {
    // TODO: Obtener userId de los parámetros de la URL
    // const { userId } = useParams<{ userId: string }>();
    
    return <UserRoleList />;
    // return <UserRoleList userId={parseInt(userId || '0')} />;
};

export default UserRolesByUserPage;