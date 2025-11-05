# 🎨 Guía de Estilos del Proyecto

## Sistema de Colores Actual (Tailwind CSS)

### **Paleta Principal**
```css
/* Verde (Primary) */
--color-primary: #359E39;
--color-primary-hover: #2d8530;

/* Azul Oscuro */
--color-blue-dark: #1E3A8A;
--color-blue-light: #2563EB;

/* Grises */
--color-gray-light: #C5C4C3;
--color-gray-medium: #9CA3AF;
--color-gray-dark: #6b7280;

/* Backgrounds Claros */
--color-bg-light: #DDDCDB;
--color-bg-white: #F9FAFB;

/* Backgrounds Oscuros (Dark Mode) */
--color-bg-dark: #0A1628;
--color-bg-dark-secondary: #1E3A5A;
--color-border-dark: #5B5B60;
```

---

## 📐 Estructura de Componentes con Estilos

### **Sidebar** (`src/components/Sidebar.tsx`)

#### Colores del Sidebar:
- **Fondo Claro**: `bg-[#C5C4C3]`
- **Fondo Oscuro**: `dark:bg-[#0A1628]`
- **Texto Principal**: `text-[#1E3A8A]` (Azul oscuro)
- **Texto Dark Mode**: `dark:text-[#F5F7FA]`
- **Logo Color**: `fill-[#359E39]` (Verde)
- **Hover Background**: `hover:bg-[#DDDCDB]`
- **Hover Dark Mode**: `dark:hover:bg-[#1E3A5A]`
- **Active Background**: `bg-[#DDDCDB] dark:bg-[#1E3A5A]`

