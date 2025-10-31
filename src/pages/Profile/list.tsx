import React, { useEffect, useState } from "react";
import GenericTable from "../../components/GenericTable";
import { Profile } from "../../models/Profile";
import {profileService} from "../../services/profileService";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


const ListProfiles: React.FC = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);

   const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const profiles = await profileService.getProfiles();
            console.debug('Profile.list fetchData -> received', profiles);
            setProfiles(profiles);
        } catch (error) {
            console.error("Error fetching profiles:", error);
        }
    };

    const handleAction = (action: string, item: Profile) => {
        if (action === "edit") {
            console.log("Edit profile:", item);
            navigate(`/profiles/update/${item.id}`);
        } else if (action === "delete") {
            console.log("Delete profile:", item);
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
                    const success = await profileService.deleteProfile(item.id!);
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
            <h2>Profile List</h2>
            <GenericTable
                data={profiles}
                columns={["id", "user_id", "phone", "photo", "created_at", "updated_at"]}
                actions={[
                    { name: "edit", label: "Edit" },
                    { name: "delete", label: "Delete" },
                ]}
                onAction={handleAction}
            />
        </div>
    );
};

export default ListProfiles;