import type { Permission } from "../models/Permission";

/**
 * Helper función para validar permisos de forma sencilla
 * Puede ser usado independientemente del hook usePermissions
 */

// Función global para verificar permisos
export const hasPermission = (
  permissions: Permission[], 
  url: string, 
  method: string
): boolean => {
  if (!permissions || permissions.length === 0) {
    return false;
  }

  const permission = permissions.find(p => 
    p.url === url && p.method.toUpperCase() === method.toUpperCase()
  );

  return !!permission;
};

// Función para verificar múltiples permisos (OR logic)
export const hasAnyPermission = (
  permissions: Permission[],
  permissionChecks: Array<{url: string; method: string}>
): boolean => {
  if (!permissions || permissions.length === 0) {
    return false;
  }

  return permissionChecks.some(check => 
    hasPermission(permissions, check.url, check.method)
  );
};

// Función para verificar que tiene TODOS los permisos (AND logic)
export const hasAllPermissions = (
  permissions: Permission[],
  permissionChecks: Array<{url: string; method: string}>
): boolean => {
  if (!permissions || permissions.length === 0) {
    return false;
  }

  return permissionChecks.every(check => 
    hasPermission(permissions, check.url, check.method)
  );
};

// Función para verificar permisos por entidad
export const hasEntityPermission = (
  permissions: Permission[],
  entity: string,
  method: string
): boolean => {
  if (!permissions || permissions.length === 0) {
    return false;
  }

  const permission = permissions.find(p => 
    p.entity === entity && p.method.toUpperCase() === method.toUpperCase()
  );

  return !!permission;
};

// Función para obtener todos los permisos de una entidad específica
export const getEntityPermissions = (
  permissions: Permission[],
  entity: string
): Permission[] => {
  if (!permissions || permissions.length === 0) {
    return [];
  }

  return permissions.filter(p => p.entity === entity);
};

// Constantes de permisos comunes para facilitar el uso
export const PERMISSION_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
} as const;

// Constantes de entidades comunes
export const ENTITIES = {
  USER: 'User',
  ROLE: 'Role',
  PERMISSION: 'Permission',
  ADDRESS: 'Address',
  PROFILE: 'Profile',
  PASSWORD: 'Password',
  SESSION: 'Session'
} as const;

// Función de conveniencia para crear checks de permisos
export const createPermissionCheck = (url: string, method: string) => ({ url, method });

// Ejemplos de uso comunes organizados por roles
export const ADMIN_PERMISSIONS = {
  // Gestión de usuarios (formato entidad.acción)
  USERS_VIEW: createPermissionCheck('/users', PERMISSION_METHODS.GET),
  USERS_CREATE: createPermissionCheck('/users', PERMISSION_METHODS.POST),
  USERS_UPDATE: createPermissionCheck('/users', PERMISSION_METHODS.PUT),
  USERS_DELETE: createPermissionCheck('/users', PERMISSION_METHODS.DELETE),
  
  // Gestión de roles
  ROLES_VIEW: createPermissionCheck('/roles', PERMISSION_METHODS.GET),
  ROLES_CREATE: createPermissionCheck('/roles', PERMISSION_METHODS.POST),
  ROLES_UPDATE: createPermissionCheck('/roles', PERMISSION_METHODS.PUT),
  ROLES_DELETE: createPermissionCheck('/roles', PERMISSION_METHODS.DELETE),
  
  // Gestión de permisos
  PERMISSIONS_VIEW: createPermissionCheck('/permissions', PERMISSION_METHODS.GET),
  PERMISSIONS_CREATE: createPermissionCheck('/permissions', PERMISSION_METHODS.POST),
  PERMISSIONS_UPDATE: createPermissionCheck('/permissions', PERMISSION_METHODS.PUT),
  PERMISSIONS_DELETE: createPermissionCheck('/permissions', PERMISSION_METHODS.DELETE),
  
  // Gestión avanzada
  ROLE_PERMISSIONS_MANAGE: createPermissionCheck('/role-permissions', PERMISSION_METHODS.POST),
  USER_ROLES_MANAGE: createPermissionCheck('/user-roles', PERMISSION_METHODS.POST),
  
  // Supervisión y control
  SESSIONS_VIEW: createPermissionCheck('/sessions', PERMISSION_METHODS.GET),
  SESSIONS_REVOKE: createPermissionCheck('/sessions', PERMISSION_METHODS.DELETE),
  PASSWORDS_VIEW: createPermissionCheck('/passwords', PERMISSION_METHODS.GET),
  PASSWORDS_DELETE: createPermissionCheck('/passwords', PERMISSION_METHODS.DELETE),
} as const;

