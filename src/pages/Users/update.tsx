import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PermissionGuard } from "../../guards";

import { getUserById, updateUser } from "../../services/userService";
import Swal from "sweetalert2";

import { User } from '../../models/user';
import UserFormValidator from '../../components/Users/UserFormValidator';
import Breadcrumb from "../../components/Breadcrumb";

const UpdateUserPage = () => {
    const { id } = useParams(); // Obtener el ID de la URL
    
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);

    // Cargar datos del usuario después del montaje
    useEffect(() => {
        console.log("Id->"+id)
        const fetchUser = async () => {
            if (!id) return; // Evitar errores si el ID no está disponible
            const userData = await getUserById(parseInt(id));
            setUser(userData);
        };

        fetchUser();
    }, [id]);

    const handleUpdateUser = async (theUser: User) => {
        try {
            const updatedUser = await updateUser(Number(theUser.id) || 0, theUser);
            if (updatedUser) {
                Swal.fire({
                    title: "Completado",
                    text: "Se ha actualizado correctamente el registro",
                    icon: "success",
                    timer: 3000
                });
                navigate("/users"); // Redirección en React Router
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

    if (!user) {
        return <div>Cargando...</div>; // Muestra un mensaje de carga mientras se obtienen los datos
    }

    return (
        <PermissionGuard 
            url="/users" 
            method="PUT"
            fallback={
                <div className="p-6 text-center">
                    <Breadcrumb pageName="Acceso Denegado" />
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h2>
                    <p className="text-gray-600">No tienes permisos para actualizar usuarios.</p>
                </div>
            }
        >
            <Breadcrumb pageName="Actualizar Usuario" />
            <UserFormValidator
                handleUpdate={handleUpdateUser}
                mode={2} // 2 significa actualización
                user={user}
            />
        </PermissionGuard>
    );
};

export default UpdateUserPage;
