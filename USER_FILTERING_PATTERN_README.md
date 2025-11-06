# 🔍 Patrón de Filtrado por Usuario - Guía de Implementación

Este README documenta el **patrón de filtrado por ID de usuario** implementado en el sistema de contraseñas (Password), que puede ser **adaptado y reutilizado** para cualquier otra entidad del proyecto como Address, Profile, Roles, Sessions, etc.

## 🎯 **¿Qué es este patrón?**

Es una implementación que permite **filtrar y mostrar datos específicos de un usuario** a través de:
- **URLs semánticas**: `/entidad/user/:userId`
- **Estrategia híbrida**: Backend específico + Frontend fallback
- **Componentes reutilizables**: Mismo componente, diferentes contextos
- **UX optimizada**: Navegación intuitiva y performance mejorada

---

## 📋 **Ejemplo Base: Sistema de Contraseñas (Password)**

> **⚠️ IMPORTANTE**: Este es un **ejemplo basado en Password**. Debes **adaptar los nombres, interfaces y lógica** según la entidad que implementes (Address, Profile, etc.).

### **🔧 Estructura de Implementación:**

```
src/
├── services/passwordService.ts          // 🔗 API calls específicos
├── controllers/usePasswordController.ts  // 🎛️ Lógica de estado
├── pages/Password/UserPasswordPage.tsx  // 📄 Página filtrada por usuario
├── views/MaterialUI/PasswordViews/
│   └── PasswordList.tsx                 // 📋 Lista adaptable con props
└── routes/index.ts                      // 🛣️ Configuración de rutas
```

---

## 🔧 **Paso 1: Service Layer - API Calls**

### **Archivo**: `src/services/passwordService.ts`

```typescript
// 📁 EJEMPLO: passwordService.ts
// 🔄 ADAPTAR: Cambiar "Password" por tu entidad (Address, Profile, etc.)

class PasswordService {
    private baseURL = '/api/passwords'; // 🔄 ADAPTAR: /api/addresses, /api/profiles, etc.

    // 🆕 MÉTODO ESPECÍFICO PARA FILTRADO POR USUARIO
    async getPasswordsByUserId(userId: number): Promise<Password[]> { // 🔄 ADAPTAR: Password[] → Address[], Profile[], etc.
        try {
            // 🎯 Endpoint específico del backend
            const response = await api.get<Password[]>(`${this.baseURL}/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error("❌ Error al obtener contraseñas del usuario:", error); // 🔄 ADAPTAR: mensaje específico
            
            // 🛡️ FALLBACK: Si falla backend, intentar filtrado frontend
            try {
                const allPasswords = await this.getPasswords(); // 🔄 ADAPTAR: getAddresses(), getProfiles(), etc.
                return allPasswords.filter(p => p.user_id === userId);
            } catch (fallbackError) {
                console.error("❌ Fallback también falló:", fallbackError);
                return [];
            }
        }
    }

    // 📋 Método general (ya existía)
    async getPasswords(): Promise<Password[]> { // 🔄 ADAPTAR: getAddresses(), getProfiles(), etc.
        try {
            const response = await api.get<Password[]>(this.baseURL);
            return response.data;
        } catch (error) {
            console.error('Error fetching passwords:', error); // 🔄 ADAPTAR: mensaje específico
            throw error;
        }
    }

    // 🔍 Método individual (si existe)
    async getPasswordById(id: number): Promise<Password | null> { // 🔄 ADAPTAR: Address, Profile, etc.
        try {
            const response = await api.get<Password>(`${this.baseURL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching password ${id}:`, error); // 🔄 ADAPTAR: mensaje específico
            return null;
        }
    }
}

