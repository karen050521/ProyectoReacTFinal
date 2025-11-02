import React from 'react';
import PasswordForm from '../../views/MaterialUI/PasswordViews/PasswordForm';

/**
 * Página para editar una contraseña existente
 * Muestra el formulario de edición con los datos cargados
 */
const UpdatePasswordPage: React.FC = () => {
    return <PasswordForm isEditMode={true} />;
};

export default UpdatePasswordPage;