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

// Ejemplos de uso comunes
export const COMMON_PERMISSIONS = {
  // Users
  USER_LIST: createPermissionCheck('/users', PERMISSION_METHODS.GET),
  USER_CREATE: createPermissionCheck('/users', PERMISSION_METHODS.POST),
  USER_UPDATE: createPermissionCheck('/users/:id', PERMISSION_METHODS.PUT),
  USER_DELETE: createPermissionCheck('/users/:id', PERMISSION_METHODS.DELETE),
  
  // Roles
  ROLE_LIST: createPermissionCheck('/roles', PERMISSION_METHODS.GET),
  ROLE_CREATE: createPermissionCheck('/roles', PERMISSION_METHODS.POST),
  ROLE_UPDATE: createPermissionCheck('/roles/:id', PERMISSION_METHODS.PUT),
  ROLE_DELETE: createPermissionCheck('/roles/:id', PERMISSION_METHODS.DELETE),
  
  // Permissions
  PERMISSION_LIST: createPermissionCheck('/permissions', PERMISSION_METHODS.GET),
  PERMISSION_CREATE: createPermissionCheck('/permissions', PERMISSION_METHODS.POST),
  PERMISSION_UPDATE: createPermissionCheck('/permissions/:id', PERMISSION_METHODS.PUT),
  PERMISSION_DELETE: createPermissionCheck('/permissions/:id', PERMISSION_METHODS.DELETE),
  
  // Role Permissions
  ROLE_PERMISSION_MANAGE: createPermissionCheck('/role-permissions', PERMISSION_METHODS.POST),
} as const;