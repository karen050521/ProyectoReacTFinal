import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { userRoleService } from "../services/userRoleService";
import { ADMIN_PERMISSIONS, USER_PERMISSIONS } from "../utils/permissionHelpers";
import type { Permission } from "../models/Permission";
import type { UserRole } from "../models/UserRole";

interface UsePermissionsReturn {
  permissions: Permission[];
  loading: boolean;
  error: string | null;
  hasPermission: (url: string, method: string) => boolean;
  hasAnyPermission: (permissionChecks: Array<{url: string; method: string}>) => boolean;
  refreshPermissions: () => Promise<void>;
  userRole: 'Administrator' | 'User' | null;
  isAdministrator: boolean;
  isUser: boolean;
}

export const usePermissions = (): UsePermissionsReturn => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'Administrator' | 'User' | null>(null);

  // Obtener usuario del store (tradicional o Microsoft)
  const user = useSelector((state: RootState) => state.user.user);
  const microsoftUser = useSelector((state: RootState) => state.microsoftAuth.user);
  const currentUser = user || microsoftUser;

  // Función para convertir role_id a permisos predefinidos
  const getPermissionsByRoleId = (roleId: number | null): Permission[] => {
    console.log(`🎭 Converting role_id ${roleId} to permissions`);
    
    if (roleId === 1) {
      // Administrator - Todos los permisos administrativos
      console.log("👑 Role detected: Administrator");
      setUserRole('Administrator');
      
      // Convertir el objeto ADMIN_PERMISSIONS a array de Permission
      const adminPermissionArray = Object.values(ADMIN_PERMISSIONS);
      return adminPermissionArray.map((permCheck, index) => ({
        id: index + 1,
        url: permCheck.url,
        method: permCheck.method,
        entity: permCheck.url.replace('/', '').charAt(0).toUpperCase() + permCheck.url.replace('/', '').slice(1),
        name: `${permCheck.url}.${permCheck.method.toLowerCase()}`,
        description: `Permission for ${permCheck.method} ${permCheck.url}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
    } else if (roleId === 2 || roleId === null || roleId === undefined) {
      // User o sin rol asignado - Solo permisos personales
      console.log(roleId === 2 ? "👤 Role detected: User" : "🔄 No role assigned - using User permissions as default");
      setUserRole('User');
      
      // Convertir el objeto USER_PERMISSIONS a array de Permission
      const userPermissionArray = Object.values(USER_PERMISSIONS);
      return userPermissionArray.map((permCheck, index) => ({
        id: index + 100,
        url: permCheck.url,
        method: permCheck.method,
        entity: permCheck.url.replace('/', '').charAt(0).toUpperCase() + permCheck.url.replace('/', '').slice(1),
        name: `${permCheck.url}.${permCheck.method.toLowerCase()}`,
        description: `Permission for ${permCheck.method} ${permCheck.url}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
    } else {
      // Rol desconocido - Usar permisos de User como fallback
      console.warn(`⚠️ Unknown role_id: ${roleId} - using User permissions as fallback`);
      setUserRole('User');
      
      // Convertir el objeto USER_PERMISSIONS a array de Permission
      const userPermissionArray = Object.values(USER_PERMISSIONS);
      return userPermissionArray.map((permCheck, index) => ({
        id: index + 100,
        url: permCheck.url,
        method: permCheck.method,
        entity: permCheck.url.replace('/', '').charAt(0).toUpperCase() + permCheck.url.replace('/', '').slice(1),
        name: `${permCheck.url}.${permCheck.method.toLowerCase()}`,
        description: `Permission for ${permCheck.method} ${permCheck.url}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
    }
  };

  // Función para cargar permisos del usuario basados en su role_id
  const loadUserPermissions = async () => {
    if (!currentUser?.id) {
      console.warn("usePermissions: No user ID available");
      setPermissions([]);
      setUserRole(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convertir ID a number si es string
      const userId = typeof currentUser.id === 'string' ? parseInt(currentUser.id) : currentUser.id;
      console.log("🔐 Loading role for user:", userId);

      // 1. Obtener roles del usuario desde /api/user-roles/user/{userId}
      const userRoles: UserRole[] = await userRoleService.getRolesByUser(userId);
      console.log("👤 User roles from API:", userRoles);

      if (userRoles.length === 0) {
        console.warn("⚠️ User has no roles assigned - using default User permissions (role_id: 2)");
        // Usuario sin rol asignado obtiene permisos de User por defecto
        const defaultPermissions = getPermissionsByRoleId(2);
        setPermissions(defaultPermissions);
        return;
      }

      // 2. Obtener el primer rol activo (puedes ajustar la lógica si hay múltiples roles)
      const activeUserRole = userRoles.find(ur => {
        // Verificar si el rol está activo (dentro del período de validez)
        const now = new Date();
        const startAt = ur.startAt ? new Date(ur.startAt) : null;
        const endAt = ur.endAt ? new Date(ur.endAt) : null;
        
        const isActive = (!startAt || startAt <= now) && (!endAt || endAt >= now);
        console.log(`🔍 Role ${ur.role_id} active check:`, {
          now: now.toISOString(),
          startAt: startAt?.toISOString(),
          endAt: endAt?.toISOString(),
          isActive
        });
        
        return isActive;
      }) || userRoles[0]; // Fallback al primer rol si ninguno está explícitamente activo

      if (!activeUserRole) {
        console.warn("⚠️ No active role found for user - using default User permissions (role_id: 2)");
        // Usuario sin rol activo obtiene permisos de User por defecto
        const defaultPermissions = getPermissionsByRoleId(2);
        setPermissions(defaultPermissions);
        return;
      }

      console.log("🎯 Active user role:", activeUserRole);

      // 3. Convertir role_id a permisos predefinidos
      const rolePermissions = getPermissionsByRoleId(activeUserRole.role_id);
      
      console.log("✅ Loaded permissions based on role_id:", rolePermissions);
      setPermissions(rolePermissions);

    } catch (err) {
      console.error("❌ Error loading user permissions:", err);
      setError("Error al cargar permisos del usuario");
      setUserRole(null);
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
    userRole,
    isAdministrator: userRole === 'Administrator',
    isUser: userRole === 'User',
  };
};