// 📦 Exportar instancia
export const passwordService = new PasswordService(); // 🔄 ADAPTAR: addressService, profileService, etc.
```

**🔑 Puntos a Adaptar:**
- **Clase**: `PasswordService` → `AddressService`, `ProfileService`, etc.
- **Interfaces**: `Password[]` → `Address[]`, `Profile[]`, etc.
- **URLs**: `/api/passwords` → `/api/addresses`, `/api/profiles`, etc.
- **Métodos**: `getPasswords()` → `getAddresses()`, `getProfiles()`, etc.
- **Mensajes**: Textos específicos de la entidad

---

## 🎛️ **Paso 2: Controller Hook - Estado y Lógica**

### **Archivo**: `src/controllers/usePasswordController.ts`

```typescript
// 📁 EJEMPLO: usePasswordController.ts
// 🔄 ADAPTAR: Cambiar "Password" por tu entidad

import { useState, useEffect, useCallback } from 'react';
import { passwordService } from '../services/passwordService'; // 🔄 ADAPTAR: addressService, etc.
import type { Password } from '../models/Password'; // 🔄 ADAPTAR: Address, Profile, etc.

export const usePasswordController = () => { // 🔄 ADAPTAR: useAddressController, etc.
    const [passwords, setPasswords] = useState<Password[]>([]); // 🔄 ADAPTAR: addresses, profiles, etc.
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // 🆕 FUNCIÓN DE FILTRADO POR USUARIO
    const getPasswordsByUserId = useCallback(async (userId: number): Promise<void> => { // 🔄 ADAPTAR: getAddressesByUserId, etc.
        setLoading(true);
        setError(null);
        try {
            // 🔗 Llamada al servicio específico
            const userPasswords = await passwordService.getPasswordsByUserId(userId); // 🔄 ADAPTAR: addressService, etc.
            setPasswords(userPasswords); // 🔄 ADAPTAR: setAddresses, etc.
        } catch (err) {
            setError('Error al cargar contraseñas del usuario'); // 🔄 ADAPTAR: mensaje específico
        } finally {
            setLoading(false);
        }
    }, []);

    // 📋 Función general para todas las entidades
    const refreshPasswords = useCallback(async (): Promise<void> => { // 🔄 ADAPTAR: refreshAddresses, etc.
        setLoading(true);
        setError(null);
        try {
            const data = await passwordService.getPasswords(); // 🔄 ADAPTAR: addressService, etc.
            setPasswords(data); // 🔄 ADAPTAR: setAddresses, etc.
        } catch (err) {
            setError('Error al cargar contraseñas'); // 🔄 ADAPTAR: mensaje específico
        } finally {
            setLoading(false);
        }
    }, []);

    // 🔍 Función individual (si existe)
    const getPasswordById = useCallback(async (id: number): Promise<Password | null> => { // 🔄 ADAPTAR
        setLoading(true);
        setError(null);
        try {
            return await passwordService.getPasswordById(id); // 🔄 ADAPTAR: addressService, etc.
        } catch (err) {
            setError('Error al cargar la contraseña'); // 🔄 ADAPTAR: mensaje específico
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // 🧹 Limpiar errores
    const clearError = (): void => {
        setError(null);
    };

    // 🏁 Carga inicial (opcional)
    useEffect(() => {
        refreshPasswords(); // 🔄 ADAPTAR: refreshAddresses, etc.
    }, []);

    return {
        passwords,               // 🔄 ADAPTAR: addresses, profiles, etc.
        loading,
        error,
        getPasswordsByUserId,    // 🔄 ADAPTAR: getAddressesByUserId, etc.
        refreshPasswords,        // 🔄 ADAPTAR: refreshAddresses, etc.
        getPasswordById,         // 🔄 ADAPTAR: getAddressById, etc.
        clearError,
        // ... otras funciones CRUD existentes
    };
};
```

**🔑 Puntos a Adaptar:**
- **Hook name**: `usePasswordController` → `useAddressController`, etc.
- **State variables**: `passwords` → `addresses`, `profiles`, etc.
- **Functions**: `getPasswordsByUserId` → `getAddressesByUserId`, etc.
- **Service calls**: `passwordService` → `addressService`, etc.
- **Error messages**: Textos específicos de la entidad

---

## 📄 **Paso 3: Página Específica de Usuario**

### **Archivo**: `src/pages/Password/UserPasswordPage.tsx`

```typescript
// 📁 EJEMPLO: pages/Password/UserPasswordPage.tsx
// 🔄 ADAPTAR: Crear pages/Address/UserAddressPage.tsx, etc.

import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Alert, Typography } from '@mui/material';
import PasswordList from '../../views/MaterialUI/PasswordViews/PasswordList'; // 🔄 ADAPTAR: AddressList, etc.

const UserPasswordPage: React.FC = () => { // 🔄 ADAPTAR: UserAddressPage, UserProfilePage, etc.
    // 🔗 Extraer userId de la URL
    const { userId } = useParams<{ userId: string }>();
    
    // 🛡️ Validación de parámetro
    if (!userId || isNaN(Number(userId))) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    ID de usuario inválido. Por favor, verifique la URL.
                </Alert>
            </Box>
        );
    }

    const userIdNumber = parseInt(userId);

    return (
        <Box sx={{ p: 3 }}>
            {/* 🏠 Header específico */}
            <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 3 }}>
                Historial de Contraseñas - Usuario {userId} {/* 🔄 ADAPTAR: "Direcciones", "Perfiles", etc. */}
            </Typography>

            {/* 🎯 Pasar userId como prop al componente de lista */}
            <PasswordList  {/* 🔄 ADAPTAR: AddressList, ProfileList, etc. */}
                userId={userIdNumber}
                showUserColumn={false}  // No mostrar columna usuario (redundante)
                title={`Contraseñas del Usuario ${userId}`} {/* 🔄 ADAPTAR: título específico */}
            />
        </Box>
    );
};

