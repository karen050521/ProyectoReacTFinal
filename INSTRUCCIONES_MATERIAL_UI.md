# 📖 INSTRUCCIONES PARA IMPLEMENTAR MATERIAL UI

## 🎯 Objetivo
Agregar la funcionalidad de Material UI (estilo amarillo) **SIN MODIFICAR** los estilos Tailwind existentes (estilo azul).

---

## ✅ Paso 1: Instalar Material UI

Abre la terminal en el proyecto y ejecuta:

```bash
npm install @mui/material @emotion/react @emotion/styled
```

Esto instalará Material UI y sus dependencias necesarias.

---

## ✅ Paso 2: Entender el Sistema Actual

### **Ya está implementado:**
- ✅ Context Provider (`ThemeStyleProvider`) en `src/context/ThemeStyleContext.tsx`
- ✅ Hook `useThemeStyle()` para acceder al modo actual
- ✅ Botones de cambio en el Header (Azul = Tailwind, Amarillo = Material UI)
- ✅ Guardado automático en localStorage

### **Estado actual:**
- Por defecto, todo usa **Tailwind CSS** (estilos azules actuales)
- Al hacer clic en el botón **amarillo**, cambia a `styleMode = 'materialui'`
- Al hacer clic en el botón **azul**, vuelve a `styleMode = 'tailwind'`

---

## ✅ Paso 3: Ver el Componente de Ejemplo

1. Abre el archivo `src/components/ExampleStyleSwitch.tsx`
2. Este archivo muestra **EXACTAMENTE** cómo implementar la alternancia
3. Observa que tiene DOS versiones:
   - **Material UI** (dentro del `if`)
   - **Tailwind** (en el `return` principal) ← **SIN CAMBIOS**

---

## ✅ Paso 4: Probar el Ejemplo (Opcional)

Para ver el ejemplo funcionando, agrega el componente a Home:

**Archivo**: `src/pages/Dashboard/Home.tsx`

```tsx
// Agregar import al inicio
import ExampleStyleSwitch from '../../components/ExampleStyleSwitch';

// Agregar al final del componente, antes del último </div>
<ExampleStyleSwitch />
```

Guarda y verifica en el navegador:
- Clic en botón **Azul** → Ves estilos Tailwind
- Clic en botón **Amarillo** → Ves estilos Material UI

---

## ✅ Paso 5: Aplicar a Componentes Reales

### **Template para convertir cualquier componente:**

```tsx
import { useThemeStyle } from '../context/ThemeStyleContext';
// Imports de Material UI que necesites
import { Card, CardContent, Typography } from '@mui/material';

const MiComponente = () => {
  const { styleMode } = useThemeStyle();

  // ===== VERSIÓN MATERIAL UI (NUEVA) =====
  if (styleMode === 'materialui') {
    return (
      <div>
        {/* TODO: Implementar versión con Material UI */}
        {/* Usar componentes como <Card>, <Typography>, etc. */}
        {/* Colores: #FFC107 (amarillo principal), #FFD54F (amarillo claro) */}
      </div>
    );
  }

  // ===== VERSIÓN TAILWIND (MANTENER IGUAL) =====
  return (
    <div className="...clases actuales...">
      {/* NO TOCAR ESTE CÓDIGO */}
      {/* Mantener exactamente como está */}
    </div>
  );
};
```

---

## ✅ Paso 6: Componentes Prioritarios a Convertir

### **Lista recomendada (de más importante a menos):**

1. **`src/pages/Dashboard/Home.tsx`** - Página principal
2. **`src/components/Sidebar.tsx`** - Menú lateral
3. **`src/pages/Profile/userProfile.tsx`** - Perfil de usuario
4. **`src/pages/Address/view.tsx`** - Vista de direcciones
5. **`src/components/GenericTable.tsx`** - Tablas

---

## ✅ Paso 7: Paleta de Colores Material UI

Usa estos colores para mantener consistencia:

