"use client"
import { Role } from '../../models/Role';
import RoleFormValidator from '../../components/role/roleForm'; 

import Swal from 'sweetalert2';
import  { createRole }  from "../../services/roleService";
import Breadcrumb from '../../components/Breadcrumb';
import { useNavigate } from "react-router-dom";

const CreateRolePage = () => {
    const navigate = useNavigate();

    // Lógica de creación
    const handleCreateRole = async (role: Partial<Role>) => {
        try {
            const createdRole = await createRole(role as Omit<Role, "id">);
            if (createdRole) {
                Swal.fire({
                    title: "Completado",
                    text: "Se ha creado correctamente el registro",
                    icon: "success",
                    timer: 3000
                })
                console.log("Rol creado con éxito:", createdRole);
                navigate("/roles");
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
            <h2>Create Role</h2>
            <Breadcrumb pageName="Crear Rol" />
            <RoleFormValidator
                initialValues={{}}
                mode={1} // 1 significa creación
                onSubmit={handleCreateRole}
            />
        </div>
    );
};

export default CreateRolePage;
