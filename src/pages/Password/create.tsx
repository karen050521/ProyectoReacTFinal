"use client"
import { Password } from '../../models/Password';
import PasswordFormValidator from '../../components/password/passwordForm'; 

import Swal from 'sweetalert2';
import { createPassword } from "../../services/passawordService";
import Breadcrumb from '../../components/Breadcrumb';
import { useNavigate } from "react-router-dom";

const CreatePasswordPage = () => {
    const navigate = useNavigate();

    // Lógica de creación
    const handleCreatePassword = async (password: Password) => {
        try {
            const createdPassword = await createPassword(password);
            if (createdPassword) {
                Swal.fire({
                    title: "Completado",
                    text: "Se ha creado correctamente el registro",
                    icon: "success",
                    timer: 3000
                })
                console.log("Contraseña creada con éxito:", createdPassword);
                navigate("/passwords");
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Existe un problema al momento de crear el registro",
                    icon: "error",
                    timer: 3000
                })
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Existe un problema al momento de crear el registro",
                icon: "error",
                timer: 3000
            })
        }
    };

    return (
        <div>
            {/* Formulario para crear una nueva contraseña */}
            <h2>Create Password</h2>
            <Breadcrumb pageName="Crear Contraseña" />
            <PasswordFormValidator
                handleCreate={handleCreatePassword}
                mode={1} // 1 significa creación
            />
        </div>
    );
};

export default CreatePasswordPage;
