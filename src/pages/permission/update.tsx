import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPermissionById, updatePermission } from "../../services/permissionService";
import { Permission } from "../../models/Permission";
import Swal from "sweetalert2";
import Breadcrumb from "../../components/Breadcrumb";
import {
  TextField,
  Button,
  MenuItem,
  Paper,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material";

type UIMode = "tailwind" | "material";

const UpdatePermissionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [uiMode, setUiMode] = useState<UIMode>("tailwind");
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [entity, setEntity] = useState("");
  const [errors, setErrors] = useState<{ url?: string; method?: string; entity?: string }>({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

  useEffect(() => {
    const fetchPermission = async () => {
      if (!id) return;
      try {
        setLoadingData(true);
        const permissionData = await getPermissionById(Number.parseInt(id));
        if (permissionData) {
          setUrl(permissionData.url);
          setMethod(permissionData.method);
          setEntity(permissionData.entity);
        } else {
          Swal.fire({
            title: "Error",
            text: "No se encontró el permiso",
            icon: "error",
          });
          navigate("/permissions");
        }
      } catch (error) {
        console.error("Error fetching permission:", error);
        Swal.fire({
          title: "Error",
          text: "Error al cargar el permiso",
          icon: "error",
        });
        navigate("/permissions");
      } finally {
        setLoadingData(false);
      }
    };

    fetchPermission();
  }, [id, navigate]);

  const validate = () => {
    const newErrors: { url?: string; method?: string; entity?: string } = {};

    if (!url.trim()) {
      newErrors.url = "La URL es obligatoria";
    } else if (url.length < 1) {
      newErrors.url = "La URL debe tener al menos 1 carácter";
    } else if (url.length > 255) {
      newErrors.url = "La URL no puede exceder 255 caracteres";
    }

    if (!method) {
      newErrors.method = "El método es obligatorio";
    }

    if (!entity.trim()) {
      newErrors.entity = "La entidad es obligatoria";
    } else if (entity.length < 1) {
      newErrors.entity = "La entidad debe tener al menos 1 carácter";
    } else if (entity.length > 100) {
      newErrors.entity = "La entidad no puede exceder 100 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !id) return;

    try {
      setLoading(true);
      const permission: Partial<Permission> = { url, method, entity };
      const updated = await updatePermission(Number.parseInt(id), permission);

      if (updated) {
        Swal.fire({
          title: "¡Éxito!",
          text: "Permiso actualizado correctamente",
          icon: "success",
          timer: 2000,
        });
        navigate("/permissions");
      } else {
        Swal.fire({
          title: "Error",
          text: "No se pudo actualizar el permiso",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error updating permission:", error);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al actualizar el permiso",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/permissions");
  };

  if (loadingData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  // ============ RENDER TAILWIND ============
  const renderTailwind = () => (
    <>
      <Breadcrumb pageName="Actualizar Permiso" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white text-xl">
            Permission Update
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6.5">
          {/* URL Field */}
          <div className="mb-6">
            <label className="mb-2.5 block text-black dark:text-white font-medium">
              URL <span className="text-meta-1">*</span>
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Ingrese la URL del endpoint"
              className={`w-full rounded border-[1.5px] ${
                errors.url ? "border-red-500" : "border-stroke"
              } bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
            />
            {errors.url && (
              <p className="mt-1 text-sm text-red-500">{errors.url}</p>
            )}
          </div>

          {/* Method Field */}
          <div className="mb-6">
            <label className="mb-2.5 block text-black dark:text-white font-medium">
              Método HTTP <span className="text-meta-1">*</span>
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className={`w-full rounded border-[1.5px] ${
                errors.method ? "border-red-500" : "border-stroke"
              } bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
            >
              {methods.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            {errors.method && (
              <p className="mt-1 text-sm text-red-500">{errors.method}</p>
            )}
          </div>

          {/* Entity Field */}
          <div className="mb-6">
            <label className="mb-2.5 block text-black dark:text-white font-medium">
              Entidad <span className="text-meta-1">*</span>
            </label>
            <input
              type="text"
              value={entity}
              onChange={(e) => setEntity(e.target.value)}
              placeholder="Ingrese la entidad (ej: users, roles, permissions)"
              className={`w-full rounded border-[1.5px] ${
                errors.entity ? "border-red-500" : "border-stroke"
              } bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
            />
            {errors.entity && (
              <p className="mt-1 text-sm text-red-500">{errors.entity}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
            >
              {loading ? "Actualizando..." : "Actualizar Permiso"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex w-full justify-center rounded border border-stroke p-3 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </>
  );

  // ============ RENDER MATERIAL UI ============
  const renderMaterialUI = () => (
    <>
      <Breadcrumb pageName="Actualizar Permiso" />
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h4" component="h1" fontWeight="bold" mb={3}>
          Permission Update
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {/* URL Field */}
          <TextField
            fullWidth
            label="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Ingrese la URL del endpoint"
            error={!!errors.url}
            helperText={errors.url}
            required
            sx={{ mb: 3 }}
          />

          {/* Method Field */}
          <TextField
            fullWidth
            select
            label="Método HTTP"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            error={!!errors.method}
            helperText={errors.method}
            required
            sx={{ mb: 3 }}
          >
            {methods.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </TextField>

          {/* Entity Field */}
          <TextField
            fullWidth
            label="Entidad"
            value={entity}
            onChange={(e) => setEntity(e.target.value)}
            placeholder="Ingrese la entidad (ej: users, roles, permissions)"
            error={!!errors.entity}
            helperText={errors.entity}
            required
            sx={{ mb: 3 }}
          />

          {/* Buttons */}
          <Box display="flex" gap={2}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            >
              {loading ? "Actualizando..." : "Actualizar Permiso"}
            </Button>
            <Button
              type="button"
              variant="outlined"
              fullWidth
              size="large"
              onClick={handleCancel}
              startIcon={<CancelIcon />}
            >
              Cancelar
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
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            uiMode === "tailwind"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Tailwind CSS
        </button>
        <button
          onClick={() => setUiMode("material")}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            uiMode === "material"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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

export default UpdatePermissionPage;
