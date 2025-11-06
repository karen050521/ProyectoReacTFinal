"use client"
import { Role } from '../../models/Role';
import RoleFormValidator from '../../components/role/roleForm'; 
import { AdminGuard } from '../../guards';

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
        <AdminGuard 
            fallback={
                <div className="p-6 text-center">
                    <Breadcrumb pageName="Acceso Denegado" />
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h2>
                    <p className="text-gray-600">No tienes permisos para crear roles del sistema.</p>
                    <p className="text-sm text-gray-500 mt-2">Esta función está disponible solo para Administradores.</p>
                    <button
                      onClick={() => navigate(-1)}
                      className="mt-4 inline-flex items-center justify-center rounded-md bg-gray-600 py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
                    >
                      ← Volver
                    </button>
                </div>
            }
        >
            <div className="p-6">
                <Breadcrumb pageName="Crear Rol" />
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Role</h2>
                <RoleFormValidator
                    initialValues={{}}
                    mode={1} // 1 significa creación
                    onSubmit={handleCreateRole}
                />
            </div>
        </AdminGuard>
    );
};

export default CreateRolePage;