export default UserPasswordPage; // 🔄 ADAPTAR: UserAddressPage, etc.
```

**🔑 Puntos a Adaptar:**
- **Component name**: `UserPasswordPage` → `UserAddressPage`, etc.
- **Import**: `PasswordList` → `AddressList`, `ProfileList`, etc.
- **Titles**: "Contraseñas" → "Direcciones", "Perfiles", etc.
- **File path**: Crear en directorio correspondiente

---

## 📋 **Paso 4: Componente Lista Adaptable**

### **Archivo**: `src/views/MaterialUI/PasswordViews/PasswordList.tsx`

```typescript
// 📁 EJEMPLO: views/MaterialUI/PasswordViews/PasswordList.tsx
// 🔄 ADAPTAR: Crear AddressViews/AddressList.tsx, etc.

import React, { useState, useEffect, useMemo } from 'react';
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
    TextField,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Add as AddIcon
} from '@mui/icons-material';
import { usePasswordController } from '../../../controllers/usePasswordController'; // 🔄 ADAPTAR: useAddressController, etc.
import type { Password } from '../../../models/Password'; // 🔄 ADAPTAR: Address, Profile, etc.

// 🎛️ Props del componente
interface PasswordListProps { // 🔄 ADAPTAR: AddressListProps, ProfileListProps, etc.
    userId?: number;        // 🆕 Prop opcional para filtrado
    showUserColumn?: boolean; // 🆕 Mostrar/ocultar columna usuario
    title?: string;         // 🆕 Título personalizable
}

