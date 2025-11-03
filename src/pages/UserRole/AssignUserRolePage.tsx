import React from 'react';
import UserRoleForm from '../../views/MaterialUI/UserRoleViews/UserRoleForm';

/**
 * Página para asignar un rol a un usuario
 * Muestra el formulario de asignación de roles
 */
const AssignUserRolePage: React.FC = () => {
    return <UserRoleForm isEditMode={false} />;
};

export default AssignUserRolePage;
