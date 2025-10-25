import React, { useEffect, useState } from "react";
import GenericTable from "../../components/GenericTable";
import { UserRole } from "../../models/UserRole";
import {userRoleService} from "../../services/userRoleService";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ListUserRoles: React.FC = () => {
    const [userRoles, setUserRoles] = useState<UserRole[]>([]);

   const navigate = useNavigate();

    useEffect(() => {

        fetchData();
        console.log("UserRoles fetched:", userRoles);
    }, []);

    const fetchData = async () => {
        try {
            const userRoles = await userRoleService.getUserRoles();
            setUserRoles(userRoles);
        } catch (error) {
            console.error("Error fetching user roles:", error);
        }
    };

    const handleAction = (action: string, item: UserRole) => {
        if (action === "edit") {
            console.log("Edit user role:", item);
            navigate(`/user-roles/update/${item.id}`);
        } else if (action === "delete") {
            console.log("Delete user:", item);
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
                    const success = await userRoleService.deleteUserRole(item.id!);
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
            <h2>User List</h2>
            <GenericTable
                data={userRoles}
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

export default ListUserRoles;