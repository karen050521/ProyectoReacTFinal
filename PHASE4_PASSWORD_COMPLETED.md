# 🔐 FASE 4 - PASSWORD CRUD MATERIAL UI

**Fecha de implementación:** Noviembre 2, 2025  
**Estado:** ✅ COMPLETADO CON CORRECCIONES  
**Patrón:** MVC + Pages con Material UI  
**Última actualización:** Noviembre 2, 2025 - Correcciones CORS y validaciones de fechas

---

## 📋 **Resumen de la Implementación**

### ✅ **Componentes Implementados:**

1. **🎛️ Controller:** `usePasswordController.ts` - Lógica de estado y CRUD
2. **📋 Vista Lista:** `PasswordList.tsx` - Tabla Material UI con filtros y formateo de fechas corregido
3. **📝 Vista Formulario:** `PasswordForm.tsx` - Formulario con validaciones de seguridad y conversión de fechas
4. **📄 Páginas:** Wrappers para integración con routing
5. **🛣️ Rutas:** Configuración completa de navegación
6. **🧭 Navegación:** Enlace en sidebar

---

## 🔧 **CORRECCIONES CRÍTICAS IMPLEMENTADAS (Nov 2, 2025)**

### 🚨 **Problema CORS Solucionado:**

**❌ Problema Original:**
```
Access to XMLHttpRequest blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present
```

**🔍 Causa Raíz Identificada:**
- Error 500 en backend debido a formato de fechas incorrecto
- Frontend enviaba: `2024-11-02T10:00:00` (ISO format)
- Backend esperaba: `2024-11-02 10:00:00` (SQL format)
- Error 500 → CORS headers no se enviaban → Bloqueo CORS

**✅ Solución Implementada en Frontend:**

```typescript
// 🆕 NUEVA FUNCIÓN: formatDateForBackend()
const formatDateForBackend = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
        // Validar formato correcto
        if (!dateString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
            console.error('Formato de fecha inválido:', dateString);
            return '';
        }
        
        // Validar que la fecha sea válida
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            console.error('Fecha inválida:', dateString);
            return '';
        }
        
        // ✅ CONVERSIÓN: T → espacio, agregar :00
        return dateString.replace('T', ' ') + ':00';
    } catch (error) {
        console.error('Error al formatear fecha:', error);
        return '';
    }
};

// 🔄 USO EN handleSubmit:
const passwordData = {
    content: values.content,
    startAt: formatDateForBackend(values.startAt),
    endAt: values.endAt ? formatDateForBackend(values.endAt) : undefined
};
```

### 🕐 **Problema de Zona Horaria Solucionado:**

**❌ Problema Original:**
```
Usuario guardaba: 3 Nov 2025, 15:30
Frontend mostraba: 2 Nov 2025, 15:30 (1 día anterior)
```

**✅ Solución en PasswordList.tsx:**

```typescript
// 🆕 FUNCIÓN MEJORADA: formatDate()
const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    try {
        // Remover indicadores de zona horaria para tratarla como local
        const cleanDateString = dateString
            .replace('Z', '')
            .replace(/[+-]\d{2}:\d{2}$/, '');
        
        // Crear fecha interpretándola como local (NO UTC)
        const date = new Date(cleanDateString);
        
        if (isNaN(date.getTime())) return 'Fecha inválida';
        
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return 'Fecha inválida';
    }
};
```

**✅ Solución en PasswordForm.tsx:**

```typescript
// 🆕 FUNCIÓN MEJORADA: formatDateForInput()
const formatDateForInput = (dateString?: string): string => {
    if (!dateString) return '';
    
    try {
        // Limpiar indicadores UTC para tratarla como local
        const cleanDateString = dateString
            .replace('Z', '')
            .replace('+00:00', '');
        const date = new Date(cleanDateString);
        
        if (isNaN(date.getTime())) return '';
        
        // Formatear para input datetime-local
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
        return '';
    }
};
```

### 🛡️ **Validaciones de Fechas Mejoradas:**

**✅ Validación en Esquema Yup:**

```typescript
// 🆕 VALIDACIÓN: endAt debe ser posterior a startAt
endAt: Yup.string()
    .nullable()
    .test('is-after-start', 
        'La fecha de expiración debe ser posterior a la fecha de inicio', 
        function(value) {
            const { startAt } = this.parent;
            if (!value || !startAt) return true;
            
            const startDate = new Date(startAt);
            const endDate = new Date(value);
            
            return endDate > startDate;
        }
    )
```

