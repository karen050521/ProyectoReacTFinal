import React, { useEffect, useState } from "react";
import GenericTable from "../../components/GenericTable";
import { Session } from "../../models/Session";
import {sessionService} from "../../services/sessionService";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ListSessions: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]);

   const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const sessions = await sessionService.getSessions();
            console.debug('Session.list fetchData -> received', sessions);
            setSessions(sessions);
        } catch (error) {
            console.error("Error fetching sessions:", error);
        }
    };

    const handleAction = (action: string, item: Session) => {
        if (action === "edit") {
            console.log("Edit session:", item);
            navigate(`/sessions/update/${item.id}`);
        } else if (action === "delete") {
            console.log("Delete session:", item);
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
                    const success = await sessionService.deleteSession(item.id!);
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
            <h2>Session List</h2>
            <GenericTable
                data={sessions}
                columns={["id", "user_id", "token", "expiration", "FACode", "state", "created_at", "updated_at"]}
                actions={[
                    { name: "edit", label: "Edit" },
                    { name: "delete", label: "Delete" },
                ]}
                onAction={handleAction}
            />
        </div>
    );
};

export default ListSessions;