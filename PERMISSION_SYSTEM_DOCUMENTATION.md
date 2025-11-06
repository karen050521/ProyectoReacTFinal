# Sistema de Permisos y Guards - Documentación Completa

## 🎯 Resumen

Sistema completo de validación de permisos en tiempo de ejecución para React/TypeScript. Proporciona hooks, utilidades y componentes guard para proteger la UI basándose en los permisos del usuario.

## 🏗️ Arquitectura del Sistema

```
Usuario → UserRole → Role → RolePermission → Permission
```

### Flujo de Permisos:
1. Usuario autenticado → obtiene ID de usuario
2. UserRole → vincula usuario con roles
3. Role → define roles del sistema
4. RolePermission → vincula roles con permisos específicos
5. Permission → define permisos específicos (URL + method + entity)

## 📁 Estructura de Archivos

```
src/
├── hooks/
│   └── usePermissions.ts          # Hook principal para cargar permisos
├── utils/
│   └── permissionHelpers.ts       # Funciones de validación
├── components/guards/
│   └── PermissionGuard.tsx        # Componentes guard para UI
├── guards/
│   └── index.ts                   # Exportaciones del sistema
└── pages/Examples/
    └── PermissionExamplePage.tsx  # Ejemplos de uso
```

## 🔧 Componentes del Sistema

### 1. Hook usePermissions

**Archivo:** `src/hooks/usePermissions.ts`

```typescript
const { permissions, loading, error, hasPermission } = usePermissions();
```

**Funcionalidades:**
- Carga automática de permisos del usuario
- Estado de loading y error
- Función hasPermission integrada
- Recarga automática cuando cambia el usuario

### 2. Utilidades de Validación

**Archivo:** `src/utils/permissionHelpers.ts`

```typescript
// Verificar un permiso específico
hasPermission(permissions, '/users', 'POST')

// Verificar cualquier permiso de una lista
hasAnyPermission(permissions, [
  { url: '/users', method: 'GET' },
  { url: '/users', method: 'POST' }
])

// Verificar todos los permisos de una lista
hasAllPermissions(permissions, [
  { url: '/users', method: 'GET' },
  { url: '/roles', method: 'GET' }
])
```

**Constantes disponibles:**
```typescript
COMMON_PERMISSIONS.USER_LIST      // { url: '/users', method: 'GET' }
COMMON_PERMISSIONS.USER_CREATE    // { url: '/users', method: 'POST' }
COMMON_PERMISSIONS.USER_UPDATE    // { url: '/users', method: 'PUT' }
COMMON_PERMISSIONS.USER_DELETE    // { url: '/users', method: 'DELETE' }
// ... más permisos para Role, Permission, UserRole
```

### 3. Componentes Guard

**Archivo:** `src/components/guards/PermissionGuard.tsx`

#### PermissionGuard
Protege cualquier contenido basándose en permisos:

```typescript
<PermissionGuard 
  url="/users" 
  method="POST"
  fallback={<p>Sin permisos</p>}
>
  <button>Crear Usuario</button>
</PermissionGuard>
```

#### ButtonGuard
Botón que se deshabilita automáticamente sin permisos:

```typescript
<ButtonGuard 
  url="/users" 
  method="DELETE"
  className="btn-danger"
  onClick={() => deleteUser()}
>
  Eliminar Usuario
</ButtonGuard>
```

#### EntityGuard
Protección basada en entidad:

```typescript
<EntityGuard 
  entity="User" 
  method="POST"
  fallback={<div>Sin acceso</div>}
>
  <UserCreateForm />
</EntityGuard>
```

#### RouteGuard
Protección de rutas completas:

```typescript
<RouteGuard 
  url="/admin" 
  method="GET"
  redirectTo="/dashboard"
>
  <AdminPanel />
</RouteGuard>
```

## 🚀 Guía de Uso

### Paso 1: Configuración Básica

```typescript
import { usePermissions } from '../guards';

const MyComponent = () => {
  const { permissions, loading, error } = usePermissions();
  
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    // Tu contenido aquí
  );
};
```

### Paso 2: Proteger Elementos de UI

```typescript
import { PermissionGuard, COMMON_PERMISSIONS } from '../guards';

// Proteger un botón específico
<PermissionGuard 
  {...COMMON_PERMISSIONS.USER_CREATE}
  fallback={<span>Sin permisos de creación</span>}
>
  <button onClick={createUser}>Crear Usuario</button>
</PermissionGuard>

// Proteger toda una sección
<PermissionGuard 
  anyOf={[
    COMMON_PERMISSIONS.USER_LIST,
    COMMON_PERMISSIONS.USER_CREATE
  ]}
>
  <UserManagementPanel />
</PermissionGuard>
```

### Paso 3: Validación Programática

