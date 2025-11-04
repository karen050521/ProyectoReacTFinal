"use client"
import React, { useState } from 'react'; // Asegúrate de importar useState
import { User } from '../../models/user';
import UserFormValidator from '../../components/Users/UserFormValidator'; 

import Swal from 'sweetalert2';
import  { createUser }  from "../../services/userService";
import Breadcrumb from '../../components/Breadcrumb';
import { useNavigate } from "react-router-dom";

const App = () => {
    const navigate = useNavigate();

    // Estado para almacenar el usuario a editar

    // Lógica de creación
    const handleCreateUser = async (user: User) => {

        try {
            const createdUser = await createUser(user);
            if (createdUser) {
                Swal.fire({
                    title: "Completado",
                    text: "Se ha creado correctamente el registro",
                    icon: "success",
                    timer: 3000
                })
                console.log("Usuario creado con éxito:", createdUser);
                navigate("/users");
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
        <>
            <Breadcrumb pageName="Crear Usuario" />
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Crear Nuevo Usuario</h2>
                <UserFormValidator
                    handleCreate={handleCreateUser}
                    mode={1} // 1 significa creación
                />
            </div>
        </>
    );
};

export default App;
