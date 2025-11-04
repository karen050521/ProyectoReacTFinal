import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById } from "../../services/userService";
import { User } from '../../models/user';
import Breadcrumb from "../../components/Breadcrumb";

const ViewUserPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const userData = await getUserById(parseInt(id));
                setUser(userData);
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    if (loading) {
        return (
            <>
                <Breadcrumb pageName="Ver Usuario" />
                <div className="p-6 bg-white rounded-md shadow-md">
                    <p className="text-gray-500">Cargando...</p>
                </div>
            </>
        );
    }

    if (!user) {
        return (
            <>
                <Breadcrumb pageName="Ver Usuario" />
                <div className="p-6 bg-white rounded-md shadow-md">
                    <p className="text-red-500">Usuario no encontrado</p>
                    <button
                        onClick={() => navigate("/users")}
                        style={{ backgroundColor: '#6b7280', color: '#ffffff' }}
                        className="mt-4 py-2 px-6 font-semibold rounded-md hover:opacity-90"
                    >
                        Volver a la lista
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Breadcrumb pageName="Ver Usuario" />
            <div className="p-6 bg-white rounded-md shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Información del Usuario</h2>
                
                <div className="grid grid-cols-1 gap-6">
                    {/* ID */}
                    <div className="border-b pb-4">
                        <label className="block text-sm font-medium text-gray-500 mb-1">ID</label>
                        <p className="text-lg text-gray-800">{user.id}</p>
                    </div>

                    {/* Nombre */}
                    <div className="border-b pb-4">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
                        <p className="text-lg text-gray-800">{user.name}</p>
                    </div>

                    {/* Email */}
                    <div className="border-b pb-4">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                        <p className="text-lg text-gray-800">{user.email}</p>
                    </div>

                    {/* Fecha de creación */}
                    {user.created_at && (
                        <div className="border-b pb-4">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Fecha de Creación</label>
                            <p className="text-lg text-gray-800">
                                {new Date(user.created_at).toLocaleString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    )}

                    {/* Última actualización */}
                    {user.updated_at && (
                        <div className="border-b pb-4">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Última Actualización</label>
                            <p className="text-lg text-gray-800">
                                {new Date(user.updated_at).toLocaleString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    )}
                </div>

                {/* Botones de acción */}
                <div className="flex gap-4 mt-8">
                    <button
                        onClick={() => navigate(`/users/update/${user.id}`)}
                        style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                        className="py-2 px-6 font-semibold rounded-md hover:opacity-90"
                    >
                        Editar Usuario
                    </button>
                    <button
                        onClick={() => navigate("/users")}
                        style={{ backgroundColor: '#6b7280', color: '#ffffff' }}
                        className="py-2 px-6 font-semibold rounded-md hover:opacity-90"
                    >
                        Volver a la lista
                    </button>
                </div>
            </div>
        </>
    );
};

export default ViewUserPage;