```typescript
import { usePermissions, hasPermission } from '../guards';

const MyComponent = () => {
  const { permissions } = usePermissions();
  
  const canCreateUsers = hasPermission(permissions, '/users', 'POST');
  const canDeleteUsers = hasPermission(permissions, '/users', 'DELETE');
  
  return (
    <div>
      {canCreateUsers && <CreateUserButton />}
      {canDeleteUsers && <DeleteUserButton />}
    </div>
  );
};
```

## 🎨 Patrones de Uso Recomendados

### 1. Páginas Protegidas

```typescript
const UserManagementPage = () => {
  return (
    <PermissionGuard 
      anyOf={[
        COMMON_PERMISSIONS.USER_LIST,
        COMMON_PERMISSIONS.USER_CREATE,
        COMMON_PERMISSIONS.USER_UPDATE
      ]}
      fallback={<UnauthorizedPage />}
    >
      <div>
        <h1>Gestión de Usuarios</h1>
        
        <ButtonGuard {...COMMON_PERMISSIONS.USER_CREATE}>
          Crear Usuario
        </ButtonGuard>
        
        <UserTable />
      </div>
    </PermissionGuard>
  );
};
```

### 2. Formularios Dinámicos

```typescript
const UserForm = ({ userId }: { userId?: number }) => {
  const { permissions } = usePermissions();
  const isEditing = !!userId;
  
  return (
    <form>
      <input name="name" />
      <input name="email" />
      
      {/* Campo de rol solo si puede gestionar roles */}
      <PermissionGuard {...COMMON_PERMISSIONS.ROLE_LIST}>
        <RoleSelector />
      </PermissionGuard>
      
      {/* Botón de guardar */}
      <ButtonGuard 
        {...(isEditing ? COMMON_PERMISSIONS.USER_UPDATE : COMMON_PERMISSIONS.USER_CREATE)}
      >
        {isEditing ? 'Actualizar' : 'Crear'}
      </ButtonGuard>
    </form>
  );
};
```

### 3. Navegación Condicional

```typescript
const Navigation = () => {
  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>
      
      <PermissionGuard {...COMMON_PERMISSIONS.USER_LIST}>
        <Link to="/users">Usuarios</Link>
      </PermissionGuard>
      
      <PermissionGuard entity="Role" method="GET">
        <Link to="/roles">Roles</Link>
      </PermissionGuard>
      
      <PermissionGuard entity="Permission" method="GET">
        <Link to="/permissions">Permisos</Link>
      </PermissionGuard>
    </nav>
  );
};
```

## 🔍 Testing y Debugging

### Página de Ejemplos
Visita `/examples/permissions` para ver todos los casos de uso en acción.

### Debug de Permisos
```typescript
const DebugPermissions = () => {
  const { permissions } = usePermissions();
  
  console.log('Permisos del usuario:', permissions);
  
  return (
    <pre>
      {JSON.stringify(permissions, null, 2)}
    </pre>
  );
};
```

## ⚠️ Consideraciones de Seguridad

1. **Frontend Only**: Este sistema es solo para UX. La seguridad real debe estar en el backend.

2. **Validación Backend**: Siempre valida permisos en el servidor antes de procesar requests.

3. **Tokens JWT**: Los permisos deben incluirse en tokens JWT o ser verificados en cada request.

4. **Caché de Permisos**: Los permisos se cachean en el frontend. Refresca cuando sea necesario.

## 🔧 Configuración Avanzada

### Personalizar Mensajes de Error

```typescript
<PermissionGuard 
  url="/admin" 
  method="GET"
  fallback={
    <div className="bg-red-100 p-4 rounded">
      <h3>Acceso Denegado</h3>
      <p>Contacta al administrador para obtener permisos de administración.</p>
    </div>
  }
>
  <AdminPanel />
</PermissionGuard>
```

### Permisos Complejos

```typescript
<PermissionGuard 
  allOf={[
    { url: '/users', method: 'GET' },
    { url: '/roles', method: 'GET' }
  ]}
  fallback={<p>Necesitas permisos de usuarios Y roles</p>}
>
  <UserRoleAssignment />
</PermissionGuard>
```

## 📋 Checklist de Implementación

- [x] ✅ Hook usePermissions creado
- [x] ✅ Utilidades de validación implementadas
- [x] ✅ Componentes Guard desarrollados
- [x] ✅ Sistema de exportaciones configurado
- [x] ✅ Página de ejemplos creada
- [x] ✅ Documentación completa
- [ ] 🔄 Integración con rutas existentes
- [ ] 🔄 Testing de componentes
- [ ] 🔄 Optimización de rendimiento

## 🎉 Conclusión

El sistema de permisos está completamente implementado y listo para usar. Proporciona:

- **Flexibilidad**: Múltiples formas de validar permisos
- **Seguridad**: Protección a nivel de UI
- **Developer Experience**: Fácil de usar y mantener
- **Performance**: Caché eficiente de permisos
- **Escalabilidad**: Fácil agregar nuevos permisos

**Próximos pasos:**
1. Integra los guards en tus páginas existentes
2. Prueba todos los casos de uso
3. Ajusta permisos según necesidades del negocio
4. Implementa validación backend correspondiente