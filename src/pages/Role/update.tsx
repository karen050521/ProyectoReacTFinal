import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminGuard } from "../../guards";

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
        <AdminGuard 
            fallback={
                <div className="p-6 text-center">
                    <Breadcrumb pageName="Acceso Denegado" />
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h2>
                    <p className="text-gray-600">No tienes permisos para actualizar roles del sistema.</p>
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
            <Breadcrumb pageName="Actualizar Rol" />
            <RoleFormValidator
                initialValues={role}
                mode={2} // 2 significa actualización
                onSubmit={handleUpdateRole}
            />
        </AdminGuard>
    );
};

export default UpdateRolePage;
