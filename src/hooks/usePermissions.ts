import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { userRoleService } from "../services/userRoleService";
import { permissionService } from "../services/permissionService";
import { usePermissionUpdate } from "../context/PermissionUpdateContext";
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
  roleId: number | null;
  enableDynamicMode: () => Promise<void>;
  disableDynamicMode: () => Promise<void>;
  useDynamicPermissions: boolean;
  isAdminSafe: () => boolean;
  getAdminPermissionsSafe: () => Permission[];
  isTransitioning: boolean;
}

export const usePermissions = (): UsePermissionsReturn => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'Administrator' | 'User' | null>(null);
  const [roleId, setRoleId] = useState<number | null>(null);
  const [useDynamicPermissions, setUseDynamicPermissions] = useState<boolean>(false);

  // Obtener usuario del store (tradicional o Microsoft)
  const user = useSelector((state: RootState) => state.user.user);
  const microsoftUser = useSelector((state: RootState) => state.microsoftAuth.user);
  const currentUser = user || microsoftUser;

  // Contexto para actualizaciones globales de permisos
  const { updateTrigger, isDynamicMode, setDynamicMode, isTransitioning } = usePermissionUpdate();

  // Función para cargar permisos dinámicos desde la base de datos
  const loadDynamicPermissions = async (currentRoleId: number): Promise<Permission[]> => {
    try {
      console.log(`🔄 Loading dynamic permissions for role_id: ${currentRoleId}`);
      
      // Obtener permisos asignados al rol desde la base de datos
      const rolePermissions = await permissionService.getPermissionsByRole(currentRoleId);
      console.log(`📋 Dynamic permissions loaded from DB:`, {
        roleId: currentRoleId,
        permissionsCount: rolePermissions?.length || 0,
        permissions: rolePermissions?.map(p => `ID:${p.id} ${p.url} ${p.method}`) || []
      });
      
      // Si no hay permisos dinámicos, usar los hardcodeados como fallback
      if (!rolePermissions || rolePermissions.length === 0) {
        console.log(`⚠️ No dynamic permissions found for role ${currentRoleId}, using static fallback`);
        const staticPermissions = getPermissionsByRoleId(currentRoleId);
        console.log(`🔒 Static fallback permissions:`, {
          count: staticPermissions.length,
          sample: staticPermissions.slice(0, 3).map(p => `${p.url} ${p.method}`)
        });
        return staticPermissions;
      }
      
      return rolePermissions;
    } catch (error) {
      console.error("❌ Error loading dynamic permissions:", error);
      // En caso de error, usar permisos por defecto
      console.log(`🔒 Fallback to static permissions for role ${currentRoleId}`);
      return getPermissionsByRoleId(currentRoleId);
    }
  };

  // Función para convertir role_id a permisos predefinidos (INICIAL)
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
      setRoleId(null);
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
        const defaultPermissions = useDynamicPermissions ? 
          await loadDynamicPermissions(2) : 
          getPermissionsByRoleId(2);
        setPermissions(defaultPermissions);
        setRoleId(2);
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
        const defaultPermissions = useDynamicPermissions ? 
          await loadDynamicPermissions(2) : 
          getPermissionsByRoleId(2);
        setPermissions(defaultPermissions);
        setRoleId(2);
        return;
      }

      console.log("🎯 Active user role:", activeUserRole);
      setRoleId(activeUserRole.role_id);

      // 3. Cargar permisos de forma inteligente
      const shouldUseDynamic = useDynamicPermissions || isDynamicMode;
      let rolePermissions: Permission[];
      
      console.log(`🎯 Permission loading decision for role_id ${activeUserRole.role_id}:`, {
        useDynamicPermissions,
        isDynamicMode,
        shouldUseDynamic,
        trigger: 'loadUserPermissions'
      });
      
      if (shouldUseDynamic) {
        console.log(`🔄 Loading permissions for role_id ${activeUserRole.role_id} in DYNAMIC mode`);
        rolePermissions = await loadDynamicPermissions(activeUserRole.role_id);
        
        // Verificar si los permisos dinámicos son válidos
        const hasValidPermissions = rolePermissions.length > 0;
        console.log(`📊 Dynamic permissions validation:`, {
          permissionsCount: rolePermissions.length,
          hasValidPermissions,
          isAdmin: activeUserRole.role_id === 1
        });
        
        if (!hasValidPermissions && activeUserRole.role_id === 1) {
          console.log(`⚠️ Admin has no dynamic permissions, keeping static permissions as safety net`);
          rolePermissions = getPermissionsByRoleId(activeUserRole.role_id);
        }
      } else {
        console.log(`🔒 Loading permissions for role_id ${activeUserRole.role_id} in STATIC mode`);
        rolePermissions = getPermissionsByRoleId(activeUserRole.role_id);
      }
      
      console.log(`✅ Final permissions loaded:`, {
        mode: shouldUseDynamic ? 'DYNAMIC' : 'STATIC',
        roleId: activeUserRole.role_id,
        permissionsCount: rolePermissions.length,
        samplePermissions: rolePermissions.slice(0, 3).map(p => `${p.url} ${p.method}`)
      });
      setPermissions(rolePermissions);

    } catch (err) {
      console.error("❌ Error loading user permissions:", err);
      setError("Error al cargar permisos del usuario");
      setUserRole(null);
      setRoleId(null);
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
    console.log(`🔍 hasPermission(${url}, ${method}): ${hasAccess}`, {
      searchingIn: permissions.length + ' permissions',
      currentMode: useDynamicPermissions || isDynamicMode ? 'DYNAMIC' : 'STATIC',
      foundPermission: permission ? `ID:${permission.id} - ${permission.url} ${permission.method}` : 'NOT FOUND',
      userRole: userRole,
      roleId: roleId
    });
    
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

  // Función para activar el modo dinámico (llamar cuando se hagan cambios en la interfaz)
  const enableDynamicMode = async (): Promise<void> => {
    console.log("🔄 Activating dynamic permissions mode");
    setUseDynamicPermissions(true);
    setDynamicMode(true);
    
    // Forzar recarga inmediata de permisos
    console.log("⚡ Force reloading permissions immediately");
    await loadUserPermissions();
  };

  // Función para desactivar el modo dinámico (volver a permisos estáticos)
  const disableDynamicMode = async (): Promise<void> => {
    console.log("🔒 Reverting to static permissions mode");
    setUseDynamicPermissions(false);
    setDynamicMode(false);
    await loadUserPermissions();
  };

  // Función segura para verificar si es administrador (incluso sin permisos dinámicos)
  const isAdminSafe = (): boolean => {
    // Durante transición, mantener acceso admin si ya era admin
    if (isTransitioning && roleId === 1) {
      console.log("⏳ Transitioning state - maintaining admin access");
      return true;
    }
    return roleId === 1 || userRole === 'Administrator';
  };

  // Función para obtener permisos administrativos seguros
  const getAdminPermissionsSafe = (): Permission[] => {
    if (roleId === 1) {
      // Si es admin, siempre devolver permisos completos
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
    }
    return permissions;
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

  // Recargar permisos cuando hay actualizaciones globales
  useEffect(() => {
    if (updateTrigger > 0 && currentUser) {
      console.log("🔄 Reloading permissions due to global update trigger");
      loadUserPermissions();
    }
  }, [updateTrigger, currentUser?.id]);

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
    roleId,
    enableDynamicMode,
    disableDynamicMode,
    useDynamicPermissions,
    isAdminSafe,
    getAdminPermissionsSafe,
    isTransitioning,
  };
};