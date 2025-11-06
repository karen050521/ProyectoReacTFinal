import React, { useEffect, useState } from "react";
import GenericTable from "../../components/GenericTable";
import { Session } from "../../models/Session";
import {sessionService} from "../../services/sessionService";
import { PermissionGuard, ButtonGuard } from "../../guards";

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
        <PermissionGuard 
            url="/sessions" 
            method="GET"
            fallback={
                <div className="p-6 text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h2>
                    <p className="text-gray-600">No tienes permisos para ver las sesiones de usuarios.</p>
                    <p className="text-sm text-gray-500 mt-2">Esta función requiere permisos especiales.</p>
                </div>
            }
        >
            <div className="p-6">
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Session List</h2>
                    <ButtonGuard
                        url="/sessions"
                        method="POST"
                        onClick={() => navigate("/sessions/create")}
                        className="py-2 px-6 font-semibold rounded-md hover:opacity-90 flex items-center gap-2"
                        style={{ backgroundColor: '#059669', color: '#ffffff' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14M5 12h14"/>
                        </svg>
                        Nueva Sesión
                    </ButtonGuard>
                </div>
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
        </PermissionGuard>
    );
};

export default ListSessions;