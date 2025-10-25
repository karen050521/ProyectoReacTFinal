import React, { useEffect, useState } from "react";
import GenericTable from "../../components/GenericTable";
import { RolePermission } from "../../models/RolePermission";
import {rolePermissionService} from "../../services/rolePermiService";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ListRolePermissions: React.FC = () => {
    const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);

   const navigate = useNavigate();

    useEffect(() => {

        fetchData();
        console.log("Role Permissions fetched:", rolePermissions);
    }, []);

    const fetchData = async () => {
        try {
            const rolePermissions = await rolePermissionService.getRolePermissions();
            setRolePermissions(rolePermissions);
        } catch (error) {
            console.error("Error fetching role permissions:", error);
        }
    };

    const handleAction = (action: string, item: RolePermission) => {
        if (action === "edit") {
            console.log("Edit role permission:", item);
            navigate(`/role-permissions/update/${item.id}`);
        } else if (action === "delete") {
            console.log("Delete role permission:", item);
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
                    const success = await rolePermissionService.deleteRolePermission(item.id!);
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
        <div>
            <h2>Role Permission List</h2>
            <GenericTable
                data={rolePermissions}
                columns={["id", "roleId", "permissionId"]}
                actions={[
                    { name: "edit", label: "Edit" },
                    { name: "delete", label: "Delete" },
                ]}
                onAction={handleAction}
            />
        </div>
    );
};

export default ListRolePermissions;