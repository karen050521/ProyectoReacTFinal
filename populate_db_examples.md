# Populate DB — JSON examples & TypeScript interfaces

Este documento contiene ejemplos detallados para poblar la base de datos con todos los modelos relacionados: `address`, `password`, `permission`, `profile`, `role_permission`, `role`, `session`, `user_role`, `user`.

Usa estos JSON como datos de prueba para popular tu backend y comenzar a desarrollar el frontend.

---

## Reglas generales
- Endpoint base (ejemplo): `POST http://localhost:5000/users/` — dependiente del controlador que maneje creación compuesta.
- En estos ejemplos, los objetos anidados se asumen creados junto al `user` (si tu backend no soporta crear relaciones anidadas, crea primero roles/permissions por separado y usa sus ids).
- Campos `id` y campos con UUIDs (`id` en `role_permissions`, `user_roles`, `sessions`) en general los genera el backend; aquí puedes omitirlos o poner valores de prueba.
- Para archivos (`photo`), se usan rutas simuladas (`/uploads/...`). Si subes imágenes, primero sube el archivo y usa la ruta devuelta.

---

## 1) Ejemplo completo para crear un usuario con todo (User + Profile + Address + Passwords + Sessions + Roles + RolePermissions + Permissions + UserRoles + DigitalSignature)

> Nota: este JSON asume que tu backend puede recibir un objeto compuesto y crear las entidades relacionadas en la misma transacción. Si no es así, crea primero Roles y Permissions usando endpoints separados.

```json
{
  "name": "Admin User",
  "email": "admin@example.com",

  "profile": {
    "phone": "+34 600 111 222",
    "photo": "/uploads/profiles/admin.jpg"
  },

  "address": {
    "street": "Plaza Mayor",
    "number": "1",
    "latitude": 40.416775,
    "longitude": -3.703790
  },

  "digital_signature": {
    "photo": "/uploads/digital-signatures/admin-sign.png"
  },

  "passwords": [
    {
      "content": "$2b$12$examplehashedpassword",
      "startAt": "2025-10-23T00:00:00Z"
    }
  ],

  "sessions": [
    {
      "id": "session-uuid-1",
      "token": "token-example-123",
      "expiration": "2025-11-23T00:00:00Z",
      "FACode": "123456",
      "state": "active"
    }
  ],

  "roles": [
    {
      "id": 1,
      "name": "admin",
      "description": "Administrator role"
    }
  ],

  "permissions": [
    {
      "id": 1,
      "url": "/api/users",
      "method": "GET",
      "entity": "user"
    },
    {
      "id": 2,
      "url": "/api/users",
      "method": "POST",
      "entity": "user"
    }
  ],

  "role_permissions": [
    {
      "id": "rp-uuid-1",
      "role_id": 1,
      "permission_id": 1
    },
    {
      "id": "rp-uuid-2",
      "role_id": 1,
      "permission_id": 2
    }
  ],

  "user_roles": [
    {
      "id": "ur-uuid-1",
      "role_id": 1,
      "startAt": "2025-10-23T00:00:00Z"
    }
  ]
}
```

---

## 2) Ejemplo para popular roles y permissions por separado (recomendado si tu backend no maneja creación anidada)

### A) Crear Roles (POST /roles)

```json
[  
  { "name": "admin", "description": "Administrator role" },
  { "name": "editor", "description": "Content editor" },
  { "name": "viewer", "description": "Read-only user" }
]
```

### B) Crear Permissions (POST /permissions)

```json
[
  { "url": "/api/users", "method": "GET", "entity": "user" },
  { "url": "/api/users", "method": "POST", "entity": "user" },
  { "url": "/api/addresses", "method": "POST", "entity": "address" },
  { "url": "/api/roles", "method": "GET", "entity": "role" }
]
```

### C) Crear RolePermission (POST /role_permissions)

```json
{
  "role_id": 1,
  "permission_id": 1
}
```

---

## 3) Ejemplos rápidos para poblar usuarios de prueba (varias cuentas)

