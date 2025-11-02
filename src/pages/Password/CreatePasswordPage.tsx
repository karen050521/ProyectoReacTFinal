import React from 'react';
import PasswordForm from '../../views/MaterialUI/PasswordViews/PasswordForm';

/**
 * Página para crear una nueva contraseña
 * Muestra el formulario de creación de contraseñas
 */
const CreatePasswordPage: React.FC = () => {
    return <PasswordForm isEditMode={false} />;
};

export default CreatePasswordPage;