export const USER_PERMISSIONS = {
  // Perfil propio
  PROFILE_VIEW: createPermissionCheck('/profile', PERMISSION_METHODS.GET),
  PROFILE_UPDATE: createPermissionCheck('/profile', PERMISSION_METHODS.PUT),
  
  // Direcciones propias (sin guard - acceso libre)
  ADDRESSES_VIEW: createPermissionCheck('/addresses', PERMISSION_METHODS.GET),
  ADDRESSES_CREATE: createPermissionCheck('/addresses', PERMISSION_METHODS.POST),
  ADDRESSES_UPDATE: createPermissionCheck('/addresses', PERMISSION_METHODS.PUT),
  
  // Contraseña propia
  PASSWORDS_CREATE: createPermissionCheck('/passwords', PERMISSION_METHODS.POST),
  
  // Dispositivos propios
  DEVICES_VIEW: createPermissionCheck('/devices', PERMISSION_METHODS.GET),
  
  // Sesiones propias - Usuario puede gestionar SUS propias sesiones
  SESSIONS_VIEW_OWN: createPermissionCheck('/sessions/own', PERMISSION_METHODS.GET),
  SESSIONS_VIEW: createPermissionCheck('/sessions', PERMISSION_METHODS.GET), // Ver sus propias sesiones
  SESSIONS_DELETE_OWN: createPermissionCheck('/sessions/own', PERMISSION_METHODS.DELETE), // Cerrar sus propias sesiones
} as const;

// Combinación de todos los permisos para facilidad de uso
export const COMMON_PERMISSIONS = {
  ...ADMIN_PERMISSIONS,
  ...USER_PERMISSIONS,
  
  // Mantener compatibilidad con código existente
  USER_LIST: ADMIN_PERMISSIONS.USERS_VIEW,
  USER_CREATE: ADMIN_PERMISSIONS.USERS_CREATE,
  USER_UPDATE: ADMIN_PERMISSIONS.USERS_UPDATE,
  USER_DELETE: ADMIN_PERMISSIONS.USERS_DELETE,
  ROLE_LIST: ADMIN_PERMISSIONS.ROLES_VIEW,
  ROLE_CREATE: ADMIN_PERMISSIONS.ROLES_CREATE,
  ROLE_UPDATE: ADMIN_PERMISSIONS.ROLES_UPDATE,
  ROLE_DELETE: ADMIN_PERMISSIONS.ROLES_DELETE,
  PERMISSION_LIST: ADMIN_PERMISSIONS.PERMISSIONS_VIEW,
  PERMISSION_CREATE: ADMIN_PERMISSIONS.PERMISSIONS_CREATE,
  PERMISSION_UPDATE: ADMIN_PERMISSIONS.PERMISSIONS_UPDATE,
  PERMISSION_DELETE: ADMIN_PERMISSIONS.PERMISSIONS_DELETE,
  ROLE_PERMISSION_MANAGE: ADMIN_PERMISSIONS.ROLE_PERMISSIONS_MANAGE,
} as const;

// Constantes de roles
export const ROLES = {
  ADMINISTRATOR: 'Administrator',
  USER: 'User'
} as const;

// Función de conveniencia para verificar si un usuario es administrador
export const isAdministrator = (permissions: Permission[]): boolean => {
  // Un administrador debe tener al menos estos permisos críticos
  const adminCriticalPerms = [
    ADMIN_PERMISSIONS.USERS_VIEW,
    ADMIN_PERMISSIONS.ROLES_VIEW,
    ADMIN_PERMISSIONS.PERMISSIONS_VIEW,
  ];
  
  return hasAllPermissions(permissions, adminCriticalPerms);
};

// Función para verificar si un usuario es usuario normal (no admin)
export const isNormalUser = (permissions: Permission[]): boolean => {
  return !isAdministrator(permissions);
};