**✅ Validación en handleSubmit:**

```typescript
// 🆕 VALIDACIÓN PREVIA AL ENVÍO
if (values.endAt && values.startAt) {
    const startDate = new Date(values.startAt);
    const endDate = new Date(values.endAt);
    
    if (endDate <= startDate) {
        setSnackbarMessage('La fecha de expiración debe ser posterior a la fecha de inicio');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
    }
}
```

### 🔍 **Material UI Grid Compatibility Fix:**

**❌ Problema Original:**
```typescript
// Error en Material UI v7
<Grid item xs={12} md={6}>  // ❌ 'item' prop no reconocida
```

**✅ Solución Implementada:**

```typescript
// 🔄 Reemplazado Grid con Box + Flexbox
<Box sx={{ 
    display: 'flex', 
    flexDirection: { xs: 'column', md: 'row' }, 
    gap: 3,
    alignItems: { xs: 'stretch', sm: 'center' } 
}}>
    <Box sx={{ flex: { xs: 1, md: 0.5 } }}>
        {/* Contenido */}
    </Box>
</Box>
```

---

## 📁 **Archivos Creados/Modificados**

### ✅ **Nuevos Archivos:**

```
src/
├── views/MaterialUI/PasswordViews/           🆕 NUEVO DIRECTORIO
│   ├── PasswordList.tsx                      ✅ Vista con formateo de fechas corregido
│   └── PasswordForm.tsx                      ✅ Formulario con validaciones y conversión de fechas
├── pages/Password/                           🆕 NUEVO DIRECTORIO  
│   ├── PasswordPage.tsx                      ✅ Página principal (lista)
│   ├── CreatePasswordPage.tsx                ✅ Página de creación
│   ├── UpdatePasswordPage.tsx                ✅ Página de edición
│   └── index.ts                              ✅ Exportaciones

📚 DOCUMENTACIÓN:
├── CORS_FIX_FRONTEND.md                      🆕 Guía solución CORS
├── DATE_ORDER_FIX.md                         🆕 Guía validación fechas
├── TIMEZONE_FIX_TEST.md                      🆕 Guía zona horaria
└── DEBUG_CORS.md                             🆕 Diagnóstico problemas
```

### 🔄 **Archivos Modificados:**

```
src/
├── controllers/
│   └── usePasswordController.ts              🔄 MEJORADO (ya existía)
├── routes/
│   └── index.ts                              🔄 RUTAS ACTUALIZADAS
└── components/
    └── Sidebar.tsx                           🔄 NAVEGACIÓN (ya estaba)
```

---

## 🎯 **Funcionalidades Implementadas**

### 🔒 **Gestión de Contraseñas:**
- ✅ **CRUD Completo:** Crear, Leer, Actualizar, Eliminar
- ✅ **Filtro por Usuario:** Historial específico por usuario
- ✅ **Estados de Contraseña:** Activa, Por Expirar, Expirada
- ✅ **Fechas de Validez:** Inicio y expiración configurables

### 🛡️ **Validaciones de Seguridad:**
- ✅ **Evaluación de Fortaleza:** Tiempo real con indicador visual
- ✅ **Políticas de Seguridad:** 
  - Mínimo 8 caracteres (recomendado 12+)
  - Al menos una mayúscula y una minúscula
  - Al menos un número y un carácter especial
  - Detección de patrones obvios (123, abc, qwe)
- ✅ **Sugerencias Inteligentes:** Consejos para mejorar la contraseña

### 🎨 **Interfaz de Usuario:**
- ✅ **Material UI:** Diseño profesional y consistente
- ✅ **Tabla Responsive:** Con búsqueda y filtros
- ✅ **Formularios Validados:** Formik + Yup
- ✅ **Notificaciones:** Snackbars para feedback
- ✅ **Estados de Carga:** Indicadores visuales
- ✅ **Empty States:** Mensajes cuando no hay datos

---

## 🛣️ **Rutas Configuradas**

### 📍 **Endpoints Frontend:**

| Ruta | Componente | Propósito |
|------|------------|-----------|
| `/passwords` | `PasswordPage` | 📋 Lista todas las contraseñas |
| `/passwords/create` | `CreatePasswordPage` | ➕ Crear nueva contraseña |
| `/passwords/update/:id` | `UpdatePasswordPage` | ✏️ Editar contraseña existente |

