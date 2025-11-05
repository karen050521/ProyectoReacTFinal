import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserRoleById, updateUserRole } from "../../services/userRoleService";
import Swal from "sweetalert2";
import { UserRole } from '../../models/UserRole';
import UserRoleFormValidator from '../../components/userRole/userRoleForm';
import Breadcrumb from "../../components/Breadcrumb";

const UpdateUserRolePage = () => {
    const { id } = useParams(); // Obtener el ID de la URL
    
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState<UserRole | null>(null);

    // Cargar datos del user role después del montaje
    useEffect(() => {
        console.log("Id->"+id)
        const fetchUserRole = async () => {
            if (!id) return; // Evitar errores si el ID no está disponible
            const userRoleData = await getUserRoleById(id);
            setUserRole(userRoleData);
        };

        fetchUserRole();
    }, [id]);

    const handleUpdateUserRole = async (theUserRole: UserRole) => {
        try {
            const updatedUserRole = await updateUserRole(theUserRole.id || "", theUserRole);
            if (updatedUserRole) {
                Swal.fire({
                    title: "Completado",
                    text: "Se ha actualizado correctamente el registro",
                    icon: "success",
                    timer: 3000
                });
                navigate("/user-roles"); // Redirección en React Router
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

    if (!userRole) {
        return <div>Cargando...</div>; // Muestra un mensaje de carga mientras se obtienen los datos
    }

    return (
        <>
            <Breadcrumb pageName="Actualizar Rol de Usuario" />
            <UserRoleFormValidator
                handleUpdate={handleUpdateUserRole}
                mode={2} // 2 significa actualización
                userRole={userRole}
            />
        </>
    );
};

export default UpdateUserRolePage;
