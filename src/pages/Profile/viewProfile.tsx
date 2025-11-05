import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProfileByUserId } from "../../services/profileService";
import { getUserById } from "../../services/userService";
import { Profile } from "../../models/Profile";
import { User } from "../../models/user";
import Breadcrumb from "../../components/Breadcrumb";
import {
  Button,
  Box,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from "@mui/icons-material";

type UIMode = "tailwind" | "material";

const ViewProfilePage = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [uiMode, setUiMode] = useState<UIMode>("tailwind");
    const [profile, setProfile] = useState<Profile | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [photoPreview, setPhotoPreview] = useState<string>("");

    // Helper para construir URL completa de imagen
    const getImageUrl = (photoPath: string | null | undefined): string => {
        if (!photoPath) return "";
        if (photoPath.startsWith("http://") || photoPath.startsWith("https://")) {
            return photoPath;
        }
        const API_BASE = (import.meta as any).env.VITE_API_URL || "http://127.0.0.1:5000";
        const baseUrl = API_BASE.replace(/\/$/, '');
        const path = photoPath.startsWith('/') ? photoPath : `/${photoPath}`;
        return `${baseUrl}${path}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;

            setLoading(true);
            try {
                const numericUserId = Number.parseInt(userId);
                
                // Obtener usuario
                const userData = await getUserById(numericUserId);
                setUser(userData);

                // Obtener perfil
                const profileData = await getProfileByUserId(numericUserId);
                if (profileData) {
                    setProfile(profileData);
                    if (profileData.photo) {
                        const imageUrl = getImageUrl(profileData.photo);
                        console.log("Image URL:", imageUrl);
                        setPhotoPreview(imageUrl);
                    }
                }
            } catch (error) {
                console.error("Error loading profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    const handleEdit = () => {
        navigate(`/profile/edit/${userId}`);
    };

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
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
                        <div className="flex flex-col items-center">
                            <div 
                                className="w-[200px] h-[200px] border-2 border-stroke rounded-lg overflow-hidden mb-4 bg-gray-100 flex items-center justify-center"
                            >
                                <img
                                    src={photoPreview || "/images/user/user-default.png"}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        console.log("Error loading image, using fallback");
                                        (e.target as HTMLImageElement).src = "/images/user/user-default.png";
                                    }}
                                />
                            </div>
                        </div>

                        {/* Columna derecha: Información del perfil */}
                        <div className="lg:col-span-2">
                            <div className="mb-6">
                                <p className="mb-2.5 text-sm font-medium text-black dark:text-white">
                                    Name: <span className="font-bold">{user?.name || "N/A"}</span>
                                </p>
                            </div>

                            <div className="mb-6">
                                <p className="mb-2.5 text-sm font-medium text-black dark:text-white">
                                    Email: <span className="font-normal">{user?.email || "N/A"}</span>
                                </p>
                            </div>

                            <div className="mb-6">
                                <p className="mb-2.5 text-sm font-medium text-black dark:text-white">
                                    Phone:
                                </p>
                                <div className="w-full rounded-lg border-[1.5px] border-stroke bg-gray-100 px-5 py-3 text-black dark:bg-meta-4 dark:text-white">
                                    {profile?.phone || "No phone number"}
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={handleEdit}
                                    className="flex justify-center rounded bg-primary py-3 px-6 font-medium text-gray hover:bg-opacity-90"
                                >
                                    <EditIcon className="mr-2" fontSize="small" />
                                    Actualizar
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

                        <Box mb={3}>
                            <Typography variant="body1" gutterBottom>
                                <strong>Phone:</strong> {profile?.phone || "No phone number"}
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={handleEdit}
                            size="large"
                        >
                            Actualizar
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
                    className={`rounded px-4 py-2 font-medium transition-colors ${
                        uiMode === "tailwind"
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-black hover:bg-gray-300 dark:bg-meta-4 dark:text-white"
                    }`}
                >
                    Tailwind
                </button>
                <button
                    onClick={() => setUiMode("material")}
                    className={`rounded px-4 py-2 font-medium transition-colors ${
                        uiMode === "material"
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-black hover:bg-gray-300 dark:bg-meta-4 dark:text-white"
                    }`}
                >
                    Material UI
                </button>
            </div>

            {/* Renderizado condicional */}
            {uiMode === "tailwind" ? renderTailwind() : renderMaterialUI()}
        </div>
    );
};

export default ViewProfilePage;
