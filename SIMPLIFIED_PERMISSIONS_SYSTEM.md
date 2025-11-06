# 🔐 Sistema de Permisos Simplificado - Documentación

## 📋 Visión General

Sistema de autorización basado en **2 roles principales** con permisos específicos por funcionalidad. Este enfoque simplifica la gestión de permisos mientras mantiene la seguridad necesaria.

---

## 👤 Roles del Sistema

### 1. **Administrator**
- **Descripción**: Rol con acceso completo al sistema
- **Alcance**: Gestión total de usuarios, roles, permisos y configuración
- **Asignación**: Solo para personal administrativo autorizado

### 2. **User** (Usuario Normal)
- **Descripción**: Rol por defecto para usuarios estándar
- **Alcance**: Acceso a funciones básicas y gestión de datos propios
- **Asignación**: Automática al crear nuevo usuario

---

## 🛡️ Permisos por Rol

### **Permisos de Administrator**
```typescript
// Gestión de usuarios (formato entidad.acción)
users.view      // Ver lista de usuarios
users.create    // Crear nuevos usuarios  
users.update    // Modificar usuarios existentes
users.delete    // Eliminar usuarios

// Gestión de roles
roles.view      // Ver lista de roles
roles.create    // Crear nuevos roles
roles.update    // Modificar roles existentes
roles.delete    // Eliminar roles

// Gestión de permisos
permissions.view    // Ver lista de permisos
permissions.create  // Crear nuevos permisos
permissions.update  // Modificar permisos
permissions.delete  // Eliminar permisos

// Gestión avanzada
role_permissions.manage  // Asignar/quitar permisos a roles
user_roles.manage       // Asignar/quitar roles a usuarios

// Supervisión y control
sessions.view    // Ver todas las sesiones de usuarios
sessions.revoke  // Revocar sesiones de cualquier usuario
passwords.view   // Ver historial de contraseñas
passwords.delete // Eliminar entradas del historial
```

### **Permisos de User (Usuario Normal)**
```typescript
// Perfil propio
profile.view    // Ver su propio perfil
profile.update  // Actualizar su propio perfil

// Direcciones propias (sin guard - acceso libre)
addresses.view    // Ver sus direcciones
addresses.create  // Crear nuevas direcciones
addresses.update  // Actualizar sus direcciones

// Contraseña propia
passwords.create  // Cambiar su propia contraseña (crear entrada historial)

// Dispositivos propios
devices.view  // Ver sus dispositivos registrados

// Sesiones propias
sessions.view  // Ver sus propias sesiones activas
```

---

## 🚀 Uso del Sistema

### **AdminGuard - Para Funciones Administrativas**
```tsx
import { AdminGuard } from '../../guards';

// Protege funciones que requieren rol Administrator
<AdminGuard fallback={<AccessDeniedMessage />}>
  <AdminPanel />
</AdminGuard>
```

### **PermissionGuard - Para Permisos Específicos**
```tsx
import { PermissionGuard } from '../../guards';

// Para usuarios normales con permisos específicos
<PermissionGuard 
  url="/profile" 
  method="PUT"
  fallback={<NoPermissionMessage />}
>
  <EditProfileForm />
</PermissionGuard>
```

### **ButtonGuard - Para Botones Condicionales**
```tsx
import { ButtonGuard } from '../../guards';

// Botones que se habilitan/deshabilitan según permisos
<ButtonGuard
  url="/users"
  method="POST"
  onClick={handleCreateUser}
>
  Crear Usuario
</ButtonGuard>
```

---

## 📊 Páginas y Protecciones Aplicadas

### **Páginas con AdminGuard** (Solo Administrator)
- ✅ `/roles/*` - Gestión de roles
- ✅ `/permissions/*` - Gestión de permisos  
- ✅ `/user-roles/*` - Asignación de roles
- ✅ `/users/*` - Gestión de usuarios (lista, crear, editar)
- ✅ `/passwords/*` - Historial de contraseñas (supervisión)
- ✅ `/sessions/*` - Gestión de sesiones (supervisión)

### **Páginas con Acceso Libre** (Para todos los usuarios autenticados)
- 🔓 `/addresses/*` - Gestión de direcciones personales
- 🔓 `/profile/*` - Gestión de perfil propio
- 🔓 Dashboard básico

### **Páginas Públicas** (Sin autenticación)
- 🌐 `/login` - Inicio de sesión
- 🌐 `/register` - Registro de usuarios

---