### User 1: Admin (completo)
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "profile": { "phone": "+34 600 111 222", "photo": "/uploads/profiles/admin.jpg" },
  "address": { "street": "Plaza Mayor", "number": "1", "latitude": 40.416775, "longitude": -3.703790 },
  "digital_signature": { "photo": "/uploads/digital-signatures/admin-sign.png" }
}
```

### User 2: Editor
```json
{
  "name": "Editor User",
  "email": "editor@example.com",
  "profile": { "phone": "+34 600 222 333", "photo": "/uploads/profiles/editor.jpg" },
  "address": { "street": "Calle del Prado", "number": "10", "latitude": 40.413782, "longitude": -3.692127 }
}
```

### User 3: Viewer
```json
{
  "name": "Viewer User",
  "email": "viewer@example.com",
  "profile": { "phone": "+34 600 333 444" },
  "address": { "street": "Calle Mayor", "number": "20" }
}
```

---

## 4) Esquema mínimo para crear `passwords`, `sessions` y `user_roles` (POSTs separados si tu backend lo requiere)

### Password (POST /passwords)
```json
{
  "user_id": 1,
  "content": "$2b$12$examplehashedpassword",
  "startAt": "2025-10-23T00:00:00Z"
}
```

### Session (POST /sessions)
```json
{
  "id": "session-uuid-2",
  "user_id": 1,
  "token": "token-example-456",
  "expiration": "2025-12-01T00:00:00Z",
  "FACode": "654321",
  "state": "active"
}
```

### UserRole (POST /user_roles)
```json
{
  "user_id": 1,
  "role_id": 1,
  "startAt": "2025-10-23T00:00:00Z"
}
```

---

## 5) Interfaces TypeScript para React (`src/models/populate.ts`)

```ts
export interface Permission {
  id?: number;
  url: string;
  method: string;
  entity: string;
  created_at?: string;
  updated_at?: string;
}

export interface RolePermission {
  id?: string; // UUID
  role_id: number;
  permission_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface Role {
  id?: number;
  name: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  role_permissions?: RolePermission[];
}

export interface Profile {
  id?: number;
  user_id?: number;
  phone?: string | null;
  photo?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Address {
  id?: number;
  user_id?: number;
  street: string;
  number: string;
  latitude?: number | null;
  longitude?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface DigitalSignature {
  id?: number;
  user_id?: number;
  photo?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Password {
  id?: number;
  user_id: number;
  content: string;
  startAt: string; // ISO
  endAt?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Session {
  id?: string; // UUID
  user_id: number;
  token: string;
  expiration: string; // ISO
  FACode?: string | null;
  state: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserRole {
  id?: string; // UUID
  user_id: number;
  role_id: number;
  startAt: string; // ISO
  endAt?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
  profile?: Profile | null;
  address?: Address | null;
  digital_signature?: DigitalSignature | null;
  passwords?: Password[];
  sessions?: Session[];
  user_roles?: UserRole[];
  roles?: Role[]; // optional if sending nested roles
  permissions?: Permission[]; // optional if sending nested permissions
  role_permissions?: RolePermission[]; // optional
}
```

---

## 6) Recomendaciones para integración
- Si tu API no admite creación anidada, crea `roles` y `permissions` primero y luego asigna `user_roles` y `role_permissions` usando sus ids.
- Usa transacciones en el backend para evitar registros huérfanos si la creación falla a mitad.
- En el frontend, crea scripts (o un endpoint `seed`) que ejecute estas peticiones en el orden correcto.

---

## 7) Script de ejemplo (secuencia) para poblar la DB desde Postman / PowerShell (secuencial)

```powershell
# 1) Crear roles
Invoke-RestMethod -Method Post -Uri http://localhost:5000/roles -Body (@{name='admin';description='Administrator role'} | ConvertTo-Json) -ContentType 'application/json'

# 2) Crear permissions (repetir para cada permiso)
Invoke-RestMethod -Method Post -Uri http://localhost:5000/permissions -Body (@{url='/api/users';method='GET';entity='user'} | ConvertTo-Json) -ContentType 'application/json'

# 3) Crear user completo (asegúrate que roles/permissions están creados si no se soporta anidado)
Invoke-RestMethod -Method Post -Uri http://localhost:5000/users -Body (Get-Content .\admin_user.json -Raw) -ContentType 'application/json'
```

---

Si quieres, puedo:
- Añadir estos archivos JSON en `docs/json/` para que puedas importarlos en Postman directamente.
- Implementar endpoints `seed` en Flask para ejecutar estas inserciones automáticamente.
- Crear un pequeño componente React que ejecute el seeding desde el frontend (solo para desarrollo).

¿Quieres que agregue los JSON individuales al directorio `docs/json/` y/o que implemente un endpoint `/seed` en Flask para poblar la base de datos automáticamente?''