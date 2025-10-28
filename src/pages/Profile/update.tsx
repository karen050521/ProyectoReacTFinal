import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getProfileById, updateProfile } from "../../services/profileService";
import Swal from "sweetalert2";

import { Profile } from '../../models/Profile';
import ProfileFormValidator from '../../components/profile/profileForm';
import Breadcrumb from "../../components/Breadcrumb";

const UpdateProfilePage = () => {
    const { id } = useParams(); // Obtener el ID de la URL
    
    const navigate = useNavigate();
    const [profile, setProfile] = useState<Profile | null>(null);

    // Cargar datos del perfil después del montaje
    useEffect(() => {
        console.log("Id->"+id)
        const fetchProfile = async () => {
            if (!id) return; // Evitar errores si el ID no está disponible
            const profileData = await getProfileById(parseInt(id));
            setProfile(profileData);
        };

        fetchProfile();
    }, [id]);

    const handleUpdateProfile = async (theProfile: Profile) => {
        try {
            const updatedProfile = await updateProfile(theProfile.id || 0, theProfile);
            if (updatedProfile) {
                Swal.fire({
                    title: "Completado",
                    text: "Se ha actualizado correctamente el registro",
                    icon: "success",
                    timer: 3000
                });
                navigate("/profiles"); // Redirección en React Router
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

    if (!profile) {
        return <div>Cargando...</div>; // Muestra un mensaje de carga mientras se obtienen los datos
    }

    return (
        <>
            <Breadcrumb pageName="Actualizar Perfil" />
            <ProfileFormValidator
                handleUpdate={handleUpdateProfile}
                mode={2} // 2 significa actualización
                profile={profile}
            />
        </>
    );
};

export default UpdateProfilePage;