## 🔧 Funciones Helper Disponibles

### **Verificación de Roles**
```typescript
import { isAdministrator, isNormalUser } from '../../guards';

// Verificar si es administrador
const isAdmin = isAdministrator(permissions);

// Verificar si es usuario normal
const isUser = isNormalUser(permissions);
```

### **Verificación de Permisos**
```typescript
import { hasPermission, hasAnyPermission } from '../../guards';

// Verificar permiso específico
const canCreateUsers = hasPermission(permissions, '/users', 'POST');

// Verificar cualquiera de varios permisos
const canManageUsers = hasAnyPermission(permissions, [
  { url: '/users', method: 'GET' },
  { url: '/users', method: 'POST' }
]);
```

---

## 🎯 Casos de Uso Prácticos

### **Escenario 1: Usuario Administrador**
```typescript
// Permisos que debe tener
const adminPermissions = [
  { url: '/users', method: 'GET', entity: 'User' },
  { url: '/roles', method: 'GET', entity: 'Role' },
  { url: '/permissions', method: 'GET', entity: 'Permission' },
  // ... otros permisos administrativos
];

// Resultado: Acceso completo a todas las funciones administrativas
```

### **Escenario 2: Usuario Normal**
```typescript
// Permisos que debe tener
const userPermissions = [
  { url: '/profile', method: 'GET', entity: 'Profile' },
  { url: '/profile', method: 'PUT', entity: 'Profile' },
  { url: '/passwords', method: 'POST', entity: 'Password' },
  // ... otros permisos de usuario normal
];

// Resultado: Acceso solo a funciones de gestión personal
```

### **Escenario 3: Usuario Sin Permisos**
```typescript
// Sin permisos o permisos insuficientes
const noPermissions = [];

// Resultado: Ve mensajes de "Acceso Denegado" en funciones protegidas
```

---

## 🔄 Flujo de Verificación

1. **Usuario accede a página protegida**
2. **Sistema carga permisos del usuario** (desde usePermissions hook)
3. **Guard evalúa permisos**:
   - `AdminGuard`: Verifica si tiene permisos de administrador
   - `PermissionGuard`: Verifica permiso específico por URL/método
   - `ButtonGuard`: Habilita/deshabilita botón según permiso
4. **Resultado**:
   - ✅ **Con permisos**: Muestra contenido
   - ❌ **Sin permisos**: Muestra fallback o deshabilita funcionalidad

---

## 📈 Ventajas del Sistema

### **Simplicidad**
- ✅ Solo 2 roles principales (Administrator/User)
- ✅ Permisos claros y específicos por funcionalidad
- ✅ Fácil entender quién puede hacer qué

### **Flexibilidad**
- ✅ Guards reutilizables para diferentes casos
- ✅ Permisos granulares cuando se necesiten
- ✅ Fácil agregar nuevos permisos o roles

### **Seguridad**
- ✅ Protección multinivel (página + botón)
- ✅ Fallbacks claros para usuarios sin permisos
- ✅ Validación en tiempo real

### **Mantenibilidad**
- ✅ Código organizado y predecible
- ✅ Constantes centralizadas
- ✅ TypeScript para type safety

---

## 🚀 Implementación en Producción

### **Backend Requirements**
```json
// Estructura de usuario con roles
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "roles": [
      {
        "id": 1,
        "name": "Administrator",
        "permissions": [
          { "url": "/users", "method": "GET", "entity": "User" },
          { "url": "/roles", "method": "GET", "entity": "Role" },
          // ... más permisos
        ]
      }
    ]
  }
}
```

### **Frontend Integration**
```typescript
// En tu componente principal
import { usePermissions, AdminGuard } from './guards';

function App() {
  const { permissions, loading } = usePermissions();
  
  if (loading) return <Loading />;
  
  return (
    <Router>
      <Route path="/admin/*" element={
        <AdminGuard>
          <AdminRoutes />
        </AdminGuard>
      } />
      <Route path="/profile" element={<UserProfile />} />
    </Router>
  );
}
```

---

## 🎉 Resultado Final

**Sistema de permisos enterprise-grade con:**
- 🛡️ **Seguridad robusta** basada en roles específicos
- 🎯 **UX optimizada** - usuarios ven solo lo que pueden usar
- 🔧 **Mantenimiento simplificado** con roles claros
- 📈 **Escalabilidad garantizada** para crecimiento futuro

**¡Tu aplicación ahora tiene un sistema de permisos profesional y fácil de mantener! 🚀**