const PasswordList: React.FC<PasswordListProps> = ({ // 🔄 ADAPTAR: AddressList, ProfileList, etc.
    userId, 
    showUserColumn = true,
    title = "Gestión de Contraseñas" // 🔄 ADAPTAR: "Gestión de Direcciones", etc.
}) => {
    const navigate = useNavigate();
    const {
        passwords,              // 🔄 ADAPTAR: addresses, profiles, etc.
        loading,
        error,
        getPasswordsByUserId,   // 🔄 ADAPTAR: getAddressesByUserId, etc.
        refreshPasswords,       // 🔄 ADAPTAR: refreshAddresses, etc.
        deletePassword,         // 🔄 ADAPTAR: deleteAddress, etc.
        clearError
    } = usePasswordController(); // 🔄 ADAPTAR: useAddressController, etc.

    // 🎛️ Estados locales
    const [searchTerm, setSearchTerm] = useState<string>('');

    // 🔄 Effect que decide qué datos cargar
    useEffect(() => {
        if (userId) {
            // 🎯 Cargar específico por usuario
            getPasswordsByUserId(userId); // 🔄 ADAPTAR: getAddressesByUserId, etc.
        } else {
            // 📋 Cargar todas las entidades
            refreshPasswords(); // 🔄 ADAPTAR: refreshAddresses, etc.
        }
    }, [userId, getPasswordsByUserId, refreshPasswords]);

    // 🔍 Filtrado adicional en frontend (respaldo)
    const filteredPasswords = useMemo(() => { // 🔄 ADAPTAR: filteredAddresses, etc.
        let result = passwords; // 🔄 ADAPTAR: addresses, etc.
        
        // Si viene userId prop, aplicar filtro frontend también
        if (userId) {
            result = result.filter(password => password.user_id === userId); // 🔄 ADAPTAR: address, etc.
        }
        
        // Filtro de búsqueda
        if (searchTerm) {
            result = result.filter(password => // 🔄 ADAPTAR: address, profile, etc.
                password.content.toLowerCase().includes(searchTerm.toLowerCase()) // 🔄 ADAPTAR: campos específicos
                // Ejemplo Address: address.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
                //                  address.city.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        return result;
    }, [passwords, userId, searchTerm]); // 🔄 ADAPTAR: addresses, etc.

    // 🗑️ Manejar eliminación
    const handleDelete = async (item: Password): Promise<void> => { // 🔄 ADAPTAR: Address, etc.
        if (window.confirm('¿Estás seguro de eliminar esta contraseña?')) { // 🔄 ADAPTAR: mensaje específico
            try {
                const success = await deletePassword(item.id!); // 🔄 ADAPTAR: deleteAddress, etc.
                if (!success) {
                    alert('Error al eliminar la contraseña'); // 🔄 ADAPTAR: mensaje específico
                }
            } catch (error) {
                alert('Error al eliminar la contraseña'); // 🔄 ADAPTAR: mensaje específico
            }
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* 🏠 Header dinámico */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    {title}
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/passwords/create')} // 🔄 ADAPTAR: /addresses/create, etc.
                    sx={{ textTransform: 'none' }}
                >
                    Nueva Contraseña {/* 🔄 ADAPTAR: "Nueva Dirección", etc. */}
                </Button>
            </Box>

            {/* 🔍 Filtros */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                            fullWidth
                            label="Buscar contraseñas..." // 🔄 ADAPTAR: "Buscar direcciones...", etc.
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="small"
                        />
                        <Button
                            variant="outlined"
                            onClick={() => userId ? getPasswordsByUserId(userId) : refreshPasswords()} // 🔄 ADAPTAR
                            sx={{ textTransform: 'none' }}
                        >
                            Refrescar
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* 📊 Tabla */}
            <Card>
                <CardContent>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : filteredPasswords.length === 0 ? ( // 🔄 ADAPTAR: filteredAddresses, etc.
                        <Box sx={{ textAlign: 'center', p: 4 }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No hay contraseñas registradas {/* 🔄 ADAPTAR: "direcciones", etc. */}
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => navigate('/passwords/create')} // 🔄 ADAPTAR: ruta específica
                                sx={{ textTransform: 'none' }}
                            >
                                Crear Primera Contraseña {/* 🔄 ADAPTAR: "Primera Dirección", etc. */}
                            </Button>
                        </Box>
                    ) : (
                        <TableContainer component={Paper} elevation={0}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                        {showUserColumn && (
                                            <TableCell sx={{ fontWeight: 'bold' }}>Usuario</TableCell>
                                        )}
                                        {/* 🔄 ADAPTAR: Columnas específicas de la entidad */}
                                        <TableCell sx={{ fontWeight: 'bold' }}>Contenido</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Fecha Inicio</TableCell>
                                        {/* Ejemplo Address:
                                        <TableCell sx={{ fontWeight: 'bold' }}>Calle</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Ciudad</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>País</TableCell>
                                        */}
                                        <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredPasswords.map((password) => ( // 🔄 ADAPTAR: filteredAddresses, address
                                        <TableRow key={password.id} hover>
                                            <TableCell>{password.id}</TableCell>
                                            {showUserColumn && (
                                                <TableCell>{password.user_id}</TableCell>
                                            )}
                                            {/* 🔄 ADAPTAR: Celdas específicas de la entidad */}
                                            <TableCell>{password.content}</TableCell>
                                            <TableCell>{password.startAt}</TableCell>
                                            {/* Ejemplo Address:
                                            <TableCell>{address.street}</TableCell>
                                            <TableCell>{address.city}</TableCell>
                                            <TableCell>{address.country}</TableCell>
                                            */}
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <IconButton
                                                        size="small"
                                                        color="info"
                                                        onClick={() => navigate(`/passwords/view/${password.id}`)} // 🔄 ADAPTAR: ruta específica
                                                        title="Ver detalles"
                                                    >
                                                        <ViewIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => navigate(`/passwords/update/${password.id}`)} // 🔄 ADAPTAR: ruta específica
                                                        title="Editar"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDelete(password)} // 🔄 ADAPTAR: address
                                                        title="Eliminar"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>

            {/* 📢 Error handling */}
            {error && (
                <Alert severity="error" sx={{ mt: 2 }} onClose={clearError}>
                    {error}
                </Alert>
            )}
        </Box>
    );
};

export default PasswordList; // 🔄 ADAPTAR: AddressList, ProfileList, etc.
```

**🔑 Puntos a Adaptar:**
- **Component name**: `PasswordList` → `AddressList`, `ProfileList`, etc.
- **Interface**: `PasswordListProps` → `AddressListProps`, etc.
- **State**: `passwords` → `addresses`, `profiles`, etc.
- **Table columns**: Según campos de la entidad
- **Search logic**: Filtrar por campos específicos
- **Navigation routes**: URLs específicas de la entidad

---

## 🛣️ **Paso 5: Configuración de Rutas**

### **Archivo**: `src/routes/index.ts`

```typescript
// 📁 EJEMPLO: routes/index.ts
// 🔄 ADAPTAR: Agregar rutas para tu entidad específica

import UserPasswordPage from '../pages/Password/UserPasswordPage'; // 🔄 ADAPTAR: UserAddressPage, etc.
import PasswordList from '../views/MaterialUI/PasswordViews/PasswordList'; // 🔄 ADAPTAR: AddressList, etc.
// ... otros imports

const routes = [
    // 🆕 RUTAS PARA FILTRADO POR USUARIO (PATRÓN A REPLICAR)
    
    // Password routes (EJEMPLO)
    { path: '/passwords', title: 'Password Management', component: PasswordList },
    { path: '/passwords/user/:userId', title: 'User Password History', component: UserPasswordPage }, // 🆕 NUEVA
    { path: '/passwords/create', title: 'Create Password', component: PasswordCreate },
    { path: '/passwords/update/:id', title: 'Update Password', component: PasswordUpdate },
    { path: '/passwords/view/:id', title: 'View Password', component: PasswordViewPage },

    // 🔄 ADAPTAR: Address routes (EJEMPLO DE ADAPTACIÓN)
    /*
    { path: '/addresses', title: 'Address Management', component: AddressList },
    { path: '/addresses/user/:userId', title: 'User Address History', component: UserAddressPage }, // 🆕 NUEVA
    { path: '/addresses/create', title: 'Create Address', component: AddressCreate },
    { path: '/addresses/update/:id', title: 'Update Address', component: AddressUpdate },
    { path: '/addresses/view/:id', title: 'View Address', component: AddressViewPage },
    */

    // 🔄 ADAPTAR: Profile routes (EJEMPLO DE ADAPTACIÓN)
    /*
    { path: '/profiles', title: 'Profile Management', component: ProfileList },
    { path: '/profiles/user/:userId', title: 'User Profile History', component: UserProfilePage }, // 🆕 NUEVA
    { path: '/profiles/create', title: 'Create Profile', component: ProfileCreate },
    { path: '/profiles/update/:id', title: 'Update Profile', component: ProfileUpdate },
    { path: '/profiles/view/:id', title: 'View Profile', component: ProfileViewPage },
    */

    // ... otras rutas existentes
];

export default routes;
```

**🔑 Puntos a Adaptar:**
- **Path**: `/passwords/user/:userId` → `/addresses/user/:userId`, etc.
- **Title**: Títulos específicos de la entidad
- **Component**: Importar y usar componentes correctos

---

## 🔗 **Paso 6: Navegación y Enlaces**

### **En cualquier componente:**

```typescript
// 📁 EJEMPLO: Navegación programática
// 🔄 ADAPTAR: URLs según tu entidad

import { useNavigate } from 'react-router-dom';

const SomeComponent = () => {
    const navigate = useNavigate();

    // 🎯 Navegar a historial de usuario específico
    const viewUserPasswords = (userId: number) => { // 🔄 ADAPTAR: viewUserAddresses, etc.
        navigate(`/passwords/user/${userId}`); // 🔄 ADAPTAR: /addresses/user/${userId}, etc.
    };

    const viewUserAddresses = (userId: number) => { // 🔄 EJEMPLO DE ADAPTACIÓN
        navigate(`/addresses/user/${userId}`);
    };

    const viewUserProfiles = (userId: number) => { // 🔄 EJEMPLO DE ADAPTACIÓN
        navigate(`/profiles/user/${userId}`);
    };

    return (
        <Box>
            <Button onClick={() => viewUserPasswords(123)}>
                Ver Contraseñas Usuario 123 {/* 🔄 ADAPTAR: "Ver Direcciones", etc. */}
            </Button>
            <Button onClick={() => viewUserAddresses(123)}>
                Ver Direcciones Usuario 123 {/* 🔄 EJEMPLO ADAPTADO */}
            </Button>
        </Box>
    );
};
```

### **En tablas o listas de usuarios:**

```typescript
// 📁 EJEMPLO: Links directos en tabla
// 🔄 ADAPTAR: Según entidad específica

import { Link } from 'react-router-dom';

const UserTable = ({ users }) => {
    return (
        <Table>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>
                            {/* 🔗 Links a historiales específicos */}
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Link to={`/passwords/user/${user.id}`}> {/* 🔄 ADAPTAR: URLs específicas */}
                                    Contraseñas ({user.password_count}) {/* 🔄 ADAPTAR: Texto y contador */}
                                </Link>
                                <Link to={`/addresses/user/${user.id}`}> {/* 🔄 EJEMPLO ADAPTADO */}
                                    Direcciones ({user.address_count})
                                </Link>
                                <Link to={`/profiles/user/${user.id}`}> {/* 🔄 EJEMPLO ADAPTADO */}
                                    Perfiles ({user.profile_count})
                                </Link>
                            </Box>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
```

---

## 🔄 **Template de Adaptación Rápida**

### **🏗️ Checklist para Nueva Entidad:**

```bash
# 1️⃣ CREAR ARCHIVOS (reemplazar "Entity" por tu entidad)
src/services/entityService.ts
src/controllers/useEntityController.ts
src/pages/Entity/UserEntityPage.tsx
src/views/MaterialUI/EntityViews/EntityList.tsx (modificar existente)

# 2️⃣ BUSCAR Y REEMPLAZAR EN ARCHIVOS
Password → Entity (ej: Address, Profile)
password → entity (ej: address, profile)
passwords → entities (ej: addresses, profiles)
/passwords → /entities (ej: /addresses, /profiles)
"contraseñas" → "entidades" (ej: "direcciones", "perfiles")

# 3️⃣ ADAPTAR CAMPOS ESPECÍFICOS
password.content → address.street, profile.name, etc.
password.startAt → address.created_at, profile.updated_at, etc.
password.user_id → address.user_id, profile.user_id (mantener)

# 4️⃣ ACTUALIZAR RUTAS
Agregar: { path: '/entities/user/:userId', component: UserEntityPage }

# 5️⃣ PROBAR NAVEGACIÓN
/entities/user/123 debe mostrar datos filtrados
```

---

## 🎯 **Entidades Candidatas para Implementar**

### **📋 Lista de Prioridades:**

1. **📮 Address (Direcciones)**
   - URL: `/addresses/user/:userId`
   - Campos: street, city, country, postal_code
   - Útil para: Historial de mudanzas, direcciones de envío

2. **👤 Profile (Perfiles)**
   - URL: `/profiles/user/:userId`
   - Campos: bio, avatar, preferences, settings
   - Útil para: Configuraciones personales, historial de cambios

3. **🛡️ Role (Roles)**
   - URL: `/roles/user/:userId`
   - Campos: role_name, permissions, assigned_at
   - Útil para: Auditoría de permisos, historial de roles

4. **📱 Session (Sesiones)**
   - URL: `/sessions/user/:userId`
   - Campos: login_time, ip_address, device, location
   - Útil para: Seguridad, monitoreo de accesos

5. **🔐 SecurityQuestion (Preguntas de Seguridad)**
   - URL: `/security-questions/user/:userId`
   - Campos: question, created_at, is_active
   - Útil para: Recuperación de contraseñas, seguridad

---

## 🚀 **Beneficios de Este Patrón**

### ✅ **Robustez:**
- **Backend optimizado**: Consulta específica más eficiente
- **Frontend fallback**: Funciona aunque backend falle
- **Error handling**: Manejo robusto de errores

### ✅ **Reutilización:**
- **Componente adaptable**: Mismo componente, diferentes contextos
- **Props configurables**: UI adaptable según necesidades
- **Patrón escalable**: Fácil replicar en otras entidades

### ✅ **UX Superior:**
- **URLs semánticas**: `/passwords/user/123` es claro e intuitivo
- **Navegación intuitiva**: Links directos desde otras vistas
- **Performance**: Carga solo datos necesarios del usuario

### ✅ **Mantenibilidad:**
- **Separación clara**: Service → Controller → Component → Page
- **TypeScript**: Tipado fuerte en toda la cadena
- **Documentación**: Código autodocumentado y patrones consistentes

---

## ⚠️ **Consideraciones Importantes**

### **🔧 Adaptaciones Necesarias:**

1. **Modelos de Datos**: Cada entidad tiene campos diferentes
2. **Validaciones**: Lógica específica por entidad
3. **Permisos**: Verificar que usuario puede ver datos de otro usuario
4. **Performance**: Considerar paginación para entidades con muchos registros

### **🛡️ Seguridad:**

```typescript
// 🔒 EJEMPLO: Verificación de permisos antes de mostrar datos
const checkUserPermission = (currentUserId: number, targetUserId: number) => {
    // Solo admin o el mismo usuario puede ver sus datos
    return currentUserId === targetUserId || isAdmin(currentUserId);
};
```

### **📊 Performance:**

```typescript
// 📈 EJEMPLO: Implementar paginación si necesario
const getEntitiesByUserId = async (userId: number, page = 1, limit = 20) => {
    const response = await api.get(`/entities/user/${userId}?page=${page}&limit=${limit}`);
    return response.data;
};
```

---

## 🎉 **Conclusión**

Este patrón de **filtrado por usuario** implementado en el sistema de contraseñas es **completamente reutilizable** para cualquier entidad del proyecto. 

### **📋 Para implementar en tu entidad:**

1. **📋 Copia los archivos** del ejemplo
2. **🔄 Busca y reemplaza** "Password" por tu entidad
3. **🔧 Adapta los campos** específicos de tu modelo
4. **🛣️ Configura las rutas** correspondientes
5. **🧪 Prueba la navegación** `/entidad/user/:userId`

### **🚀 Resultado:**
- **URLs intuitivas** para filtrado por usuario
- **Componentes reutilizables** con props configurables
- **Estrategia híbrida** backend + frontend robust
- **Patrón escalable** para todo el proyecto

¡Ahora tienes una **guía completa** para implementar filtrado por usuario en cualquier entidad de tu sistema! 🎯