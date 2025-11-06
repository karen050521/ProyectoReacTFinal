import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSessionsByUserId, deleteSession } from "../../services/sessionService";
import { getUserById } from "../../services/userService";
import { Session } from "../../models/Session";
import { User } from "../../models/user";
import Breadcrumb from "../../components/Breadcrumb";
import GenericTable from "../../components/GenericTable";
import Swal from "sweetalert2";

const UserSessionsPage = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [userId]);

    const fetchData = async () => {
        if (!userId) return;
        try {
            setLoading(true);
            const numericUserId = parseInt(userId);
            
            // Obtener usuario
            const userData = await getUserById(numericUserId);
            setUser(userData);

            // Obtener sesiones del usuario
            const sessionsData = await getSessionsByUserId(numericUserId);
            console.log("Sessions data received:", sessionsData);
            setSessions(sessionsData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = (action: string, item: Session) => {
        if (action === "view") {
            // Navegar a vista de detalle de sesión si existe
            console.log("View session:", item);
        } else if (action === "edit") {
            navigate(`/sessions/update/${item.id}`);
        } else if (action === "delete") {
            Swal.fire({
                title: "Eliminar Sesión",
                text: "¿Está seguro de querer eliminar esta sesión?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    // Pasar el userId al deleteSession
                    const success = await deleteSession(String(item.id!), item.user_id);
                    if (success) {
                        Swal.fire({
                            title: "Eliminado",
                            text: "La sesión se ha eliminado correctamente",
                            icon: "success"
                        });
                        fetchData(); // Recargar la lista
                    } else {
                        Swal.fire({
                            title: "Error",
                            text: "No se pudo eliminar la sesión",
                            icon: "error"
                        });
                    }
                }
            });
        }
    };

    if (loading) {
        return (
            <>
                <Breadcrumb pageName="Sesiones de Usuario" />
                <div className="p-6 bg-white rounded-md shadow-md">
                    <p className="text-gray-500">Cargando...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Breadcrumb pageName={`Sesiones - ${user?.name || 'Usuario'}`} />
            <div className="p-6">
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Sesiones de {user?.name || 'Usuario'}
                    </h2>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate(`/sessions/create?userId=${userId}`)}
                            style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                            className="py-2 px-6 font-semibold rounded-md hover:opacity-90 flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 5v14M5 12h14"/>
                            </svg>
                            Nueva Sesión
                        </button>
                        <button
                            onClick={() => navigate("/users")}
                            style={{ backgroundColor: '#6b7280', color: '#ffffff' }}
                            className="py-2 px-6 font-semibold rounded-md hover:opacity-90"
                        >
                            Volver a Usuarios
                        </button>
                    </div>
                </div>

                {/* Información del usuario */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-boxdark rounded-md">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-white">Información del Usuario</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">ID</label>
                            <p className="text-gray-800 dark:text-white">{user?.id}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Nombre</label>
                            <p className="text-gray-800 dark:text-white">{user?.name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                            <p className="text-gray-800 dark:text-white">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Tabla de sesiones */}
                {sessions.length === 0 ? (
                    <div className="bg-white dark:bg-boxdark rounded-md shadow-md p-6">
                        <p className="text-gray-600 dark:text-gray-400 text-center">Este usuario no tiene sesiones registradas.</p>
                        <div className="mt-4 text-center">
                            <button
                                onClick={() => navigate(`/sessions/create?userId=${userId}`)}
                                style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                                className="py-2 px-6 font-semibold rounded-md hover:opacity-90 inline-flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 5v14M5 12h14"/>
                                </svg>
                                Crear Primera Sesión
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-boxdark rounded-md shadow-md p-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                            Lista de Sesiones ({sessions.length})
                        </h3>
                        <GenericTable
                            data={sessions}
                            columns={["id", "token", "expiration", "FACode", "state", "created_at"]}
                            actions={[
                                { name: "edit", label: "Edit" },
                                { name: "delete", label: "Delete" },
                            ]}
                            onAction={handleAction}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default UserSessionsPage;
