"use client"
import React, { useEffect, useState } from "react"; // Asegúrate de importar useState
import { UserRole } from '../../models/UserRole';
import UserFormValidator from '../../components/Users/UserFormValidator'; 

import Swal from 'sweetalert2';
import  { createUserRole }  from "../../services/userRoleService";
import Breadcrumb from '../../components/Breadcrumb';
import { useNavigate } from "react-router-dom";

const App = () => {
    const navigate = useNavigate();

    // Estado para almacenar el usuario a editar

    // Lógica de creación
    const handleCreateUserRole = async (userRole: UserRole) => {

        try {
            const createdUserRole = await createUserRole(userRole);
            if (createdUserRole) {
                Swal.fire({
                    title: "Completado",
                    text: "Se ha creado correctamente el registro",
                    icon: "success",
                    timer: 3000
                })
                console.log("Usuario creado con éxito:", createdUserRole);
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
        <div>
            {/* Formulario para crear un nuevo rol de usuario */}
            <h2>Create User Role</h2>
                <Breadcrumb pageName="Crear Rol de Usuario" />
                <UserFormValidator
                    handleCreate={handleCreateUserRole}
                    mode={1} // 1 significa creación
                />
        </div>
    );
};

export default App;
