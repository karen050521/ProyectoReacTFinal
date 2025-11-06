import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { userRoleService } from "../services/userRoleService";
import { rolePermissionService } from "../services/rolePermissionService";
import { permissionService } from "../services/permissionService";
import type { Permission } from "../models/Permission";
import type { UserRole } from "../models/UserRole";
import type { RolePermission } from "../models/RolePermission";

interface UsePermissionsReturn {
  permissions: Permission[];
  loading: boolean;
  error: string | null;
  hasPermission: (url: string, method: string) => boolean;
  hasAnyPermission: (permissionChecks: Array<{url: string; method: string}>) => boolean;
  refreshPermissions: () => Promise<void>;
}

export const usePermissions = (): UsePermissionsReturn => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener usuario del store (tradicional o Microsoft)
  const user = useSelector((state: RootState) => state.user.user);
  const microsoftUser = useSelector((state: RootState) => state.microsoftAuth.user);
  const currentUser = user || microsoftUser;

  // Función para cargar permisos del usuario
  const loadUserPermissions = async () => {
    if (!currentUser?.id) {
      console.warn("usePermissions: No user ID available");
      setPermissions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convertir ID a number si es string
      const userId = typeof currentUser.id === 'string' ? parseInt(currentUser.id) : currentUser.id;
      console.log("🔐 Loading permissions for user:", userId);

      // 1. Obtener roles del usuario
      const userRoles: UserRole[] = await userRoleService.getRolesByUser(userId);
      console.log("👤 User roles:", userRoles);

      if (userRoles.length === 0) {
        console.warn("⚠️ User has no roles assigned");
        setPermissions([]);
        return;
      }

      // 2. Para cada rol, obtener sus permisos y cargar los detalles completos
      const permissionIds = new Set<number>(); // Para evitar duplicados
      const rolePermissionPromises: Promise<RolePermission[]>[] = [];

      // Recopilar todos los permisos de todos los roles
      for (const userRole of userRoles) {
        console.log(`🎭 Loading permissions for role: ${userRole.role_id}`);
        rolePermissionPromises.push(rolePermissionService.getPermissionsByRoleId(userRole.role_id));
      }

      // Ejecutar todas las consultas en paralelo
      const allRolePermissions = await Promise.all(rolePermissionPromises);
      
      // Extraer IDs únicos de permisos
      allRolePermissions.flat().forEach(rolePermission => {
        permissionIds.add(rolePermission.permission_id);
      });

      console.log("📊 Total unique permission IDs:", permissionIds.size, Array.from(permissionIds));
      
      // 3. Cargar los objetos Permission completos por ID
      const permissionDetailPromises = Array.from(permissionIds).map(id => 
        permissionService.getPermissionById(id)
      );

      const permissionResults = await Promise.all(permissionDetailPromises);
      
      // Filtrar permisos válidos (no null)
      const validPermissions = permissionResults.filter((p): p is Permission => p !== null);
      
      console.log("✅ Loaded permissions:", validPermissions);
      setPermissions(validPermissions);

    } catch (err) {
      console.error("❌ Error loading user permissions:", err);
      setError("Error al cargar permisos del usuario");
    } finally {
      setLoading(false);
    }
  };

  // Función para verificar si el usuario tiene un permiso específico
  const hasPermission = (url: string, method: string): boolean => {
    if (!currentUser) {
      console.log("🚫 hasPermission: No user logged in");
      return false;
    }

    const permission = permissions.find(p => 
      p.url === url && p.method.toUpperCase() === method.toUpperCase()
    );

    const hasAccess = !!permission;
    console.log(`🔍 hasPermission(${url}, ${method}): ${hasAccess}`);
    
    return hasAccess;
  };

  // Función para verificar si el usuario tiene al menos uno de los permisos
  const hasAnyPermission = (permissionChecks: Array<{url: string; method: string}>): boolean => {
    if (!currentUser) {
      return false;
    }

    return permissionChecks.some(check => hasPermission(check.url, check.method));
  };

  // Función para refrescar permisos manualmente
  const refreshPermissions = async (): Promise<void> => {
    await loadUserPermissions();
  };

  // Cargar permisos cuando cambia el usuario
  useEffect(() => {
    if (currentUser) {
      loadUserPermissions();
    } else {
      setPermissions([]);
      setError(null);
    }
  }, [currentUser?.id]);

  return {
    permissions,
    loading,
    error,
    hasPermission,
    hasAnyPermission,
    refreshPermissions,
  };
};