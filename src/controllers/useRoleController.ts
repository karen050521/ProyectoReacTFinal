import { useState, useEffect } from "react";
import { roleService } from "../services/roleService";
import { Role } from "../models/Role";

export const useRoleController = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const rolesData = await roleService.getRoles();
      console.log("Roles cargados:", rolesData);
      setRoles(rolesData);
    } catch (err) {
      setError("Error al cargar los roles");
      console.error(err);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const createRole = async (role: Omit<Role, "id">) => {
    try {
      const newRole = await roleService.createRole(role);
      if (newRole) {
        await fetchRoles(); // Recargar roles
        return newRole;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear rol");
      throw err;
    }
  };

  const updateRole = async (id: number, role: Partial<Role>) => {
    try {
      if (!id) {
        throw new Error("No se pudo identificar el rol a actualizar");
      }
      
      const updated = await roleService.updateRole(id, role);
      if (updated) {
        await fetchRoles(); // Recargar roles
        return updated;
      }
    } catch (err) {
      setError("Error al actualizar rol");
      throw err;
    }
  };

  const deleteRole = async (id: number) => {
    try {
      const success = await roleService.deleteRole(id);
      if (success) {
        await fetchRoles(); // Recargar roles
      }
      return success;
    } catch (err) {
      setError("Error al eliminar rol");
      throw err;
    }
  };

  const getRoleById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const role = await roleService.getRoleById(id);
      return role;
    } catch (err) {
      setError("Error al obtener rol");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return {
    roles,
    loading,
    error,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    getRoleById,
    clearError: () => setError(null),
  };
};