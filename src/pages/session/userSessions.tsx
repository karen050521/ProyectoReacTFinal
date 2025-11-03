import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSessionsByUserId } from "../../services/sessionService";
import { getUserById } from "../../services/userService";
import { Session } from "../../models/Session";
import { User } from "../../models/user";
import Breadcrumb from "../../components/Breadcrumb";
import GenericTable from "../../components/GenericTable";

const UserSessionsPage = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

        fetchData();
    }, [userId]);

    const handleAction = (action: string, item: Session) => {
        if (action === "view") {
            // Navegar a vista de detalle de sesión si existe
            console.log("View session:", item);
        } else if (action === "edit") {
            navigate(`/sessions/update/${item.id}`);
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
                    <h2 className="text-2xl font-bold text-gray-800">
                        Sesiones de {user?.name || 'Usuario'}
                    </h2>
                    <button
                        onClick={() => navigate("/users")}
                        style={{ backgroundColor: '#6b7280', color: '#ffffff' }}
                        className="py-2 px-6 font-semibold rounded-md hover:opacity-90"
                    >
                        Volver a Usuarios
                    </button>
                </div>

                {/* Información del usuario */}
                <div className="mb-6 p-4 bg-gray-50 rounded-md">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">Información del Usuario</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500">ID</label>
                            <p className="text-gray-800">{user?.id}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Nombre</label>
                            <p className="text-gray-800">{user?.name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Email</label>
                            <p className="text-gray-800">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Tabla de sesiones */}
                {sessions.length === 0 ? (
                    <div className="bg-white rounded-md shadow-md p-6">
                        <p className="text-gray-600 text-center">Este usuario no tiene sesiones registradas.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-md shadow-md p-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">
                            Lista de Sesiones ({sessions.length})
                        </h3>
                        <GenericTable
                            data={sessions}
                            columns={["id", "token", "expiration", "FACode", "state", "created_at"]}
                            actions={[
                                { name: "edit", label: "Edit" },
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
