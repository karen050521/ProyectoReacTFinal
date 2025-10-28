import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getPasswordById, updatePassword } from "../../services/passawordService";
import Swal from "sweetalert2";

import { Password } from '../../models/Password';
import PasswordFormValidator from '../../components/password/passwordForm';
import Breadcrumb from "../../components/Breadcrumb";

const UpdatePasswordPage = () => {
    const { id } = useParams(); // Obtener el ID de la URL
    
    const navigate = useNavigate();
    const [password, setPassword] = useState<Password | null>(null);

    // Cargar datos de la contraseña después del montaje
    useEffect(() => {
        console.log("Id->"+id)
        const fetchPassword = async () => {
            if (!id) return; // Evitar errores si el ID no está disponible
            const passwordData = await getPasswordById(parseInt(id));
            setPassword(passwordData);
        };

        fetchPassword();
    }, [id]);

    const handleUpdatePassword = async (thePassword: Password) => {
        try {
            const updatedPassword = await updatePassword(thePassword.id || 0, thePassword);
            if (updatedPassword) {
                Swal.fire({
                    title: "Completado",
                    text: "Se ha actualizado correctamente el registro",
                    icon: "success",
                    timer: 3000
                });
                navigate("/passwords"); // Redirección en React Router
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Existe un problema al momento de actualizar el registro",
                    icon: "error",
                    timer: 3000
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Existe un problema al momento de actualizar el registro",
                icon: "error",
                timer: 3000
            });
        }
    };

    if (!password) {
        return <div>Cargando...</div>; // Muestra un mensaje de carga mientras se obtienen los datos
    }

    return (
        <>
            <Breadcrumb pageName="Actualizar Contraseña" />
            <PasswordFormValidator
                handleUpdate={handleUpdatePassword}
                mode={2} // 2 significa actualización
                password={password}
            />
        </>
    );
};

export default UpdatePasswordPage;