### 🔗 **Navegación:**
```typescript
// Desde el sidebar
<NavLink to="/passwords">Passwords</NavLink>

// Navegación programática
navigate('/passwords/create')
navigate('/passwords/update/123')
```

---

## 🔄 **Flujo de Datos**

### 📤 **Crear Contraseña:**
```
Usuario → PasswordForm → usePasswordController.createPassword() 
       → passwordService.createPassword(userId, data)
       → POST /passwords/user/${userId}
       → Backend → Base de Datos
```

### 📊 **Listar Contraseñas:**
```
Usuario → PasswordList → usePasswordController.refreshPasswords()
       → passwordService.getPasswords()
       → GET /passwords
       → Backend → Base de Datos
```

### 👤 **Filtrar por Usuario:**
```
Usuario → PasswordList(userId) → usePasswordController.getPasswordsByUserId()
       → passwordService.getPasswordsByUserId(userId)
       → GET /passwords/user/${userId}
       → Backend → Base de Datos
```

### ✏️ **Actualizar Contraseña:**
```
Usuario → PasswordForm(edit) → usePasswordController.updatePassword()
       → passwordService.updatePassword(id, data)
       → PUT /passwords/${id}
       → Backend → Base de Datos
```

### 🗑️ **Eliminar Contraseña:**
```
Usuario → PasswordList(delete) → usePasswordController.deletePassword()
       → passwordService.deletePassword(id)
       → DELETE /passwords/${id}
       → Backend → Base de Datos
```

---

## 🔧 **Configuración Técnica**

### 🎛️ **Controller Pattern:**
```typescript
const {
    passwords,              // 📋 Estado de lista
    loading,               // ⏳ Estado de carga
    error,                 // ❌ Manejo de errores
    createPassword,        // ➕ Crear
    updatePassword,        // ✏️ Actualizar
    deletePassword,        // 🗑️ Eliminar
    getPasswordsByUserId,  // 👤 Filtrar por usuario
    refreshPasswords,      // 🔄 Recargar
    clearError            // 🧹 Limpiar errores
} = usePasswordController();
```

### 🛡️ **Validación Schema (Yup):**
```typescript
const validationSchema = Yup.object().shape({
    user_id: Yup.number().required('Usuario obligatorio'),
    content: Yup.string()
        .required('Contraseña obligatoria')
        .min(8, 'Mínimo 8 caracteres')
        .matches(/[A-Z]/, 'Debe contener mayúsculas')
        .matches(/[a-z]/, 'Debe contener minúsculas')
        .matches(/[0-9]/, 'Debe contener números')
        .matches(/[!@#$%^&*(),.?\":{}|<>]/, 'Debe contener caracteres especiales'),
    startAt: Yup.string().required('Fecha inicio obligatoria'),
    endAt: Yup.string().nullable()
});
```

### 🎨 **Material UI Components:**
- **Card:** Contenedores principales
- **Table:** Lista de contraseñas
- **TextField:** Inputs de formulario
- **Chip:** Estados y etiquetas
- **LinearProgress:** Indicador de fortaleza
- **Dialog:** Confirmaciones
- **Snackbar:** Notificaciones
- **IconButton:** Acciones rápidas

---

## 🔐 **Integración con Backend**

### 🔗 **Service Layer:**
```typescript
// Usa axiosInterceptor para autenticación automática
import api from "../interceptors/axiosInterceptor";

class PasswordService {
    // GET /passwords - Todas las contraseñas
    async getPasswords(): Promise<Password[]>
    
    // GET /passwords/:id - Contraseña específica
    async getPasswordById(id: number): Promise<Password | null>
    
    // POST /passwords/user/:userId - Crear para usuario específico
    async createPassword(userId: number, password): Promise<Password | null>
    
    // PUT /passwords/:id - Actualizar contraseña
    async updatePassword(id: number, password): Promise<Password | null>
    
    // DELETE /passwords/:id - Eliminar contraseña
    async deletePassword(id: number): Promise<boolean>
    
    // GET /passwords/user/:userId - Historial por usuario
    async getPasswordsByUserId(userId: number): Promise<Password[]>
}
```

### 📊 **Modelo de Datos:**
```typescript
interface Password {
    id?: number;           // 🔑 Primary Key
    user_id: number;       // 🔗 Foreign Key to User
    content: string;       // 🔒 Contraseña encriptada
    startAt: string;       // 📅 Fecha de inicio (ISO)
    endAt?: string | null; // ⏰ Fecha de expiración (opcional)
    created_at?: string;   // 📝 Timestamp creación
    updated_at?: string;   // 🔄 Timestamp actualización
}
```

