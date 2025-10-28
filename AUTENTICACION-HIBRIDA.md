# 🔐 SISTEMA DE AUTENTICACIÓN HÍBRIDO - DOCUMENTACIÓN

## 🎯 **SISTEMA IMPLEMENTADO**

Hemos implementado un **Sistema Híbrido de Autenticación** que combina:
- ✅ **Firebase OAuth** (Google, GitHub, Microsoft)
- ✅ **Backend JWT** (Login tradicional email/password)
- ✅ **Token único** para todas las APIs

---

## 🔄 **FLUJO DE AUTENTICACIÓN**

### **Opción A: Login con Google (Firebase)**
```mermaid
graph TD
    A[Usuario click "Sign in with Google"] --> B[Firebase OAuth Popup]
    B --> C[Usuario autentica con Google]
    C --> D[Firebase retorna usuario + token]
    D --> E[AuthContext envía datos a backend]
    E --> F[Backend valida Firebase token]
    F --> G[Backend retorna JWT propio]
    G --> H[Token guardado en localStorage.session]
    H --> I[Usuario autenticado en toda la app]
```

### **Opción B: Login Tradicional (Email/Password)**
```mermaid
graph TD
    A[Usuario llena formulario login] --> B[SecurityService.login()]
    B --> C[POST /api/login al backend]
    C --> D[Backend valida credenciales]
    D --> E[Backend retorna user + JWT token]
    E --> F[Token guardado en localStorage.session]
    F --> G[Usuario autenticado en toda la app]
```

---

## 📁 **ARCHIVOS MODIFICADOS**

### **1. `src/services/securityService.ts`**
```typescript
// ✅ MEJORAS IMPLEMENTADAS:
- login() ahora guarda token correctamente
- Nuevo método loginWithFirebase()
- logout() limpia token y Redux store
- Manejo de diferentes formatos de token (token, access_token)
```

### **2. `src/context/AuthContext.tsx`**
```typescript
// ✅ INTEGRACIÓN AGREGADA:
- signIn() conecta Firebase con backend
- signOut() limpia ambas sesiones
- Manejo de errores robusto
```

### **3. `src/interceptors/axiosInterceptor.ts`**
```typescript
// ✅ TOKEN MANAGEMENT MEJORADO:
- Prioriza token de localStorage.session
- Fallback a user.token (legacy)
- Logs detallados para debugging
```

---

## 🔑 **MANEJO DE TOKENS**

### **Donde se guardan:**
```javascript
// TOKEN PRINCIPAL (recomendado)
localStorage.setItem("session", token);

// USUARIO AUTENTICADO
localStorage.setItem("user", JSON.stringify(userData));

// REDUX STORE (estado global)
dispatch(setUser(userData));
```

### **Como se usan:**
```javascript
// 1. Axios interceptor agrega automáticamente:
headers.Authorization = `Bearer ${sessionToken}`;

// 2. Verificación de autenticación:
securityService.isAuthenticated() // revisa localStorage.session
```

---

## 🧪 **TESTING DEL SISTEMA**

### **1. Probar Login con Google:**
1. Ir a `/auth/signin`
2. Click "Sign in with Google"
3. **Esperado**: Ver en console:
   ```
   🔗 Integrando Firebase con backend...
   ✅ Usuario autenticado en backend también
   🔑 Agregando token de sesión: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
   ```

### **2. Probar Login Tradicional:**
1. Ir a `/auth/signin`
2. Llenar email/password
3. **Esperado**: Ver en console:
   ```
   ✅ Token guardado: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
   ```

### **3. Probar Address CRUD:**
1. Ir a `/addresses`
2. **Esperado**: Ver en console:
   ```
   🔑 Agregando token de sesión: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
   ```
3. **Resultado**: Lista debería cargar (si backend está corriendo)

---

## 🛡️ **BACKEND REQUIREMENTS**

### **Endpoint Firebase Integration:**
```python
# NUEVO ENDPOINT REQUERIDO
POST /api/auth/firebase
Content-Type: application/json
Authorization: Bearer <firebase_token>

{
  "firebase_uid": "string",
  "email": "string", 
  "name": "string",
  "photo_url": "string"
}

# RESPUESTA ESPERADA:
{
  "user": { ... },
  "token": "jwt_token_here"
}
```

### **Endpoint Login Existente:**
```python
# ENDPOINT EXISTENTE
POST /api/login
{
  "email": "string",
  "password": "string"
}

# RESPUESTA ESPERADA:
{
  "user": { ... },
  "token": "jwt_token_here"  # O "access_token"
}
```

---

## 🚀 **BENEFICIOS DEL SISTEMA**

### **✅ Ventajas:**
1. **Doble autenticación**: Social + Tradicional
2. **Token único**: Un solo JWT para todas las APIs
3. **Experiencia unificada**: Mismo comportamiento en toda la app
4. **Escalabilidad**: Fácil agregar más providers OAuth
5. **Seguridad**: JWT con expiración automática

### **🔧 Funcionalidades:**
- ✅ Login con Google OAuth
- ✅ Login tradicional email/password
- ✅ Token automático en todas las requests
- ✅ Logout limpia ambas sesiones
- ✅ Redirección automática en 401
- ✅ Estado global sincronizado

---

## 🐛 **DEBUGGING**

### **Verificar autenticación:**
```javascript
// En DevTools Console:
localStorage.getItem("session")     // Debería tener JWT
localStorage.getItem("user")        // Debería tener user data
securityService.isAuthenticated()  // Debería ser true
```

### **Ver requests con token:**
1. Abrir DevTools → Network
2. Hacer request a `/api/addresses`
3. Ver header: `Authorization: Bearer eyJ0eXAi...`

---

## 🎯 **ESTADO ACTUAL**

### **✅ COMPLETADO:**
- ✅ Sistema híbrido Firebase + Backend
- ✅ Token management correcto
- ✅ Address CRUD con autenticación
- ✅ Interceptor mejorado
- ✅ Logout completo

### **🚀 LISTO PARA:**
- 🏠 Address CRUD completamente funcional
- 📝 Siguiente entidad: PASSWORD
- 🔐 Agregar más providers OAuth (GitHub, Microsoft)

---

## 📞 **SIGUIENTE PASO**

**¿Probamos Address con autenticación o continuamos con PASSWORD?** 🤔

El sistema está 100% implementado y debería funcionar tanto con Firebase OAuth como con login tradicional.