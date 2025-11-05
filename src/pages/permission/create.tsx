import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPermission } from "../../services/permissionService";
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
} from "@mui/material";
import { Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material";

type UIMode = "tailwind" | "material";

const CreatePermissionPage = () => {
  const navigate = useNavigate();
  const [uiMode, setUiMode] = useState<UIMode>("tailwind");
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [entity, setEntity] = useState("");
  const [errors, setErrors] = useState<{ url?: string; method?: string; entity?: string }>({});
  const [loading, setLoading] = useState(false);

  const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

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

    if (!validate()) return;

    try {
      setLoading(true);
      const permission: Omit<Permission, "id"> = { url, method, entity};
      
      console.log("📤 Enviando permiso:", permission);
      const created = await createPermission(permission);
      console.log("📥 Respuesta:", created);

      if (created) {
        Swal.fire({
          title: "¡Éxito!",
          text: "Permiso creado correctamente",
          icon: "success",
          timer: 2000,
        });
        navigate("/permissions");
      } else {
        Swal.fire({
          title: "Error",
          text: "No se pudo crear el permiso. Revisa la consola para más detalles.",
          icon: "error",
        });
      }
    } catch (error: any) {
      console.error("❌ Error creating permission:", error);
      const errorMessage = error.response?.data?.message || error.message || "Error desconocido";
      Swal.fire({
        title: "Error",
        text: `No se pudo crear el permiso: ${errorMessage}`,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/permissions");
  };

  // ============ RENDER TAILWIND ============
  const renderTailwind = () => (
    <>
      <Breadcrumb pageName="Crear Permiso" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white text-xl">
            Permission Create
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
              {loading ? "Creando..." : "Crear Permiso"}
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
      <Breadcrumb pageName="Crear Permiso" />
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h4" component="h1" fontWeight="bold" mb={3}>
          Permission Create
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
              startIcon={<SaveIcon />}
            >
              {loading ? "Creando..." : "Crear Permiso"}
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

export default CreatePermissionPage;
