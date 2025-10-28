"use client"
import { Permission } from '../../models/Permission';
import PermissionFormValidator from '../../components/permission/permissionForm'; 

import Swal from 'sweetalert2';
import  { createPermission }  from "../../services/permissionService";
import Breadcrumb from '../../components/Breadcrumb';
import { useNavigate } from "react-router-dom";

const CreatePermissionPage = () => {
    const navigate = useNavigate();

    // Lógica de creación
    const handleCreatePermission = async (permission: Partial<Permission>) => {
        try {
            const createdPermission = await createPermission(permission as Omit<Permission, "id">);
            if (createdPermission) {
                Swal.fire({
                    title: "Completado",
                    text: "Se ha creado correctamente el registro",
                    icon: "success",
                    timer: 3000
                })
                console.log("Permiso creado con éxito:", createdPermission);
                navigate("/permissions");
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
            <h2>Create Permission</h2>
            <Breadcrumb pageName="Crear Permiso" />
            <PermissionFormValidator
                initialValues={{}}
                mode={1} // 1 significa creación
                onSubmit={handleCreatePermission}
            />
        </div>
    );
};

export default CreatePermissionPage;
