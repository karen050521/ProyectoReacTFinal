import { useState, useEffect } from "react";
import { permissionService } from "../services/permissionService";
import type { Permission } from "../models/Permission";

interface UsePermissionControllerReturn {
  permissions: Permission[];
  loading: boolean;
  error: string | null;
  
  // CRUD Operations
  fetchPermissions: () => Promise<void>;
  getPermissionById: (id: number) => Promise<Permission | null>;
  createPermission: (permission: Omit<Permission, "id">) => Promise<Permission | null>;
  updatePermission: (id: number, permission: Partial<Permission>) => Promise<Permission | null>;
  deletePermission: (id: number) => Promise<boolean>;
  
  // Specialized Operations
  getPermissionsByRole: (roleId: number) => Promise<Permission[]>;
  
  // Utility
  clearError: () => void;
}

export const usePermissionController = (): UsePermissionControllerReturn => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all permissions
  const fetchPermissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await permissionService.getPermissions();
      setPermissions(data);
    } catch (err) {
      setError("Error al cargar los permisos");
      console.error("Error in fetchPermissions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get permission by ID
  const getPermissionById = async (id: number): Promise<Permission | null> => {
    setLoading(true);
    setError(null);
    try {
      const permission = await permissionService.getPermissionById(id);
      return permission;
    } catch (err) {
      setError("Error al obtener el permiso");
      console.error("Error in getPermissionById:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create new permission
  const createPermission = async (permission: Omit<Permission, "id">): Promise<Permission | null> => {
    setLoading(true);
    setError(null);
    try {
      const newPermission = await permissionService.createPermission(permission);
      if (newPermission) {
        // Refresh the permissions list
        await fetchPermissions();
        return newPermission;
      }
      return null;
    } catch (err) {
      setError("Error al crear el permiso");
      console.error("Error in createPermission:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update existing permission
  const updatePermission = async (id: number, permission: Partial<Permission>): Promise<Permission | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedPermission = await permissionService.updatePermission(id, permission);
      if (updatedPermission) {
        // Refresh the permissions list
        await fetchPermissions();
        return updatedPermission;
      }
      return null;
    } catch (err) {
      setError("Error al actualizar el permiso");
      console.error("Error in updatePermission:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete permission
  const deletePermission = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const success = await permissionService.deletePermission(id);
      if (success) {
        // Refresh the permissions list
        await fetchPermissions();
        return true;
      }
      return false;
    } catch (err) {
      setError("Error al eliminar el permiso");
      console.error("Error in deletePermission:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get permissions by role
  const getPermissionsByRole = async (roleId: number): Promise<Permission[]> => {
    try {
      const permissions = await permissionService.getPermissionsByRole(roleId);
      return permissions;
    } catch (err) {
      setError("Error al obtener permisos del rol");
      console.error("Error in getPermissionsByRole:", err);
      return [];
    }
  };

  // Clear error state
  const clearError = () => {
    setError(null);
  };

  // Load permissions on component mount
  useEffect(() => {
    fetchPermissions();
  }, []);

  return {
    permissions,
    loading,
    error,
    fetchPermissions,
    getPermissionById,
    createPermission,
    updatePermission,
    deletePermission,
    getPermissionsByRole,
    clearError,
  };
};