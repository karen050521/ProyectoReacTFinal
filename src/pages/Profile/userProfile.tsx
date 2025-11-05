import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProfileByUserId, createProfile, updateProfile } from "../../services/profileService";
import { getUserById } from "../../services/userService";
import { Profile } from "../../models/Profile";
import { User } from "../../models/user";
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";

const UserProfilePage = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [phone, setPhone] = useState("");
    const [photo, setPhoto] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;
            try {
                setLoading(true);
                const numericUserId = parseInt(userId);
                
                // Obtener usuario
                const userData = await getUserById(numericUserId);
                setUser(userData);

                // Obtener perfil del usuario
                const profileData = await getProfileByUserId(numericUserId);
                console.log("Profile data received:", profileData);
                
                if (profileData) {
                    setProfile(profileData);
                    setPhone(profileData.phone || "");
                    setPhoto(profileData.photo || "");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    const handleSave = async () => {
        if (!userId) return;

        try {
            const profileData = {
                user_id: parseInt(userId),
                phone: phone || null,
                photo: photo || null,
            };

            if (profile?.id) {
                // Actualizar perfil existente
                const updated = await updateProfile(profile.id, profileData);
                if (updated) {
                    Swal.fire({
                        title: "Éxito",
                        text: "Perfil actualizado correctamente",
                        icon: "success",
                        timer: 2000
                    });
                    setProfile(updated);
                }
            } else {
                // Crear nuevo perfil
                const created = await createProfile(profileData);
                if (created) {
                    Swal.fire({
                        title: "Éxito",
                        text: "Perfil creado correctamente",
                        icon: "success",
                        timer: 2000
                    });
                    setProfile(created);
                }
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "No se pudo guardar el perfil",
                icon: "error",
                timer: 2000
            });
        }
    };

    if (loading) {
        return (
            <>
                <Breadcrumb pageName="Perfil de Usuario" />
                <div className="p-6 bg-white rounded-md shadow-md dark:bg-boxdark dark:border-strokedark">
                    <p className="text-gray-500 dark:text-gray-300">Cargando...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Breadcrumb pageName={`Perfil - ${user?.name || 'Usuario'}`} />
            <div className="p-6 bg-white rounded-md shadow-md dark:bg-boxdark dark:border-strokedark">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                    Perfil de {user?.name || 'Usuario'}
                </h2>

                {/* Información del usuario */}
                <div className="mb-6 p-4 bg-gray-50 rounded-md dark:bg-boxdark-2 dark:border-strokedark">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-white">Información del Usuario</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-300">ID</label>
                            <p className="text-gray-800 dark:text-white">{user?.id}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-300">Email</label>
                            <p className="text-gray-800 dark:text-white">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Formulario de perfil */}
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label htmlFor="phone" className="block text-lg font-medium text-gray-700 dark:text-white mb-2">
                            Teléfono
                        </label>
                        <input
                            id="phone"
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-form-input dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                            placeholder="Ingrese el número de teléfono"
                        />
                    </div>

                    <div>
                        <label htmlFor="photo" className="block text-lg font-medium text-gray-700 dark:text-white mb-2">
                            URL de Foto
                        </label>
                        <input
                            id="photo"
                            type="text"
                            value={photo}
                            onChange={(e) => setPhoto(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-form-input dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                            placeholder="Ingrese la URL de la foto"
                        />
                    </div>

                    {photo && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Vista previa de la foto
                            </label>
                            <img 
                                src={photo} 
                                alt="Preview" 
                                className="w-32 h-32 object-cover rounded-full border-2 border-gray-300 dark:border-strokedark"
                                onError={(e) => {
                                    e.currentTarget.src = "https://via.placeholder.com/150?text=No+Image";
                                }}
                            />
                        </div>
                    )}

                    {/* Fechas (solo si existe el perfil) */}
                    {profile && (
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t dark:border-strokedark">
                            {profile.created_at && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">
                                        Fecha de Creación
                                    </label>
                                    <p className="text-gray-800 dark:text-white">
                                        {new Date(profile.created_at).toLocaleString('es-ES')}
                                    </p>
                                </div>
                            )}
                            {profile.updated_at && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">
                                        Última Actualización
                                    </label>
                                    <p className="text-gray-800 dark:text-white">
                                        {new Date(profile.updated_at).toLocaleString('es-ES')}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Botones de acción */}
                <div className="flex gap-4 mt-8">
                    <button
                        onClick={handleSave}
                        style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                        className="py-2 px-6 font-semibold rounded-md hover:opacity-90"
                    >
                        {profile ? "Actualizar Perfil" : "Crear Perfil"}
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
        </>
    );
};

export default UserProfilePage;
