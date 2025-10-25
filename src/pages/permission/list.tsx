import React, { useEffect, useState } from "react";
import GenericTable from "../../components/GenericTable";
import { Permission } from "../../models/Permission";
import {permissionService} from "../../services/permissionService";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ListPermissions: React.FC = () => {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    
   const navigate = useNavigate();

    useEffect(() => {

        fetchData();
        console.log("Permissions fetched:", permissions);
    }, []);

    const fetchData = async () => {
        try {
            const permissions = await permissionService.getPermissions();
            setPermissions(permissions);
        } catch (error) {
            console.error("Error fetching permissions:", error);
        }
    };

    const handleAction = (action: string, item: Permission) => {
        if (action === "edit") {
            console.log("Edit permission:", item);
            navigate(`/permissions/update/${item.id}`);
        } else if (action === "delete") {
            console.log("Delete permission:", item);
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
                    const success = await permissionService.deletePermission(item.id!);
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
            <h2>Permission List</h2>
            <GenericTable
                data={permissions}
                columns={["id", "name", "email"]}
                actions={[
                    { name: "edit", label: "Edit" },
                    { name: "delete", label: "Delete" },
                ]}
                onAction={handleAction}
            />
        </div>
    );
};

export default ListPermissions;