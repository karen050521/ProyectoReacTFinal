import React from 'react';
import { 
  PermissionGuard, 
  ButtonGuard, 
  EntityGuard,
  usePermissions,
  COMMON_PERMISSIONS,
  ENTITIES,
  PERMISSION_METHODS 
} from '../../guards';
import { Permission } from '../../models/Permission';

/**
 * Ejemplo de uso del sistema de Guards y permisos
 * Este componente muestra todas las formas de usar el sistema de permisos
 */
const PermissionExamplePage: React.FC = () => {
  const { permissions, loading, error } = usePermissions();

  if (loading) {
    return <div>Cargando permisos...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Sistema de Permisos - Ejemplos</h1>
      
      {/* Información de permisos del usuario */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Tus Permisos Actuales</h2>
        <p>Total de permisos: {permissions.length}</p>
        {permissions.length > 0 && (
          <ul className="mt-2 space-y-1">
            {permissions.map((permission: Permission, index: number) => (
              <li key={index} className="text-sm">
                <span className="font-mono bg-gray-200 px-2 py-1 rounded">
                  {permission.method}
                </span>{' '}
                {permission.url} ({permission.entity})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Ejemplo 1: PermissionGuard básico */}
      <div className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">1. PermissionGuard Básico</h2>
        
        <PermissionGuard 
          url="/users" 
          method="POST"
          fallback={<p className="text-red-600">❌ No tienes permisos para crear usuarios</p>}
        >
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            ✅ Crear Usuario (solo si tienes permiso)
          </button>
        </PermissionGuard>
      </div>

      {/* Ejemplo 2: PermissionGuard con múltiples permisos */}
      <div className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">2. PermissionGuard - Cualquier Permiso</h2>
        
        <PermissionGuard 
          anyOf={[
            COMMON_PERMISSIONS.USER_LIST,
            COMMON_PERMISSIONS.USER_CREATE,
            COMMON_PERMISSIONS.USER_UPDATE
          ]}
          fallback={<p className="text-red-600">❌ No tienes permisos de gestión de usuarios</p>}
        >
          <div className="bg-blue-100 p-3 rounded">
            ✅ Panel de Gestión de Usuarios (necesitas al menos un permiso de usuario)
          </div>
        </PermissionGuard>
      </div>

      {/* Ejemplo 3: ButtonGuard */}
      <div className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">3. ButtonGuard</h2>
        
        <div className="space-x-4">
          <ButtonGuard 
            url="/users" 
            method="DELETE"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => alert('¡Eliminando usuario!')}
          >
            Eliminar Usuario
          </ButtonGuard>
          
          <ButtonGuard 
            url="/roles" 
            method="POST"
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            onClick={() => alert('¡Creando rol!')}
          >
            Crear Rol
          </ButtonGuard>
        </div>
        
        <p className="text-sm text-gray-600 mt-2">
          Los botones se deshabilitan automáticamente si no tienes permisos
        </p>
      </div>

      {/* Ejemplo 4: EntityGuard */}
      <div className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">4. EntityGuard</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <EntityGuard 
            entity={ENTITIES.PERMISSION} 
            method={PERMISSION_METHODS.GET}
            fallback={<div className="text-gray-400">Sin acceso a permisos</div>}
          >
            <div className="bg-yellow-100 p-3 rounded">
              ✅ Puedes ver permisos
            </div>
          </EntityGuard>
          
          <EntityGuard 
            entity={ENTITIES.ROLE} 
            method={PERMISSION_METHODS.DELETE}
            fallback={<div className="text-gray-400">No puedes eliminar roles</div>}
          >
            <div className="bg-red-100 p-3 rounded">
              ⚠️ Puedes eliminar roles
            </div>
          </EntityGuard>
        </div>
      </div>

      {/* Ejemplo 5: Uso en condicionales */}
      <div className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">5. Uso Programático</h2>
        
        <div className="bg-gray-50 p-3 rounded">
          <h3 className="font-medium mb-2">Permisos de Usuario:</h3>
          <ul className="space-y-1 text-sm">
            <li>
              Puede crear usuarios: {' '}
              <span className={permissions.some((p: Permission) => p.url === '/users' && p.method === 'POST') ? 'text-green-600' : 'text-red-600'}>
                {permissions.some((p: Permission) => p.url === '/users' && p.method === 'POST') ? '✅ Sí' : '❌ No'}
              </span>
            </li>
            <li>
              Puede gestionar permisos: {' '}
              <span className={permissions.some((p: Permission) => p.entity === 'Permission') ? 'text-green-600' : 'text-red-600'}>
                {permissions.some((p: Permission) => p.entity === 'Permission') ? '✅ Sí' : '❌ No'}
              </span>
            </li>
            <li>
              Puede administrar roles: {' '}
              <span className={permissions.some((p: Permission) => p.entity === 'Role' && p.method === 'DELETE') ? 'text-green-600' : 'text-red-600'}>
                {permissions.some((p: Permission) => p.entity === 'Role' && p.method === 'DELETE') ? '✅ Sí' : '❌ No'}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">💡 Cómo Usar en Tus Componentes</h2>
        <div className="text-sm space-y-2">
          <p><strong>Para botones:</strong> Usa <code>ButtonGuard</code> o <code>PermissionGuard</code></p>
          <p><strong>Para rutas:</strong> Usa <code>RouteGuard</code> en tus componentes de ruta</p>
          <p><strong>Para secciones:</strong> Usa <code>PermissionGuard</code> o <code>EntityGuard</code></p>
          <p><strong>Para lógica custom:</strong> Usa el hook <code>usePermissions</code> directamente</p>
        </div>
      </div>
    </div>
  );
};

export default PermissionExamplePage;