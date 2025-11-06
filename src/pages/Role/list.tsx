import React, { useEffect, useState } from "react";
import GenericTable from "../../components/GenericTable";
import { Role } from "../../models/Role";
import {roleService} from "../../services/roleService";
import { AdminGuard, ButtonGuard } from "../../guards";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ListRoles: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);

   const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const roles = await roleService.getRoles();
            setRoles(roles);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const handleAction = (action: string, item: Role) => {
        if (action === "edit") {
            console.log("Edit role:", item);
            navigate(`/roles/update/${item.id}`);
        } else if (action === "delete") {
            console.log("Delete role :", item);
            Swal.fire({
                title: "Eliminación",
                text: "Está seguro de querer eliminar el registro?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, eliminar",
                cancelButtonText: "No"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const success = await roleService.deleteRole(item.id!);
                    if (success) {
                        Swal.fire({
                            title: "Eliminado",
                            text: "El registro se ha eliminado",
                            icon: "success"
                        });
                    }
                    // 🔹 Vuelve a obtener los usuarios después de eliminar uno
                    fetchData();
                }
            });
        }
    };

    return (
        <AdminGuard 
            fallback={
                <div className="p-6 text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h2>
                    <p className="text-gray-600">No tienes permisos para gestionar roles.</p>
                    <p className="text-sm text-gray-500 mt-2">Esta función requiere rol Administrator.</p>
                </div>
            }
        >
            <div className="p-6">
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Role List</h2>
                    <ButtonGuard
                        url="/roles"
                        method="POST"
                        onClick={() => navigate("/roles/create")}
                        className="py-2 px-6 font-semibold rounded-md hover:opacity-90 flex items-center gap-2"
                        style={{ backgroundColor: '#9333ea', color: '#ffffff' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14M5 12h14"/>
                        </svg>
                        Nuevo Rol
                    </ButtonGuard>
                </div>
                <GenericTable
                    data={roles}
                    columns={["id", "name", "description"]}
                    actions={[
                        { name: "edit", label: "Edit" },
                        { name: "delete", label: "Delete" },
                    ]}
                    onAction={handleAction}
                />
            </div>
        </AdminGuard>
    );
};

export default ListRoles;