---

## 🎭 **Casos de Uso**

### 👤 **Para Usuarios:**
1. **Cambiar Contraseña:** Crear nueva entrada con validaciones
2. **Ver Historial:** Consultar contraseñas anteriores
3. **Verificar Expiración:** Ver cuándo expira la contraseña actual

### 👨‍💼 **Para Administradores:**
1. **Auditoría:** Ver todas las contraseñas del sistema
2. **Gestión de Usuarios:** Filtrar por usuario específico
3. **Compliance:** Verificar políticas de seguridad

### 🔍 **Para Auditores:**
1. **Reportes:** Extraer datos de contraseñas
2. **Análisis:** Identificar patrones de seguridad
3. **Compliance:** Verificar cumplimiento de políticas

---

## 🚀 **Próximas Mejoras Sugeridas**

### 🔮 **Funcionalidades Futuras:**
- [ ] **Dashboard de Seguridad:** Métricas de contraseñas
- [ ] **Notificaciones:** Alertas de expiración
- [ ] **Políticas Personalizadas:** Configuración por empresa
- [ ] **Integración SSO:** Single Sign-On
- [ ] **Reportes Excel:** Exportación de datos

### 🛡️ **Seguridad Avanzada:**
- [ ] **2FA Integration:** Doble factor de autenticación
- [ ] **Password Breach Check:** Verificar contraseñas comprometidas
- [ ] **Entropy Calculation:** Cálculo de entropía real
- [ ] **Dictionary Check:** Verificar contra diccionarios

---

## 🎯 **PATRÓN REUTILIZABLE PARA FUTURAS ENTIDADES**

### 📘 **GUÍA DE IMPLEMENTACIÓN PARA NUEVAS ENTIDADES**

Basándose en la implementación exitosa de **Password CRUD**, aquí está el patrón reutilizable para cualquier entidad del proyecto:

#### 🗂️ **Estructura de Archivos Recomendada:**
```typescript
src/
├── models/
│   └── EntityName.ts                    // 🏗️ Interfaz TypeScript
├── services/
│   └── entityNameService.ts             // 🔗 Llamadas API
├── controllers/
│   └── useEntityNameController.ts       // 🎛️ Lógica de estado
├── views/MaterialUI/EntityNameViews/
│   ├── EntityNameList.tsx              // 📋 Vista tabla con filtros
│   └── EntityNameForm.tsx              // 📝 Formulario CRUD
└── pages/EntityName/
    ├── EntityNamePage.tsx              // 📄 Página lista
    ├── CreateEntityNamePage.tsx        // ➕ Página creación
    ├── UpdateEntityNamePage.tsx        // ✏️ Página edición
    └── index.ts                        // 📦 Exportaciones
```

