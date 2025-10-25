import React, { useEffect, useState } from "react";
import GenericTable from "../../components/GenericTable";
import { Role } from "../../models/Role";
import {roleService} from "../../services/roleService";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ListRoles: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);

   const navigate = useNavigate();

    useEffect(() => {

        fetchData();
        console.log("Roles fetched:", roles);
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
        <div>
            <h2>Role List</h2>
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
    );
};

export default ListRoles;