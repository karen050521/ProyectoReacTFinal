import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getRoleById, updateRole } from "../../services/roleService";
import Swal from "sweetalert2";

import { Role } from '../../models/Role';
import RoleFormValidator from '../../components/role/roleForm';
import Breadcrumb from "../../components/Breadcrumb";

const UpdateRolePage = () => {
    const { id } = useParams(); // Obtener el ID de la URL
    
    const navigate = useNavigate();
    const [role, setRole] = useState<Role | null>(null);

    // Cargar datos del rol después del montaje
    useEffect(() => {
        console.log("Id->"+id)
        const fetchRole = async () => {
            if (!id) return; // Evitar errores si el ID no está disponible
            const roleData = await getRoleById(parseInt(id));
            setRole(roleData);
        };

        fetchRole();
    }, [id]);

    const handleUpdateRole = async (theRole: Partial<Role>) => {
        try {
            if (!id) return;
            const updatedRole = await updateRole(parseInt(id), theRole);
            if (updatedRole) {
                Swal.fire({
                    title: "Completado",
                    text: "Se ha actualizado correctamente el registro",
                    icon: "success",
                    timer: 3000
                });
                navigate("/roles"); // Redirección en React Router
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

    if (!role) {
        return <div>Cargando...</div>; // Muestra un mensaje de carga mientras se obtienen los datos
    }

    return (
        <>
            <Breadcrumb pageName="Actualizar Rol" />
            <RoleFormValidator
                initialValues={role}
                mode={2} // 2 significa actualización
                onSubmit={handleUpdateRole}
            />
        </>
    );
};

export default UpdateRolePage;