```tsx
const materialTheme = createTheme({
  palette: {
    primary: {
      main: '#FFC107',      // Amarillo principal
      light: '#FFD54F',     // Amarillo claro
      dark: '#FFA000',      // Amarillo oscuro
    },
    secondary: {
      main: '#FF9800',      // Naranja
    },
    background: {
      default: '#FFFDE7',   // Fondo general
      paper: '#FFF9C4',     // Fondo de cards
    },
    text: {
      primary: '#F57F17',   // Texto principal
      secondary: '#F9A825', // Texto secundario
    },
  },
});
```

---

## ✅ Paso 8: Checklist de Validación

Antes de hacer commit, VERIFICAR:

- [ ] **Instalé Material UI** (`npm install @mui/material @emotion/react @emotion/styled`)
- [ ] **Botón Azul funciona**: Al hacer clic, TODO se ve IGUAL que antes
- [ ] **Botón Amarillo funciona**: Al hacer clic, se ven los nuevos estilos Material UI
- [ ] **No hay errores de compilación** en la consola
- [ ] **Dark mode funciona** en ambos estilos (Tailwind y Material UI)
- [ ] **localStorage guarda** la preferencia (al recargar página mantiene el estilo seleccionado)

---

## ✅ Paso 9: Ejemplo Completo de Conversión

### **ANTES (Solo Tailwind):**
```tsx
const UserProfile = () => {
  return (
    <div className="bg-white dark:bg-boxdark p-6">
      <h2 className="text-2xl font-bold text-black dark:text-white">
        Perfil de Usuario
      </h2>
      <input className="w-full border px-4 py-2" />
    </div>
  );
};
```

### **DESPUÉS (Con alternancia):**
```tsx
import { useThemeStyle } from '../context/ThemeStyleContext';
import { Card, CardContent, Typography, TextField } from '@mui/material';

const UserProfile = () => {
  const { styleMode } = useThemeStyle();

  // Material UI Version
  if (styleMode === 'materialui') {
    return (
      <Card sx={{ backgroundColor: '#FFF9C4', p: 3 }}>
        <Typography variant="h5" sx={{ color: '#F57F17', mb: 2 }}>
          Perfil de Usuario
        </Typography>
        <TextField fullWidth variant="outlined" />
      </Card>
    );
  }

  // Tailwind Version (SIN CAMBIOS)
  return (
    <div className="bg-white dark:bg-boxdark p-6">
      <h2 className="text-2xl font-bold text-black dark:text-white">
        Perfil de Usuario
      </h2>
      <input className="w-full border px-4 py-2" />
    </div>
  );
};
```

---

## 🆘 Solución de Problemas

### **Error: Cannot find module '@mui/material'**
**Solución**: Ejecutar `npm install @mui/material @emotion/react @emotion/styled`

### **Los estilos Tailwind se ven diferentes**
**Solución**: NO tocar el código dentro del `return` principal, solo agregar el `if` arriba

### **El localStorage no funciona**
**Solución**: Ya está implementado en `ThemeStyleContext.tsx`, verifica que esté importado en `main.tsx`

### **Los botones no aparecen en el Header**
**Solución**: Ya están agregados en `Header.tsx`, verifica que `StyleSwitcher` esté importado

---

## 📚 Recursos Útiles

- **Material UI Docs**: https://mui.com/material-ui/getting-started/
- **Material UI Components**: https://mui.com/material-ui/all-components/
- **Material UI Customization**: https://mui.com/material-ui/customization/theming/
- **Ejemplos Material UI**: https://mui.com/material-ui/getting-started/templates/

---

## 📝 Notas Finales

1. **NUNCA modificar** el código Tailwind existente dentro del `return` principal
2. **SIEMPRE** poner el código Material UI dentro del `if (styleMode === 'materialui')`
3. **Probar** ambos botones (Azul y Amarillo) después de cada cambio
4. **Consultar** el archivo `ExampleStyleSwitch.tsx` como referencia
5. **Revisar** `STYLE_GUIDE.md` para colores y estilos exactos

---

**¡Buena suerte!** 🚀

Si tienes dudas, revisa los archivos de ejemplo o consulta con tu compañero/a.
