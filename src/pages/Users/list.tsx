import React, { useEffect, useState } from "react";
import GenericTable from "../../components/GenericTable";
import { User } from "../../models/user";
import {userService} from "../../services/userService";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ListUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    
   const navigate = useNavigate();

    useEffect(() => {

        fetchData();
        console.log("Users fetched:", users);
    }, []);

    const fetchData = async () => {
        try {
            const users = await userService.getUsers();
            setUsers(users);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleAction = (action: string, item: User) => {
        if (action === "view") {
            navigate(`/users/view/${item.id}`);
        } else if (action === "edit") {
            console.log("Edit user:", item);
            navigate(`/users/update/${item.id}`);
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
                    const success = await userService.deleteUser(item.id!);
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
        } else if (action === "profile") {
            navigate(`/profiles/user/${item.id}`);
        } else if (action === "address") {
            navigate(`/addresses/user/${item.id}`);
        } else if (action === "signature") {
            navigate(`/signatures/user/${item.id}`);
        } else if (action === "devices") {
            navigate(`/devices/user/${item.id}`);
        } else if (action === "passwords") {
            navigate(`/passwords/user/${item.id}`);
        } else if (action === "sessions") {
            navigate(`/sessions/user/${item.id}`);
        }
    };

    return (
        <div>
            <h2>User List</h2>
            <GenericTable
                data={users}
                columns={["id", "name", "email"]}
                actions={[
                    { name: "view", label: "👁️" },
                    { name: "edit", label: "Edit" },
                    { name: "delete", label: "Delete" },
                    { name: "profile", label: "👤" },
                    { name: "address", label: "📍" },
                    { name: "signature", label: "✍️" },
                    { name: "devices", label: "📱" },
                    { name: "passwords", label: "🔑" },
                    { name: "sessions", label: "🔒" },
                ]}
                onAction={handleAction}
            />
        </div>
    );
};

export default ListUsers;