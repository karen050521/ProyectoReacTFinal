# 🟡 SKELETON AMARILLO - Material UI + Google OAuth

## 📋 Entidades Implementadas (Color Amarillo)

### **Relaciones**
- **Address** (1:1 con User) - Dirección física del usuario
- **Password** (1:N User → Password) - Historial de contraseñas  
- **Role** (entidad independiente) - Roles del sistema
- **UserRole** (N:N User ↔ Role) - Asignación de roles con fechas

### **Stack Técnico**
- ✅ **UI**: Material UI (@mui/material)
- 🚧 **Auth**: Google OAuth via Firebase (pendiente config)
- ✅ **HTTP**: Axios con interceptors
- ✅ **Estado**: Redux Toolkit + userSlice
- ✅ **Arquitectura**: MVC + Pages

## 🚀 Configuración Inicial

### **1. Variables de Entorno**
Copiar `.env.example` a `.env` y completar:

```bash
cp .env.example .env
```

Configurar en `.env`:
```env
# API del backend ms_security
VITE_API_URL=http://localhost:5000

# Firebase (obtener de Firebase Console)
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_APP_ID=tu_app_id
```

### **2. Instalar Dependencias**
```bash
npm install
```

### **3. Ejecutar Desarrollo**
```bash
npm run dev
```

## 📁 Estructura del Skeleton

```
src/
├── models/              # ✅ TypeScript interfaces
│   ├── Address.ts
│   ├── Password.ts  
│   ├── Role.ts
│   └── UserRole.ts
├── services/            # ✅ HTTP calls con axios interceptor
│   ├── addressService.ts
│   ├── passwordService.ts
│   ├── roleService.ts
│   └── userRoleService.ts
├── controllers/         # ✅ Custom hooks (lógica de negocio)
│   ├── useAddressController.ts
│   └── usePasswordController.ts
├── views/
│   ├── Common/          # 🚧 Componentes genéricos (pendiente)
│   └── MaterialUI/      # ✅ Componentes MUI específicos
│       ├── AddressViews/
│       │   └── AddressList.tsx
│       ├── PasswordViews/
│       ├── RoleViews/
│       └── UserRoleViews/
├── context/             # ✅ Contexts
│   └── AuthContext.tsx  # Google OAuth (Firebase stub)
└── pages/               # 🚧 Páginas (pendiente crear)
```

## 🔧 Endpoints Backend (ms_security)

### **Address**
- `GET /api/addresses` - Listar todas
- `GET /api/addresses/{id}` - Obtener por ID
- `POST /api/addresses/user/{userId}` - Crear para usuario
- `PUT /api/addresses/{id}` - Actualizar
- `DELETE /api/addresses/{id}` - Eliminar
- `GET /api/addresses/user/{userId}` - Obtener por usuario

### **Password**  
- `GET /api/passwords` - Listar todas
- `GET /api/passwords/{id}` - Obtener por ID
- `POST /api/passwords/user/{userId}` - Crear para usuario
- `PUT /api/passwords/{id}` - Actualizar
- `DELETE /api/passwords/{id}` - Eliminar
- `GET /api/passwords/user/{userId}` - Historial por usuario

### **Role**
- `GET /api/roles` - Listar roles
- `POST /api/roles` - Crear rol
- `PUT /api/roles/{id}` - Actualizar rol
- `DELETE /api/roles/{id}` - Eliminar rol

### **UserRole**
- `GET /api/user-roles` - Listar asignaciones
- `POST /api/user-roles/user/{userId}/role/{roleId}` - Asignar rol
- `PUT /api/user-roles/{id}` - Actualizar fechas
- `DELETE /api/user-roles/{id}` - Quitar rol
- `GET /api/user-roles/user/{userId}` - Roles de usuario
- `GET /api/user-roles/role/{roleId}` - Usuarios del rol

## ✅ Completado en este Skeleton

- [x] Estructura de carpetas MVC+Pages
- [x] Services con axios interceptor
- [x] Controllers (hooks) para Address y Password
- [x] Modelos TypeScript existentes
- [x] Vista MUI para AddressList
- [x] AuthContext con stub Firebase
- [x] .env.example con variables necesarias
- [x] Material UI instalado y configurado

## 🚧 Pendiente por Iteración

### **Iteración 1 (siguiente)**
- [ ] Configurar Firebase con credenciales reales
- [ ] Crear páginas (AddressPage, PasswordPage, etc.)
- [ ] Controllers para Role y UserRole
- [ ] Formularios MUI para Address (create/edit)

### **Iteración 2**
- [ ] Views MUI para Password (lista, form)
- [ ] Views MUI para Role (lista, form)
- [ ] Views MUI para UserRole (asignación)

### **Iteración 3**
- [ ] Guards de autenticación
- [ ] Manejo de permisos por rol
- [ ] Tests unitarios
- [ ] Documentación API

## 🔑 Variables Requeridas del Usuario

**Para continuar, necesito que proporciones:**

1. **Firebase Config** (de Firebase Console):
   ```
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_APP_ID=
   ```

2. **Backend URL** (confirmar):
   ```
   VITE_API_URL=http://localhost:5000
   ```

3. **Decisiones de diseño**:
   - ¿Refresh token desde inicio o después?
   - ¿Quién puede gestionar roles? (solo admin o todos)
   - ¿Inputs numéricos para lat/lng o mapa desde inicio?

## 🚀 Próximo Paso

Confirma las variables de entorno y ejecuta:

```bash
npm run dev
```

El skeleton está listo para desarrollo de las iteraciones específicas.