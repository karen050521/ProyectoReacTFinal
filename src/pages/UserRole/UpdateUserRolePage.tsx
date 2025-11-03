import React from 'react';
import UserRoleForm from '../../views/MaterialUI/UserRoleViews/UserRoleForm';

/**
 * Página para editar una asignación de rol existente
 * Muestra el formulario de edición con los datos cargados
 */
const UpdateUserRolePage: React.FC = () => {
    return <UserRoleForm isEditMode={true} />;
};

export default UpdateUserRolePage;