#### Ejemplo de NavLink:
```tsx
<NavLink
  className={`
    group relative flex items-center gap-2.5 rounded-sm py-2 px-4 
    font-medium text-[#1E3A8A] duration-300 ease-in-out 
    hover:bg-[#DDDCDB] 
    dark:text-[#F5F7FA] dark:hover:bg-[#1E3A5A]
  `}
>
```

---

### **Header** (`src/components/Header.tsx`)

#### Colores del Header:
- **Fondo Claro**: `bg-[#C5C4C3]`
- **Fondo Oscuro**: `dark:bg-[#0A1628]`
- **Hamburger Button Border**: `border-[#9CA3AF]`
- **Hamburger Button Background**: `bg-[#F9FAFB]`
- **Dark Mode Border**: `dark:border-[#5B5B60]`

---

### **Páginas y Contenido Principal**

#### Cards y Contenedores:
```tsx
// Contenedor Principal
className="rounded-sm border border-stroke bg-white shadow-default 
           dark:border-strokedark dark:bg-boxdark"

// Header de Card
className="border-b border-stroke px-6.5 py-4 dark:border-strokedark"

// Título
className="font-medium text-black dark:text-white"

// Sección de Información
className="mb-6 p-4 bg-gray-50 rounded-md dark:bg-boxdark-2"
```

#### Inputs y Formularios:
```tsx
// Input Field
className="w-full rounded border-[1.5px] border-stroke bg-transparent 
           px-5 py-3 text-black outline-none transition 
           focus:border-primary active:border-primary 
           dark:border-form-strokedark dark:bg-form-input 
           dark:text-white dark:focus:border-primary"

// Label
className="block text-sm font-medium text-gray-500 dark:text-gray-300"
```

#### Botones:
```tsx
// Botón Verde (Primary)
style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
className="py-2 px-6 font-semibold rounded-md hover:opacity-90"

// Botón Gris (Secondary)
style={{ backgroundColor: '#6b7280', color: '#ffffff' }}
className="py-2 px-6 font-semibold rounded-md hover:opacity-90"
```

---

## 🔄 Sistema de Alternancia de Estilos

### **Actualmente Implementado:**
- ✅ Context Provider: `ThemeStyleProvider`
- ✅ Hook: `useThemeStyle()`
- ✅ Botones de cambio: Azul (Tailwind) / Amarillo (Material UI)
- ✅ Guardado en localStorage

### **Estado Actual:**
- **Modo por Defecto**: Tailwind CSS
- **Todos los componentes usan**: Los estilos documentados arriba

---

## 📝 Cómo Aplicar Material UI (Para tu compañero/a)

### **Paso 1: Importar useThemeStyle en el componente**
```tsx
import { useThemeStyle } from '../context/ThemeStyleContext';
```

### **Paso 2: Usar condicional para renderizar**
```tsx
const MiComponente = () => {
  const { styleMode } = useThemeStyle();

  if (styleMode === 'materialui') {
    // Retornar versión con Material UI
    return (
      <div className="material-ui-container">
        {/* Componentes de Material UI */}
      </div>
    );
  }

  // Retornar versión Tailwind (mantener EXACTAMENTE como está ahora)
  return (
    <div className="bg-white dark:bg-boxdark">
      {/* Mantener código actual SIN CAMBIOS */}
    </div>
  );
};
```

### **Paso 3: Ejemplo con Material UI**
```tsx
import { Card, CardContent, Typography, Button } from '@mui/material';
import { useThemeStyle } from '../context/ThemeStyleContext';

const Ejemplo = () => {
  const { styleMode } = useThemeStyle();

  if (styleMode === 'materialui') {
    return (
      <Card sx={{ backgroundColor: '#FFF9C4' }}> {/* Amarillo claro */}
        <CardContent>
          <Typography variant="h5" color="#F57F17"> {/* Amarillo oscuro */}
            Material UI Version
          </Typography>
          <Button variant="contained" sx={{ backgroundColor: '#FFC107' }}>
            Botón Amarillo
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Versión Tailwind - MANTENER IGUAL
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          Tailwind Version
        </h3>
      </div>
    </div>
  );
};
```

---

## 🎨 Paleta de Colores para Material UI (Sugerencia Amarilla)

```tsx
// Tema Material UI sugerido
const theme = createTheme({
  palette: {
    primary: {
      main: '#FFC107', // Amarillo principal
      light: '#FFD54F',
      dark: '#FFA000',
    },
    secondary: {
      main: '#FF9800', // Naranja
      light: '#FFB74D',
      dark: '#F57C00',
    },
    background: {
      default: '#FFF9C4', // Amarillo muy claro
      paper: '#FFFDE7',
    },
    text: {
      primary: '#F57F17', // Amarillo oscuro
      secondary: '#F9A825',
    },
  },
});
```

---

## 📌 IMPORTANTE: Reglas para NO romper estilos actuales

### ✅ **SÍ hacer:**
1. Agregar condicional `if (styleMode === 'materialui')`
2. Retornar versión Material UI SOLO dentro del if
3. Mantener código Tailwind actual en el `return` principal
4. Probar que el botón "Tailwind" (azul) mantiene todo igual

### ❌ **NO hacer:**
1. NO modificar los estilos Tailwind existentes
2. NO eliminar clases dark mode (`dark:`)
3. NO cambiar colores hex (`#359E39`, `#1E3A8A`, etc.)
4. NO tocar la estructura HTML actual

---

## 🧪 Checklist de Validación

Antes de hacer commit, verificar:
- [ ] Botón "Tailwind" (Azul) muestra estilos EXACTAMENTE iguales a antes
- [ ] Botón "Material UI" (Amarillo) muestra nueva versión
- [ ] Dark mode funciona en AMBOS estilos
- [ ] localStorage guarda la preferencia
- [ ] No hay errores de compilación

---

## 📂 Archivos Clave a Modificar (Para Material UI)

### **Componentes Principales:**
- `src/pages/Dashboard/Home.tsx` - Página de inicio
- `src/components/Sidebar.tsx` - Menú lateral
- `src/components/Header.tsx` - Encabezado
- `src/pages/Profile/userProfile.tsx` - Perfil de usuario
- `src/pages/Address/view.tsx` - Vista de direcciones

### **Componentes de Formulario:**
- `src/components/profile/profileForm.tsx`
- `src/components/Address/AddressFormValidator.tsx`

### **Componentes Auxiliares:**
- `src/components/GenericTable.tsx`
- `src/components/CardOne.tsx`, `CardTwo.tsx`, etc.

---

## 💡 Tip: Crear un componente de ejemplo primero

```tsx
// src/components/ExampleStyleSwitch.tsx
import { useThemeStyle } from '../context/ThemeStyleContext';
import { Card, CardContent, Typography } from '@mui/material';

const ExampleStyleSwitch = () => {
  const { styleMode } = useThemeStyle();

  if (styleMode === 'materialui') {
    return (
      <Card sx={{ m: 2, backgroundColor: '#FFF9C4' }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#F57F17' }}>
            ✅ Material UI está funcionando!
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="m-2 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h3 className="text-lg font-semibold text-black dark:text-white">
        ✅ Tailwind está funcionando!
      </h3>
    </div>
  );
};

export default ExampleStyleSwitch;
```

---

## 🔗 Recursos

- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Material UI Docs**: https://mui.com/material-ui/getting-started/
- **Material Tailwind Docs**: https://www.material-tailwind.com/docs/react/installation

---

**Última actualización**: 5 de Noviembre, 2025
**Autor**: Equipo de desarrollo
**Versión**: 1.0
