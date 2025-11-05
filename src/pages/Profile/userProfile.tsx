import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProfileByUserId, createProfileByUserId, updateProfileByUserId } from "../../services/profileService";
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
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;
            try {
                setLoading(true);
                const numericUserId = Number.parseInt(userId);
                
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
                    setPhotoPreview(profileData.photo || "");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoFile(file);
            // Crear preview de la imagen
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!userId) return;

        try {
            const profileData = {
                user_id: Number.parseInt(userId),
                phone: phone || null,
                photo: photo || null,
            };

            if (profile?.id) {
                // Actualizar perfil existente usando /profiles/user/:userId
                const numericUserId = Number.parseInt(userId);
                const updated = await updateProfileByUserId(numericUserId, profileData, photoFile || undefined);
                if (updated) {
                    Swal.fire({
                        title: "Éxito",
                        text: "Perfil actualizado correctamente",
                        icon: "success",
                        timer: 2000
                    });
                    setProfile(updated);
                    setPhotoFile(null);
                    if (updated.photo) {
                        setPhotoPreview(updated.photo);
                    }
                }
            } else {
                // Crear nuevo perfil usando el endpoint correcto /profiles/user/:userId
                const numericUserId = Number.parseInt(userId);
                const profileDataWithoutUserId = {
                    phone: phone || null,
                    photo: photo || null,
                };
                const created = await createProfileByUserId(numericUserId, profileDataWithoutUserId, photoFile || undefined);
                if (created) {
                    Swal.fire({
                        title: "Éxito",
                        text: "Perfil creado correctamente",
                        icon: "success",
                        timer: 2000
                    });
                    setProfile(created);
                    setPhotoFile(null);
                    if (created.photo) {
                        setPhotoPreview(created.photo);
                    }
                }
            }
        } catch (error) {
            console.error("Error saving profile:", error);
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
                <div className="p-6 bg-white rounded-md shadow-md">
                    <p className="text-gray-500">Cargando...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Breadcrumb pageName={`Perfil - ${user?.name || 'Usuario'}`} />
            <div className="p-6 bg-white rounded-md shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    Perfil de {user?.name || 'Usuario'}
                </h2>

                {/* Información del usuario */}
                <div className="mb-6 p-4 bg-gray-50 rounded-md">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">Información del Usuario</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500">ID</label>
                            <p className="text-gray-800">{user?.id}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Email</label>
                            <p className="text-gray-800">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Formulario de perfil */}
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label htmlFor="phone" className="block text-lg font-medium text-gray-700 mb-2">
                            Teléfono
                        </label>
                        <input
                            id="phone"
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ingrese el número de teléfono"
                        />
                    </div>

                    <div>
                        <label htmlFor="photo" className="block text-lg font-medium text-gray-700 mb-2">
                            URL de Foto (Opcional)
                        </label>
                        <input
                            id="photo"
                            type="text"
                            value={photo}
                            onChange={(e) => setPhoto(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ingrese la URL de la foto"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            O sube un archivo de imagen abajo
                        </p>
                    </div>

                    <div>
                        <label htmlFor="photoFile" className="block text-lg font-medium text-gray-700 mb-2">
                            Subir Foto
                        </label>
                        <input
                            id="photoFile"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Formatos permitidos: JPG, PNG, GIF (máx. 5MB)
                        </p>
                    </div>

                    {photoPreview && (
                        <div>
                            <span className="block text-sm font-medium text-gray-700 mb-2">
                                Vista previa de la foto
                            </span>
                            <img 
                                src={photoPreview} 
                                alt="Preview" 
                                className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
                                onError={(e) => {
                                    e.currentTarget.src = "https://via.placeholder.com/150?text=No+Image";
                                }}
                            />
                        </div>
                    )}

                    {/* Fechas (solo si existe el perfil) */}
                    {profile && (
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            {profile.created_at && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">
                                        Fecha de Creación
                                    </label>
                                    <p className="text-gray-800">
                                        {new Date(profile.created_at).toLocaleString('es-ES')}
                                    </p>
                                </div>
                            )}
                            {profile.updated_at && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">
                                        Última Actualización
                                    </label>
                                    <p className="text-gray-800">
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
