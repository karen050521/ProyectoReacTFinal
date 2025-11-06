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
            navigate(`/addresses/view/${item.id}`);
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
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">User List</h2>
                <button
                    onClick={() => navigate("/users/create")}
                    style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                    className="py-2 px-6 font-semibold rounded-md hover:opacity-90 flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Nuevo Usuario
                </button>
            </div>
            <GenericTable
                data={users}
                columns={["id", "name", "email"]}
                actions={[
                    { name: "view", label: "View" },
                    { name: "profile", label: "Profile" },
                    { name: "address", label: "Address" },
                    { name: "signature", label: "Signature" },
                    { name: "devices", label: "Devices" },
                    { name: "passwords", label: "Passwords" },
                    { name: "sessions", label: "Sessions" },
                    { name: "edit", label: "Edit" },
                    { name: "delete", label: "Delete" },
                ]}
                onAction={handleAction}
            />
        </div>
    );
};

export default ListUsers;