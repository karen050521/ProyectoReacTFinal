import React, { useEffect, useState } from "react";
import GenericTable from "../../components/GenericTable";
import { Password } from "../../models/Password";
import {passwordService} from "../../services/passawordService";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ListPasswords: React.FC = () => {
    const [passwords, setPasswords] = useState<Password[]>([]);
    
   const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const passwords = await passwordService.getPasswords();
            console.debug('Password.list fetchData -> received', passwords);
            setPasswords(passwords);
        } catch (error) {
            console.error("Error fetching passwords:", error);
        }
    };

    const handleAction = (action: string, item: Password) => {
        if (action === "edit") {
            console.log("Edit password:", item);
            navigate(`/passwords/update/${item.id}`);
        } else if (action === "delete") {
            console.log("Delete password:", item);
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
                    const success = await passwordService.deletePassword(item.id!);
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
            <h2>Password List</h2>
            <GenericTable
                data={passwords}
                columns={["id", "user_id", "content", "startAt", "endAt", "created_at", "updated_at"]}
                actions={[
                    { name: "edit", label: "Edit" },
                    { name: "delete", label: "Delete" },
                ]}
                onAction={handleAction}
            />
        </div>
    );
};

export default ListPasswords;