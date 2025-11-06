// Barril de exports para sistema de permisos
export { usePermissions } from '../hooks/usePermissions';
export {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasEntityPermission,
  getEntityPermissions,
  createPermissionCheck,
  PERMISSION_METHODS,
  ENTITIES,
  COMMON_PERMISSIONS
} from '../utils/permissionHelpers';
export {
  PermissionGuard,
  ButtonGuard,
  RouteGuard,
  EntityGuard
} from '../components/guards/PermissionGuard';