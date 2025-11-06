import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { hasPermission, hasAnyPermission } from '../../utils/permissionHelpers';
import type { Permission } from '../../models/Permission';

interface PermissionGuardProps {
  children: React.ReactNode;
  url?: string;
  method?: string;
  entity?: string;
  anyOf?: Array<{url: string; method: string}>;
  fallback?: React.ReactNode;
  loading?: React.ReactNode;
}

/**
 * PermissionGuard - Componente para mostrar contenido solo si el usuario tiene permisos
 * 
 * Uso:
 * <PermissionGuard url="/users" method="POST">
 *   <Button>Crear Usuario</Button>
 * </PermissionGuard>
 * 
 * <PermissionGuard anyOf={[{url: "/users", method: "GET"}, {url: "/users", method: "POST"}]}>
 *   <UserSection />
 * </PermissionGuard>
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  url,
  method,
  anyOf,
  fallback = null,
  loading = null
}) => {
  const { permissions, loading: permissionsLoading } = usePermissions();

  // Mostrar loading mientras se cargan permisos
  if (permissionsLoading) {
    return loading ? <>{loading}</> : null;
  }

  let hasAccess = false;

  if (anyOf && anyOf.length > 0) {
    // Verificar si tiene cualquiera de los permisos especificados
    hasAccess = hasAnyPermission(permissions, anyOf);
  } else if (url && method) {
    // Verificar permiso específico
    hasAccess = hasPermission(permissions, url, method);
  } else {
    console.warn('PermissionGuard: Debe especificar url+method o anyOf');
    return <>{fallback}</>;
  }

  // Si tiene acceso, mostrar children; sino, mostrar fallback
  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

interface ButtonGuardProps {
  children: React.ReactNode;
  url: string;
  method: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * ButtonGuard - Wrapper para botones que se habilitan/deshabilitan según permisos
 * 
 * Uso:
 * <ButtonGuard url="/users" method="DELETE" onClick={handleDelete}>
 *   Eliminar
 * </ButtonGuard>
 */
export const ButtonGuard: React.FC<ButtonGuardProps> = ({
  children,
  url,
  method,
  disabled = false,
  className = '',
  style = {},
  onClick
}) => {
  const { permissions } = usePermissions();
  
  const hasAccess = hasPermission(permissions, url, method);
  const isDisabled = disabled || !hasAccess;

  return (
    <button
      onClick={hasAccess ? onClick : undefined}
      disabled={isDisabled}
      className={`${className} ${!hasAccess ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={style}
      title={!hasAccess ? 'No tienes permisos para esta acción' : ''}
    >
      {children}
    </button>
  );
};

interface RouteGuardProps {
  children: React.ReactNode;
  url: string;
  method: string;
  fallback?: React.ReactNode;
}

/**
 * RouteGuard - Protege rutas completas basado en permisos
 * 
 * Uso en rutas:
 * <Route path="/admin" element={
 *   <RouteGuard url="/admin" method="GET" fallback={<Unauthorized />}>
 *     <AdminPanel />
 *   </RouteGuard>
 * } />
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  url,
  method,
  fallback = <div className="text-center p-8 text-red-600">No tienes permisos para acceder a esta página</div>
}) => {
  const { permissions, loading } = usePermissions();

  // Mostrar loading mientras se verifican permisos
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        <span className="ml-2">Verificando permisos...</span>
      </div>
    );
  }

  const hasAccess = hasPermission(permissions, url, method);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

interface EntityGuardProps {
  children: React.ReactNode;
  entity: string;
  method: string;
  fallback?: React.ReactNode;
}

/**
 * EntityGuard - Protege basado en entidad y método
 * 
 * Uso:
 * <EntityGuard entity="User" method="POST">
 *   <CreateUserButton />
 * </EntityGuard>
 */
export const EntityGuard: React.FC<EntityGuardProps> = ({
  children,
  entity,
  method,
  fallback = null
}) => {
  const { permissions } = usePermissions();

  const hasAccess = permissions.some((p: Permission) => 
    p.entity === entity && p.method.toUpperCase() === method.toUpperCase()
  );

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * AdminGuard - Wrapper especial para funciones administrativas
 * Simplifica el uso verificando si el usuario tiene permisos de administrador
 * 
 * Uso:
 * <AdminGuard fallback={<NoAdminMessage />}>
 *   <AdminPanel />
 * </AdminGuard>
 */
export const AdminGuard: React.FC<AdminGuardProps> = ({
  children,
  fallback
}) => {
  const { permissions, loading, isAdminSafe, roleId, useDynamicPermissions, isTransitioning } = usePermissions();
  
  // Durante la carga inicial o transición, mostrar loader en lugar del fallback
  if (loading && !isTransitioning) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  // 🛡️ Verificación principal: usar isAdminSafe que es más confiable
  const isAdmin = isAdminSafe();
  
  // 🔄 Verificación adicional durante transición a modo dinámico
  const hasAdminPermissionsDynamic = hasAnyPermission(permissions, [
    { url: '/users', method: 'GET' },
    { url: '/roles', method: 'GET' },
    { url: '/permissions', method: 'GET' }
  ]);
  
  // ✅ Si es admin por role_id o tiene permisos admin, permitir acceso
  // Durante transición, mantener acceso si es admin verificado
  const allowAccess = isAdmin || hasAdminPermissionsDynamic || (isTransitioning && roleId === 1);
  
  console.log('🛡️ AdminGuard evaluation:', {
    roleId,
    isAdmin,
    hasAdminPermissionsDynamic,
    allowAccess,
    useDynamicPermissions,
    isTransitioning,
    permissionsCount: permissions.length
  });

  if (!allowAccess) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h2>
        <p className="text-gray-600">Esta función requiere permisos de administrador.</p>
        <p className="text-sm text-gray-500 mt-2">Solo usuarios con rol Administrator pueden acceder.</p>
      </div>
    );
  }

  return <>{children}</>;
};