import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { permissionService } from "../../../services/permissionService";
import { Permission } from "../../../models/Permission";
import Swal from "sweetalert2";
import Breadcrumb from "../../../components/Breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Chip,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Link as LinkIcon,
} from "@mui/icons-material";

type UIMode = "tailwind" | "material";

const ListPermissionsAdvanced = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [uiMode, setUiMode] = useState<UIMode>("tailwind");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await permissionService.getPermissions();
      console.debug("Permission.list fetchData -> received", data);
      setPermissions(data);
    } catch (error) {
      console.error("Error fetching permissions:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar los permisos",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (permission: Permission) => {
    const result = await Swal.fire({
      title: "¿Eliminar permiso?",
      text: `¿Está seguro de eliminar el permiso ${permission.method} ${permission.url}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const success = await permissionService.deletePermission(permission.id);
      if (success) {
        Swal.fire({
          title: "Eliminado",
          text: "El permiso se ha eliminado correctamente",
          icon: "success",
          timer: 2000,
        });
        fetchData();
      } else {
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el permiso",
          icon: "error",
        });
      }
    }
  };

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: "bg-blue-500",
      POST: "bg-green-500",
      PUT: "bg-yellow-500",
      DELETE: "bg-red-500",
      PATCH: "bg-purple-500",
    };
    return colors[method] || "bg-gray-500";
  };

  const getMethodColorMUI = (method: string): "primary" | "success" | "warning" | "error" | "secondary" => {
    const colors: Record<string, "primary" | "success" | "warning" | "error" | "secondary"> = {
      GET: "primary",
      POST: "success",
      PUT: "warning",
      DELETE: "error",
      PATCH: "secondary",
    };
    return colors[method] || "primary";
  };

  // ============ RENDER TAILWIND ============
  const renderTailwind = () => (
    <>
      <Breadcrumb pageName="Permisos - Advanced" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 py-6 md:px-6 xl:px-7.5 flex justify-between items-center">
          <div>
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Permissions - Advanced Version
            </h4>
            <p className="text-sm text-gray-500 mt-1">Enhanced permissions management with dual UI</p>
          </div>
          <button
            onClick={() => navigate("/permissions/create")}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            <AddIcon />
            Crear Permiso
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-10">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          </div>
        ) : permissions.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No hay permisos registrados
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    ID
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    URL
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Método
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Entidad
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((permission) => (
                  <tr key={permission.id} className="border-b border-stroke dark:border-strokedark">
                    <td className="py-5 px-4">
                      <span className="text-black dark:text-white">
                        {permission.id}
                      </span>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="text-gray-500" fontSize="small" />
                        <span className="text-black dark:text-white font-mono text-sm">
                          {permission.url}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <span
                        className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${getMethodColor(
                          permission.method
                        )} text-white`}
                      >
                        {permission.method}
                      </span>
                    </td>
                    <td className="py-5 px-4">
                      <span className="text-black dark:text-white">
                        {permission.entity}
                      </span>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/permissions/update/${permission.id}`)}
                          className="hover:text-primary"
                          title="Editar"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDelete(permission)}
                          className="hover:text-danger"
                          title="Eliminar"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );

  // ============ RENDER MATERIAL UI ============
  const renderMaterialUI = () => (
    <>
      <Breadcrumb pageName="Permisos - Advanced" />
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Permissions - Advanced
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enhanced permissions management with dual UI
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/permissions/create")}
            size="large"
          >
            Crear Permiso
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
            <CircularProgress size={60} />
          </Box>
        ) : permissions.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Typography variant="h6" color="text.secondary">
              No hay permisos registrados
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "grey.100" }}>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>URL</strong></TableCell>
                  <TableCell><strong>Método</strong></TableCell>
                  <TableCell><strong>Entidad</strong></TableCell>
                  <TableCell align="center"><strong>Acciones</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {permissions.map((permission) => (
                  <TableRow key={permission.id} hover>
                    <TableCell>
                      <Chip label={permission.id} size="small" color="default" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <LinkIcon fontSize="small" color="action" />
                        <Typography variant="body2" fontFamily="monospace">
                          {permission.url}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={permission.method}
                        color={getMethodColorMUI(permission.method)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {permission.entity}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/permissions/update/${permission.id}`)}
                        title="Editar"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(permission)}
                        title="Eliminar"
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
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

export default ListPermissionsAdvanced;