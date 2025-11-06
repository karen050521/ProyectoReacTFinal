import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { permissionService } from "../../services/permissionService";
import { rolePermissionService } from "../../services/rolePermissionService";
import { roleService } from "../../services/roleService";
import { usePermissions } from "../../hooks/usePermissions";
import { usePermissionUpdate } from "../../context/PermissionUpdateContext";
import { Permission } from "../../models/Permission";
import { Role } from "../../models/Role";
import Swal from "sweetalert2";
import Breadcrumb from "../../components/Breadcrumb";
import { AdminGuard } from "../../components/guards/PermissionGuard";
import {
  Paper,
  Box,
  Typography,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

type UIMode = "tailwind" | "material";

const ManageRolePermissions = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const [uiMode, setUiMode] = useState<UIMode>("tailwind");
  const [role, setRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [assignedPermissions, setAssignedPermissions] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Hook para manejar permisos dinámicos
  const { isAdminSafe, enableDynamicMode, refreshPermissions } = usePermissions();
  const { triggerPermissionUpdate } = usePermissionUpdate();

  // 🔍 DEBUG: Verificar estado de permisos actual
  const debugPermissionState = async () => {
    if (!roleId) return;
    
    console.log("🔍 === PERMISSION DEBUG ===");
    try {
      const currentPermsFromService = await permissionService.getPermissionsByRole(Number.parseInt(roleId));
      console.log("📊 Current permissions from getPermissionsByRole API:", currentPermsFromService);
      
      const rolePermsFromService = await rolePermissionService.getPermissionsByRoleId(Number.parseInt(roleId));
      console.log("📊 Current role-permissions from getPermissionsByRoleId API:", rolePermsFromService);
      
      console.log("📊 Current assigned permissions in UI:", Array.from(assignedPermissions));
    } catch (error) {
      console.error("❌ Error in debug:", error);
    }
    console.log("🔍 === END DEBUG ===");
  };

  useEffect(() => {
    fetchData();
  }, [roleId]);

  const fetchData = async () => {
    if (!roleId) return;

    try {
      setLoading(true);

      // Obtener información del rol
      const roleData = await roleService.getRoleById(Number.parseInt(roleId));
      if (!roleData) {
        Swal.fire({
          title: "Error",
          text: "No se encontró el rol",
          icon: "error",
        });
        navigate("/roles");
        return;
      }
      setRole(roleData);

      // Obtener todos los permisos disponibles
      const allPermissions = await permissionService.getPermissions();
      console.log("📋 Total permisos disponibles:", allPermissions.length);
      console.log("📋 Permisos:", allPermissions);
      setPermissions(allPermissions);

      // Obtener permisos asignados al rol
      const rolePermissions = await rolePermissionService.getPermissionsByRoleId(Number.parseInt(roleId));
      console.log("✅ Permisos asignados al rol:", rolePermissions);
      const assignedIds = new Set(rolePermissions.map((rp) => rp.permission_id));
      console.log("✅ IDs de permisos asignados:", Array.from(assignedIds));
      setAssignedPermissions(assignedIds);
    } catch (error) {
      console.error("Error loading data:", error);
      Swal.fire({
        title: "Error",
        text: "Error al cargar los datos",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePermission = async (permissionId: number) => {
    if (!roleId) return;

    const isAssigned = assignedPermissions.has(permissionId);
    console.log(`🔄 Toggle permission ${permissionId} for role ${roleId} - Currently assigned: ${isAssigned}`);

    try {
      setSaving(true);

      if (isAssigned) {
        // Eliminar permiso
        console.log(`🗑️ DELETE /api/role-permissions/role/${roleId}/permission/${permissionId}`);
        const success = await rolePermissionService.removePermissionFromRole(
          Number.parseInt(roleId),
          permissionId
        );
        if (success) {
          setAssignedPermissions((prev) => {
            const newSet = new Set(prev);
            newSet.delete(permissionId);
            return newSet;
          });
          
          // 🔄 Solo activar modo dinámico si el admin lo confirma o si ya está en modo dinámico
          if (isAdminSafe()) {
            console.log("🛡️ Admin detected - safe to enable dynamic mode");
            await enableDynamicMode();
            triggerPermissionUpdate();
          }
          
          Swal.fire({
            title: "¡Éxito!",
            text: "Permiso eliminado del rol. Los guards se actualizarán automáticamente.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          throw new Error("No se pudo eliminar el permiso");
        }
      } else {
        // Asignar permiso
        console.log(`➕ POST /api/role-permissions/role/${roleId}/permission/${permissionId}`);
        const result = await rolePermissionService.assignPermissionToRole(
          Number.parseInt(roleId),
          permissionId
        );
        if (result) {
          setAssignedPermissions((prev) => new Set(prev).add(permissionId));
          
          // 🔄 Solo activar modo dinámico si el admin lo confirma o si ya está en modo dinámico
          if (isAdminSafe()) {
            console.log("🛡️ Admin detected - safe to enable dynamic mode");
            await enableDynamicMode();
            triggerPermissionUpdate();
          }
          
          Swal.fire({
            title: "¡Éxito!",
            text: "Permiso asignado al rol. Los guards se actualizarán automáticamente.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          throw new Error("No se pudo asignar el permiso");
        }
      }
    } catch (error) {
      console.error("❌ Error toggling permission:", error);
      Swal.fire({
        title: "Error",
        text: `No se pudo ${isAssigned ? "eliminar" : "asignar"} el permiso`,
        icon: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate("/roles");
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
      <Breadcrumb pageName={`Permisos - ${role?.name || "Rol"}`} />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {/* Header */}
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-black dark:text-white text-xl">
                Administrador - Permissions
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Rol: <span className="font-semibold">{role?.name}</span>
              </p>
              {role?.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {role.description}
                </p>
              )}
            </div>
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-md border border-stroke py-2 px-4 text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            >
              <ArrowBackIcon fontSize="small" />
              Volver
            </button>
            <button
              onClick={debugPermissionState}
              className="inline-flex items-center gap-2 rounded-md border border-red-500 py-2 px-4 text-red-600 hover:bg-red-50"
            >
              🔍 Debug
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="p-6.5">
          {permissions.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No hay permisos disponibles
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Model
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                      List
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                      Edit
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                      Create
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                      Update
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Agrupar permisos por entidad */}
                  {Array.from(new Set(permissions.map((p) => p.entity))).map((entity) => {
                    const entityPermissions = permissions.filter((p) => p.entity === entity);
                    // Buscar permisos por método y patrón de URL
                    const listPerm = entityPermissions.find((p) => 
                      p.method === "GET" && !p.url.includes("?") && !p.url.includes(":id")
                    );
                    const editPerm = entityPermissions.find((p) => 
                      p.method === "GET" && (p.url.includes("?") || p.url.includes(":id"))
                    );
                    const createPerm = entityPermissions.find((p) => p.method === "POST");
                    const updatePerm = entityPermissions.find((p) => p.method === "PUT");
                    const deletePerm = entityPermissions.find((p) => p.method === "DELETE");

                    return (
                      <tr
                        key={entity}
                        className="border-b border-stroke dark:border-strokedark"
                      >
                        <td className="py-5 px-4">
                          <span className="text-black dark:text-white font-medium">
                            {entity}
                          </span>
                        </td>
                        <td className="py-5 px-4 text-center">
                          {listPerm && (
                            <input
                              type="checkbox"
                              checked={assignedPermissions.has(listPerm.id)}
                              onChange={() => handleTogglePermission(listPerm.id)}
                              disabled={saving}
                              className="w-5 h-5 cursor-pointer"
                            />
                          )}
                        </td>
                        <td className="py-5 px-4 text-center">
                          {editPerm && (
                            <input
                              type="checkbox"
                              checked={assignedPermissions.has(editPerm.id)}
                              onChange={() => handleTogglePermission(editPerm.id)}
                              disabled={saving}
                              className="w-5 h-5 cursor-pointer"
                            />
                          )}
                        </td>
                        <td className="py-5 px-4 text-center">
                          {createPerm && (
                            <input
                              type="checkbox"
                              checked={assignedPermissions.has(createPerm.id)}
                              onChange={() => handleTogglePermission(createPerm.id)}
                              disabled={saving}
                              className="w-5 h-5 cursor-pointer"
                            />
                          )}
                        </td>
                        <td className="py-5 px-4 text-center">
                          {updatePerm && (
                            <input
                              type="checkbox"
                              checked={assignedPermissions.has(updatePerm.id)}
                              onChange={() => handleTogglePermission(updatePerm.id)}
                              disabled={saving}
                              className="w-5 h-5 cursor-pointer"
                            />
                          )}
                        </td>
                        <td className="py-5 px-4 text-center">
                          {deletePerm && (
                            <input
                              type="checkbox"
                              checked={assignedPermissions.has(deletePerm.id)}
                              onChange={() => handleTogglePermission(deletePerm.id)}
                              disabled={saving}
                              className="w-5 h-5 cursor-pointer"
                            />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );

  // ============ RENDER MATERIAL UI ============
  const renderMaterialUI = () => (
    <>
      <Breadcrumb pageName={`Permisos - ${role?.name || "Rol"}`} />
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Administrador - Permissions
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Rol: <strong>{role?.name}</strong>
            </Typography>
            {role?.description && (
              <Typography variant="body2" color="text.secondary">
                {role.description}
              </Typography>
            )}
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            size="large"
          >
            Volver
          </Button>
        </Box>

        {/* Table */}
        {permissions.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Typography variant="h6" color="text.secondary">
              No hay permisos disponibles
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "grey.100" }}>
                  <TableCell><strong>Model</strong></TableCell>
                  <TableCell align="center"><strong>List</strong></TableCell>
                  <TableCell align="center"><strong>Edit</strong></TableCell>
                  <TableCell align="center"><strong>Create</strong></TableCell>
                  <TableCell align="center"><strong>Update</strong></TableCell>
                  <TableCell align="center"><strong>Delete</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from(new Set(permissions.map((p) => p.entity))).map((entity) => {
                  const entityPermissions = permissions.filter((p) => p.entity === entity);
                  // Buscar permisos por método y patrón de URL
                  const listPerm = entityPermissions.find((p) => 
                    p.method === "GET" && !p.url.includes("?") && !p.url.includes(":id")
                  );
                  const editPerm = entityPermissions.find((p) => 
                    p.method === "GET" && (p.url.includes("?") || p.url.includes(":id"))
                  );
                  const createPerm = entityPermissions.find((p) => p.method === "POST");
                  const updatePerm = entityPermissions.find((p) => p.method === "PUT");
                  const deletePerm = entityPermissions.find((p) => p.method === "DELETE");

                  return (
                    <TableRow key={entity} hover>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          {entity}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {listPerm && (
                          <Checkbox
                            checked={assignedPermissions.has(listPerm.id)}
                            onChange={() => handleTogglePermission(listPerm.id)}
                            disabled={saving}
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {editPerm && (
                          <Checkbox
                            checked={assignedPermissions.has(editPerm.id)}
                            onChange={() => handleTogglePermission(editPerm.id)}
                            disabled={saving}
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {createPerm && (
                          <Checkbox
                            checked={assignedPermissions.has(createPerm.id)}
                            onChange={() => handleTogglePermission(createPerm.id)}
                            disabled={saving}
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {updatePerm && (
                          <Checkbox
                            checked={assignedPermissions.has(updatePerm.id)}
                            onChange={() => handleTogglePermission(updatePerm.id)}
                            disabled={saving}
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {deletePerm && (
                          <Checkbox
                            checked={assignedPermissions.has(deletePerm.id)}
                            onChange={() => handleTogglePermission(deletePerm.id)}
                            disabled={saving}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </>
  );

  return (
    <AdminGuard fallback={
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <Breadcrumb pageName="Gestión de Permisos por Rol" />
        </div>
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
              Acceso Denegado
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              No tienes permisos para gestionar roles y permisos del sistema.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Esta función está disponible solo para Administradores.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 inline-flex items-center justify-center rounded-md bg-gray-600 py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
            >
              ← Volver
            </button>
          </div>
        </div>
      </div>
    }>
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
    </AdminGuard>
  );
};

export default ManageRolePermissions;