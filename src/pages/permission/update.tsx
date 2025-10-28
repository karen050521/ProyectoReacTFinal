import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getPermissionById, updatePermission } from "../../services/permissionService";
import Swal from "sweetalert2";

import { Permission } from '../../models/Permission';
import PermissionFormValidator from '../../components/permission/permissionForm';
import Breadcrumb from "../../components/Breadcrumb";

const UpdatePermissionPage = () => {
    const { id } = useParams(); // Obtener el ID de la URL
    
    const navigate = useNavigate();
    const [permission, setPermission] = useState<Permission | null>(null);

    // Cargar datos del permiso después del montaje
    useEffect(() => {
        console.log("Id->"+id)
        const fetchPermission = async () => {
            if (!id) return; // Evitar errores si el ID no está disponible
            const permissionData = await getPermissionById(parseInt(id));
            setPermission(permissionData);
        };

        fetchPermission();
    }, [id]);

    const handleUpdatePermission = async (thePermission: Partial<Permission>) => {
        try {
            if (!id) return;
            const updatedPermission = await updatePermission(parseInt(id), thePermission);
            if (updatedPermission) {
                Swal.fire({
                    title: "Completado",
                    text: "Se ha actualizado correctamente el registro",
                    icon: "success",
                    timer: 3000
                });
                navigate("/permissions"); // Redirección en React Router
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

    if (!permission) {
        return <div>Cargando...</div>; // Muestra un mensaje de carga mientras se obtienen los datos
    }

    return (
        <>
            <Breadcrumb pageName="Actualizar Permiso" />
            <PermissionFormValidator
                initialValues={permission}
                mode={2} // 2 significa actualización
                onSubmit={handleUpdatePermission}
            />
        </>
    );
};

export default UpdatePermissionPage;