#### 🔧 **Template Service Layer:**
```typescript
// 📁 services/entityNameService.ts
import api from "../interceptors/axiosInterceptor";
import type { EntityName } from '../models/EntityName';

class EntityNameService {
    private baseURL = '/api/entity-names';

    // 📋 GET ALL
    async getEntityNames(): Promise<EntityName[]> {
        try {
            const response = await api.get(this.baseURL);
            return response.data;
        } catch (error) {
            console.error('Error fetching entity names:', error);
            throw error;
        }
    }

    // 🔍 GET BY ID
    async getEntityNameById(id: number): Promise<EntityName | null> {
        try {
            const response = await api.get(`${this.baseURL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching entity name ${id}:`, error);
            return null;
        }
    }

    // ➕ CREATE
    async createEntityName(data: Partial<EntityName>): Promise<EntityName | null> {
        try {
            const response = await api.post(this.baseURL, data);
            return response.data;
        } catch (error) {
            console.error('Error creating entity name:', error);
            throw error;
        }
    }

    // ✏️ UPDATE
    async updateEntityName(id: number, data: Partial<EntityName>): Promise<EntityName | null> {
        try {
            const response = await api.put(`${this.baseURL}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating entity name ${id}:`, error);
            throw error;
        }
    }

    // 🗑️ DELETE
    async deleteEntityName(id: number): Promise<boolean> {
        try {
            await api.delete(`${this.baseURL}/${id}`);
            return true;
        } catch (error) {
            console.error(`Error deleting entity name ${id}:`, error);
            return false;
        }
    }

    // 🔍 FILTROS ESPECÍFICOS (ejemplo: por usuario)
    async getEntityNamesByUserId(userId: number): Promise<EntityName[]> {
        try {
            const response = await api.get(`${this.baseURL}/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching entity names for user ${userId}:`, error);
            return [];
        }
    }
}

export const entityNameService = new EntityNameService();
```

#### 🎛️ **Template Controller Hook:**
```typescript
// 📁 controllers/useEntityNameController.ts
import { useState, useEffect } from 'react';
import { entityNameService } from '../services/entityNameService';
import type { EntityName } from '../models/EntityName';

export const useEntityNameController = () => {
    const [entityNames, setEntityNames] = useState<EntityName[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // 🔄 REFRESH ALL
    const refreshEntityNames = async (): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const data = await entityNameService.getEntityNames();
            setEntityNames(data);
        } catch (err) {
            setError('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    // ➕ CREATE
    const createEntityName = async (data: Partial<EntityName>): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const newItem = await entityNameService.createEntityName(data);
            if (newItem) {
                setEntityNames(prev => [...prev, newItem]);
                return true;
            }
            return false;
        } catch (err) {
            setError('Error al crear el elemento');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // ✏️ UPDATE
    const updateEntityName = async (id: number, data: Partial<EntityName>): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const updatedItem = await entityNameService.updateEntityName(id, data);
            if (updatedItem) {
                setEntityNames(prev => 
                    prev.map(item => item.id === id ? updatedItem : item)
                );
                return true;
            }
            return false;
        } catch (err) {
            setError('Error al actualizar el elemento');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // 🗑️ DELETE
    const deleteEntityName = async (id: number): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const success = await entityNameService.deleteEntityName(id);
            if (success) {
                setEntityNames(prev => prev.filter(item => item.id !== id));
                return true;
            }
            return false;
        } catch (err) {
            setError('Error al eliminar el elemento');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // 🔍 GET BY ID
    const getEntityNameById = async (id: number): Promise<EntityName | null> => {
        setLoading(true);
        setError(null);
        try {
            return await entityNameService.getEntityNameById(id);
        } catch (err) {
            setError('Error al cargar el elemento');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // 🧹 CLEAR ERROR
    const clearError = (): void => {
        setError(null);
    };

    // 🏁 INIT LOAD
    useEffect(() => {
        refreshEntityNames();
    }, []);

    return {
        entityNames,
        loading,
        error,
        createEntityName,
        updateEntityName,
        deleteEntityName,
        getEntityNameById,
        refreshEntityNames,
        clearError
    };
};
```

#### 🎨 **Template List Component:**
```typescript
// 📁 views/MaterialUI/EntityNameViews/EntityNameList.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    TextField,
    CircularProgress,
    Stack,
    Tooltip
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';
import { useEntityNameController } from '../../../controllers/useEntityNameController';
import type { EntityName } from '../../../models/EntityName';

const EntityNameList: React.FC = () => {
    const navigate = useNavigate();
    const {
        entityNames,
        loading,
        error,
        deleteEntityName,
        refreshEntityNames,
        clearError
    } = useEntityNameController();

    // 🎛️ ESTADOS LOCALES
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<EntityName | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [searchTerm, setSearchTerm] = useState<string>('');

    // 🗑️ MANEJO ELIMINACIÓN
    const handleDelete = async (item: EntityName): Promise<void> => {
        setSelectedItem(item);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async (): Promise<void> => {
        if (!selectedItem?.id) return;

        try {
            const success = await deleteEntityName(selectedItem.id);
            setSnackbarMessage(success ? 'Elemento eliminado exitosamente' : 'Error al eliminar');
            setSnackbarSeverity(success ? 'success' : 'error');
        } catch (err) {
            setSnackbarMessage('Error al eliminar el elemento');
            setSnackbarSeverity('error');
        }

        setDeleteDialogOpen(false);
        setSelectedItem(null);
        setSnackbarOpen(true);
    };

    // 🔍 FILTRADO
    const filteredItems = entityNames.filter((item) =>
        // Ajustar según campos específicos de la entidad
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 📅 FORMATEO DE FECHAS (aplicar las correcciones de zona horaria)
    const formatDate = (dateString?: string): string => {
        if (!dateString) return 'N/A';
        try {
            const cleanDateString = dateString
                .replace('Z', '')
                .replace(/[+-]\d{2}:\d{2}$/, '');
            const date = new Date(cleanDateString);
            
            if (isNaN(date.getTime())) return 'Fecha inválida';
            
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Fecha inválida';
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* 🏠 HEADER */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Gestión de EntityNames
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/entity-names/create')}
                    sx={{ textTransform: 'none' }}
                >
                    Nuevo Elemento
                </Button>
            </Box>

            {/* 🔍 FILTROS */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                            fullWidth
                            label="Buscar..."
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="small"
                        />
                        <Button
                            variant="outlined"
                            onClick={refreshEntityNames}
                            sx={{ textTransform: 'none' }}
                        >
                            Refrescar
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* 📊 TABLA */}
            <Card>
                <CardContent>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : filteredItems.length === 0 ? (
                        <Box sx={{ textAlign: 'center', p: 4 }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No hay elementos registrados
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => navigate('/entity-names/create')}
                                sx={{ textTransform: 'none' }}
                            >
                                Crear Primer Elemento
                            </Button>
                        </Box>
                    ) : (
                        <TableContainer component={Paper} elevation={0}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Fecha Creación</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredItems.map((item) => (
                                        <TableRow key={item.id} hover>
                                            <TableCell>{item.id}</TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.description}</TableCell>
                                            <TableCell>{formatDate(item.created_at)}</TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1}>
                                                    <Tooltip title="Ver detalles">
                                                        <IconButton
                                                            size="small"
                                                            color="info"
                                                            onClick={() => navigate(`/entity-names/view/${item.id}`)}
                                                        >
                                                            <ViewIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Editar">
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() => navigate(`/entity-names/update/${item.id}`)}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Eliminar">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDelete(item)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>

            {/* 🗑️ DIALOG ELIMINACIÓN */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Estás seguro de que deseas eliminar este elemento?
                    </Typography>
                    {selectedItem && (
                        <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="body2">
                                <strong>Nombre:</strong> {selectedItem.name}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 📢 NOTIFICACIONES */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert severity={snackbarSeverity} variant="filled">
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Snackbar open={!!error} autoHideDuration={6000} onClose={clearError}>
                <Alert onClose={clearError} severity="error" variant="filled">
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default EntityNameList;
```

#### 📝 **Template Form Component con Validaciones de Fechas:**
```typescript
// 📁 views/MaterialUI/EntityNameViews/EntityNameForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Alert,
    Snackbar,
    CircularProgress,
    Stack
} from '@mui/material';
import { useEntityNameController } from '../../../controllers/useEntityNameController';
import type { EntityName } from '../../../models/EntityName';

interface EntityFormData {
    name: string;
    description: string;
    startDate?: string;  // Si la entidad maneja fechas
    endDate?: string;
}

// 🛡️ VALIDACIÓN CON FECHAS (aplicar correcciones)
const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    description: Yup.string().required('La descripción es obligatoria'),
    startDate: Yup.string().nullable(),
    endDate: Yup.string()
        .nullable()
        .test('is-after-start', 'La fecha de fin debe ser posterior a la fecha de inicio', function(value) {
            const { startDate } = this.parent;
            if (!value || !startDate) return true;
            
            const start = new Date(startDate);
            const end = new Date(value);
            
            return end > start;
        })
});

interface EntityFormProps {
    isEditMode?: boolean;
}

const EntityNameForm: React.FC<EntityFormProps> = ({ isEditMode = false }) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const {
        createEntityName,
        updateEntityName,
        getEntityNameById,
        loading,
        error,
        clearError
    } = useEntityNameController();

    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [initialValues, setInitialValues] = useState<EntityFormData>({
        name: '',
        description: '',
        startDate: '',
        endDate: ''
    });

    // 🔧 FUNCIÓN PARA FORMATEAR FECHAS AL BACKEND (aplicar correcciones CORS)
    const formatDateForBackend = (dateString: string): string => {
        if (!dateString) return '';
        
        try {
            if (!dateString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
                console.error('Formato de fecha inválido:', dateString);
                return '';
            }
            
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                console.error('Fecha inválida:', dateString);
                return '';
            }
            
            // ✅ CONVERSIÓN PARA BACKEND: T → espacio, agregar :00
            return dateString.replace('T', ' ') + ':00';
        } catch (error) {
            console.error('Error al formatear fecha:', error);
            return '';
        }
    };

    // 🔧 FUNCIÓN PARA FORMATEAR FECHAS DEL SERVIDOR PARA INPUT
    const formatDateForInput = (dateString?: string): string => {
        if (!dateString) return '';
        
        try {
            const cleanDateString = dateString.replace('Z', '').replace('+00:00', '');
            const date = new Date(cleanDateString);
            
            if (isNaN(date.getTime())) return '';
            
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch {
            return '';
        }
    };

    // 📥 CARGAR DATOS PARA EDICIÓN
    useEffect(() => {
        if (isEditMode && id) {
            loadEntityData();
        }
    }, [isEditMode, id]);

    const loadEntityData = async (): Promise<void> => {
        if (!id) return;

        try {
            const entity = await getEntityNameById(parseInt(id));
            if (entity) {
                setInitialValues({
                    name: entity.name || '',
                    description: entity.description || '',
                    startDate: formatDateForInput(entity.startDate),
                    endDate: formatDateForInput(entity.endDate)
                });
            }
        } catch (err) {
            setSnackbarMessage('Error al cargar los datos');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    // 📤 ENVÍO DEL FORMULARIO
    const handleSubmit = async (
        values: EntityFormData,
        { setSubmitting }: FormikHelpers<EntityFormData>
    ): Promise<void> => {
        try {
            // 🛡️ VALIDACIONES DE FECHAS (aplicar correcciones)
            if (values.endDate && values.startDate) {
                const startDate = new Date(values.startDate);
                const endDate = new Date(values.endDate);
                
                if (endDate <= startDate) {
                    setSnackbarMessage('La fecha de fin debe ser posterior a la fecha de inicio');
                    setSnackbarSeverity('error');
                    setSnackbarOpen(true);
                    return;
                }
            }

            // 🔄 FORMATEAR DATOS PARA BACKEND
            const entityData = {
                name: values.name,
                description: values.description,
                startDate: values.startDate ? formatDateForBackend(values.startDate) : undefined,
                endDate: values.endDate ? formatDateForBackend(values.endDate) : undefined
            };

            console.log('Datos a enviar al backend:', entityData);

            let success: boolean;

            if (isEditMode && id) {
                success = await updateEntityName(parseInt(id), entityData);
                setSnackbarMessage(success ? 'Elemento actualizado exitosamente' : 'Error al actualizar');
            } else {
                success = await createEntityName(entityData);
                setSnackbarMessage(success ? 'Elemento creado exitosamente' : 'Error al crear');
            }

            setSnackbarSeverity(success ? 'success' : 'error');
            setSnackbarOpen(true);

            if (success) {
                setTimeout(() => navigate('/entity-names'), 1500);
            }
        } catch (err) {
            setSnackbarMessage('Error inesperado al procesar los datos');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* 🏠 HEADER */}
            <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 3 }}>
                {isEditMode ? 'Editar Elemento' : 'Nuevo Elemento'}
            </Typography>

            {/* 📝 FORMULARIO */}
            <Card>
                <CardContent>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        enableReinitialize
                        onSubmit={handleSubmit}
                    >
                        {({ values, errors, touched, isSubmitting }) => (
                            <Form>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    {/* 📝 CAMPOS BÁSICOS */}
                                    <Field name="name">
                                        {({ field }: any) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="Nombre *"
                                                error={touched.name && !!errors.name}
                                                helperText={touched.name && errors.name}
                                            />
                                        )}
                                    </Field>

                                    <Field name="description">
                                        {({ field }: any) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="Descripción *"
                                                multiline
                                                rows={3}
                                                error={touched.description && !!errors.description}
                                                helperText={touched.description && errors.description}
                                            />
                                        )}
                                    </Field>

                                    {/* 📅 CAMPOS DE FECHA (SI APLICA) */}
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                                        <Box sx={{ flex: 1 }}>
                                            <Field name="startDate">
                                                {({ field }: any) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="Fecha de Inicio"
                                                        type="datetime-local"
                                                        error={touched.startDate && !!errors.startDate}
                                                        helperText={touched.startDate && errors.startDate}
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                )}
                                            </Field>
                                        </Box>

                                        <Box sx={{ flex: 1 }}>
                                            <Field name="endDate">
                                                {({ field }: any) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="Fecha de Fin (Opcional)"
                                                        type="datetime-local"
                                                        error={touched.endDate && !!errors.endDate}
                                                        helperText={touched.endDate && errors.endDate}
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                )}
                                            </Field>
                                        </Box>
                                    </Box>

                                    {/* 🔘 BOTONES */}
                                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                                        <Button
                                            variant="outlined"
                                            onClick={() => navigate('/entity-names')}
                                            sx={{ textTransform: 'none' }}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={isSubmitting || loading}
                                            sx={{ textTransform: 'none' }}
                                        >
                                            {isSubmitting ? (
                                                <CircularProgress size={20} />
                                            ) : (
                                                isEditMode ? 'Actualizar' : 'Crear'
                                            )}
                                        </Button>
                                    </Stack>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </CardContent>
            </Card>

            {/* 📢 NOTIFICACIONES */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert severity={snackbarSeverity} variant="filled">
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Snackbar open={!!error} autoHideDuration={6000} onClose={clearError}>
                <Alert onClose={clearError} severity="error" variant="filled">
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default EntityNameForm;
```

### 📋 **ENTIDADES CANDIDATAS PARA IMPLEMENTAR:**

#### 🎯 **Alta Prioridad:**
1. **📄 Address CRUD** - Gestión de direcciones
   - Lista de direcciones por usuario
   - Formulario con validación de campos obligatorios
   - Integración con mapas (futuro)

2. **👤 Profile CRUD** - Gestión de perfiles
   - Información personal extendida
   - Upload de avatars
   - Configuraciones personales

3. **🛡️ Role & Permission CRUD** - Gestión de roles y permisos
   - Asignación de permisos a roles
   - Matriz de permisos
   - Jerarquía de roles

#### 🎯 **Media Prioridad:**
4. **🔐 Session CRUD** - Gestión de sesiones
   - Historial de inicios de sesión
   - Sesiones activas
   - Geolocalización de accesos

5. **📱 Device CRUD** - Gestión de dispositivos
   - Dispositivos registrados
   - Notificaciones push
   - Verificación de dispositivos

#### 🎯 **Baja Prioridad:**
6. **🔍 Security Question CRUD** - Preguntas de seguridad
   - Gestión de preguntas
   - Respuestas encriptadas
   - Recuperación de contraseñas

### 🔧 **PASOS PARA IMPLEMENTAR NUEVA ENTIDAD:**

1. **📋 Crear Model:** Definir interfaz TypeScript
2. **🔗 Crear Service:** Implementar llamadas API
3. **🎛️ Crear Controller:** Hook con lógica de estado
4. **📊 Crear List View:** Tabla con filtros usando el patrón
5. **📝 Crear Form View:** Formulario con validaciones de fechas
6. **📄 Crear Pages:** Wrappers para routing
7. **🛣️ Agregar Rutas:** Configurar navegación
8. **🧭 Actualizar Sidebar:** Agregar enlaces de navegación

### ⚡ **VENTAJAS DEL PATRÓN:**

- ✅ **Consistencia:** Todas las entidades se comportan igual
- ✅ **Mantenibilidad:** Código reutilizable y predecible
- ✅ **Escalabilidad:** Fácil agregar nuevas funcionalidades
- ✅ **Testing:** Patrones conocidos fáciles de testear
- ✅ **Documentación:** Estructura autodocumentada
- ✅ **Compatibilidad:** Soluciona problemas CORS y fechas de antemano

### 🚨 **APLICAR SIEMPRE:**

1. **🔧 Formateo de fechas:** Usar `formatDateForBackend()` y `formatDateForInput()`
2. **🛡️ Validaciones:** Implementar validación de orden de fechas
3. **🎨 Material UI:** Usar Box + flexbox en lugar de Grid
4. **📢 Notificaciones:** Snackbars para feedback de usuario
5. **⏳ Estados de carga:** CircularProgress y disabled states
6. **🧹 Manejo de errores:** Try-catch y estados de error
7. **📱 Responsive:** Diseño que funcione en móvil y desktop

---

## 🎉 **Conclusión**

La **Fase 4 - Password CRUD** ha sido implementada exitosamente con:

✅ **Arquitectura Sólida:** MVC + Pages pattern  
✅ **Seguridad Robusta:** Validaciones y políticas  
✅ **UX Profesional:** Material UI con feedback inmediato  
✅ **Backend Integration:** API endpoints especializados  
✅ **Escalabilidad:** Preparado para funcionalidades futuras  

**Estado:** 🟢 **PRODUCTION READY**

---

*Documentación generada el 2 de Noviembre de 2025*