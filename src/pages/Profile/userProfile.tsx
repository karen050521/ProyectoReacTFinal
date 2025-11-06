import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProfileByUserId, createProfileByUserId, updateProfile } from "../../services/profileService";
import { getUserById } from "../../services/userService";
import { Profile } from "../../models/Profile";
import { User } from "../../models/user";
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon, Upload as UploadIcon } from "@mui/icons-material";

type UIMode = "tailwind" | "material";

const UserProfilePage = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [uiMode, setUiMode] = useState<UIMode>("tailwind");
    const [profile, setProfile] = useState<Profile | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [phone, setPhone] = useState("");
    const [photo, setPhoto] = useState("");
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string>("");

    // Función para construir la URL completa de la imagen
    const getImageUrl = (photoPath: string | null | undefined): string => {
        if (!photoPath) return "";
        
        // Si ya es una URL completa, devolverla
        if (photoPath.startsWith("http://") || photoPath.startsWith("https://")) {
            return photoPath;
        }
        
        // Si es un path relativo, construir la URL completa
        const API_BASE = (import.meta as any).env.VITE_API_URL || "http://127.0.0.1:5000";
        const baseUrl = API_BASE.replace(/\/$/, ''); // Eliminar slash final si existe
        
        // Asegurarse de que el path comience con /
        const path = photoPath.startsWith('/') ? photoPath : `/${photoPath}`;
        
        return `${baseUrl}${path}`;
    };

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
                    // Construir URL completa para la imagen
                    const imageUrl = getImageUrl(profileData.photo);
                    console.log("Image URL:", imageUrl);
                    setPhotoPreview(imageUrl);
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
                // Actualizar perfil existente usando /profiles/:id (PUT)
                const updated = await updateProfile(profile.id, profileData, photoFile || undefined);
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
                        setPhotoPreview(getImageUrl(updated.photo));
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
            <div className="flex justify-center items-center min-h-screen">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
        );
    }

    // ============ RENDER TAILWIND ============
    const renderTailwind = () => (
        <>
            <Breadcrumb pageName={`${user?.name || "User"} - Profile`} />
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                {/* Header */}
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center">
                    <h3 className="font-medium text-black dark:text-white text-xl">
                        {user?.name || "User"} - Profile
                    </h3>
                    <button
                        onClick={() => navigate("/users")}
                        className="inline-flex items-center gap-2 rounded-md border border-stroke py-2 px-4 text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                    >
                        <ArrowBackIcon fontSize="small" />
                        VOLVER
                    </button>
                </div>

                <div className="p-6.5">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Columna izquierda: Foto de perfil */}
                        <div className="lg:col-span-1 flex flex-col items-center">
                            <div className="mb-4 w-48 h-48 rounded-lg overflow-hidden border-2 border-stroke dark:border-strokedark bg-gray-100 dark:bg-meta-4">
                                {photoPreview ? (
                                    <img 
                                        src={photoPreview} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            console.error("Error loading image:", photoPreview);
                                            e.currentTarget.src = "https://via.placeholder.com/200?text=No+Image";
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        Sin imagen
                                    </div>
                                )}
                            </div>

                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary py-2 px-4 text-white hover:bg-opacity-90">
                                <UploadIcon fontSize="small" />
                                <span>Subir Foto</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* Columna derecha: Información del perfil */}
                        <div className="lg:col-span-2">
                            <div className="mb-6">
                                <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                                    Name: <span className="font-bold">{user?.name || "N/A"}</span>
                                </label>
                            </div>

                            <div className="mb-6">
                                <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                                    Email: <span className="font-normal">{user?.email || "N/A"}</span>
                                </label>
                            </div>

                            <div>
                                <label htmlFor="phone" className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                                    Phone:
                                </label>
                                <input
                                    id="phone"
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+47 300 111 23 33"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={handleSave}
                                    className="flex justify-center rounded bg-primary py-3 px-6 font-medium text-gray hover:bg-opacity-90"
                                >
                                    {profile ? "Update" : "Create"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    // ============ RENDER MATERIAL UI ============
    const renderMaterialUI = () => (
        <>
            <Breadcrumb pageName={`${user?.name || "User"} - Profile`} />
            <Paper elevation={3} sx={{ p: 3 }}>
                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4" component="h1" fontWeight="bold">
                        {user?.name || "User"} - Profile
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate("/users")}
                        size="large"
                    >
                        VOLVER
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {/* Columna izquierda: Foto de perfil */}
                    <Stack spacing={2} alignItems="center" sx={{ flex: '0 0 auto' }}>
                        <Box
                            sx={{
                                width: 200,
                                height: 200,
                                borderRadius: 2,
                                overflow: 'hidden',
                                border: '2px solid',
                                borderColor: 'divider',
                                bgcolor: 'grey.100',
                            }}
                        >
                            {photoPreview ? (
                                <img 
                                    src={photoPreview} 
                                    alt="Profile" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => {
                                        console.error("Error loading image:", photoPreview);
                                        e.currentTarget.src = "https://via.placeholder.com/200?text=No+Image";
                                    }}
                                />
                            ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                    <Typography color="text.secondary">Sin imagen</Typography>
                                </Box>
                            )}
                        </Box>

                        <Button
                            variant="contained"
                            component="label"
                            startIcon={<UploadIcon />}
                        >
                            Subir Foto{" "}
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleFileChange}
                            />
                        </Button>
                    </Stack>

                    {/* Columna derecha: Información del perfil */}
                    <Box sx={{ flex: '1 1 300px' }}>
                        <Box mb={3}>
                            <Typography variant="body1" gutterBottom>
                                <strong>Name:</strong> {user?.name || "N/A"}
                            </Typography>
                        </Box>

                        <Box mb={3}>
                            <Typography variant="body1" gutterBottom>
                                <strong>Email:</strong> {user?.email || "N/A"}
                            </Typography>
                        </Box>

                        <TextField
                            fullWidth
                            label="Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+47 300 111 23 33"
                            sx={{ mb: 3 }}
                        />

                        <Button
                            variant="contained"
                            onClick={handleSave}
                            size="large"
                        >
                            {profile ? "Update" : "Create"}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </>
    );

    return (
        <div className="mx-auto max-w-7xl">
            {/* Selector de UI Mode */}
            <div className="mb-6 flex justify-end gap-3">
                <button
                    onClick={() => setUiMode("tailwind")}
                    className={`rounded-md py-2 px-4 font-medium transition-colors ${
                        uiMode === "tailwind"
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-black hover:bg-gray-300 dark:bg-meta-4 dark:text-white"
                    }`}
                >
                    Tailwind CSS
                </button>
                <button
                    onClick={() => setUiMode("material")}
                    className={`rounded-md py-2 px-4 font-medium transition-colors ${
                        uiMode === "material"
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-black hover:bg-gray-300 dark:bg-meta-4 dark:text-white"
                    }`}
                >
                    Material UI
                </button>
            </div>

            {/* Render según modo seleccionado */}
            {uiMode === "tailwind" ? renderTailwind() : renderMaterialUI()}
        </div>
    );
};

export default UserProfilePage;