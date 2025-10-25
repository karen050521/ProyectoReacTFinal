"use client"
import React from "react";
import { Profile } from '../../models/Profile';
import ProfileFormValidator from '../../components/profile/profileForm'; 

import Swal from 'sweetalert2';
import { createProfile } from "../../services/profileService";
import Breadcrumb from '../../components/Breadcrumb';
import { useNavigate } from "react-router-dom";

const App = () => {
    const navigate = useNavigate();

    // Lógica de creación
    const handleCreateProfile = async (profile: Profile) => {

        try {
            const createdProfile = await createProfile(profile);
            if (createdProfile) {
                Swal.fire({
                    title: "Completado",
                    text: "Se ha creado correctamente el registro",
                    icon: "success",
                    timer: 3000
                })
                console.log("Perfil creado con éxito:", createdProfile);
                navigate("/profiles");
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
            {/* Formulario para crear un nuevo perfil */}
            <h2>Create Profile</h2>
                <Breadcrumb pageName="Crear Perfil" />
                <ProfileFormValidator
                    handleCreate={handleCreateProfile}
                    mode={1} // 1 significa creación
                />
        </div>
    );
};

export default App;
