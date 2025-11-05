# 🚀 QUICK START - Sistema de Estilos Dual

## 📊 Resumen del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    HEADER (Superior)                     │
│  [☰] .................... [🔵 Tailwind] [🟡 Material UI] │
└─────────────────────────────────────────────────────────┘
┌──────────┬──────────────────────────────────────────────┐
│          │                                              │
│ SIDEBAR  │              CONTENIDO                       │
│          │         (Cambia según botón)                │
│  Home    │                                              │
│  Users   │  🔵 Tailwind = Azul (ACTUAL)                │
│  Roles   │  🟡 Material UI = Amarillo (NUEVO)          │
│  ...     │                                              │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

---

## 🎨 Comparación Visual de Estilos

### **🔵 TAILWIND CSS (Modo Actual - NO TOCAR)**
```tsx
// Card con Tailwind
<div className="bg-white dark:bg-boxdark border rounded-sm shadow-default">
  <div className="border-b px-6 py-4" style={{ backgroundColor: '#2563EB' }}>
    <h3 className="text-white font-bold">Título Azul</h3>
  </div>
  <div className="p-6">
    <p className="text-gray-700 dark:text-gray-300">Contenido</p>
  </div>
</div>
```

**Colores principales:**
- 🔵 Azul: `#2563EB`, `#1E3A8A`
- ⚪ Blanco: `#FFFFFF`
- 🌙 Oscuro: `#0A1628`

---

### **🟡 MATERIAL UI (Modo Nuevo - AGREGAR)**
```tsx
// Card con Material UI
<Card sx={{ backgroundColor: '#FFF9C4', boxShadow: 3 }}>
  <CardHeader 
    title="Título Amarillo"
    sx={{ backgroundColor: '#FFC107', color: '#000' }}
  />
  <CardContent>
    <Typography sx={{ color: '#F57F17' }}>Contenido</Typography>
  </CardContent>
</Card>
```

**Colores principales:**
- 🟡 Amarillo: `#FFC107`, `#FFD54F`
- 📄 Fondo: `#FFF9C4`, `#FFFDE7`
- 📝 Texto: `#F57F17`

---

## 🔧 Implementación en 3 Pasos

### **PASO 1: Instalar Material UI**
```bash
npm install @mui/material @emotion/react @emotion/styled
```

### **PASO 2: Importar el hook**
```tsx
import { useThemeStyle } from '../context/ThemeStyleContext';
```

### **PASO 3: Usar condicional**
```tsx
const MiComponente = () => {
  const { styleMode } = useThemeStyle();

  if (styleMode === 'materialui') {
    return <div>Material UI Version (Amarillo)</div>;
  }

  return <div>Tailwind Version (Azul - Actual)</div>;
};
```

---

## 📂 Archivos Ya Creados (LISTOS PARA USAR)

| Archivo | Descripción | Estado |
|---------|-------------|--------|
| `src/context/ThemeStyleContext.tsx` | Context Provider | ✅ Listo |
| `src/components/StyleSwitcher.tsx` | Botones de cambio | ✅ Listo |
| `src/components/ExampleStyleSwitch.tsx` | Ejemplo completo | ✅ Listo |
| `STYLE_GUIDE.md` | Guía de estilos | ✅ Listo |
| `INSTRUCCIONES_MATERIAL_UI.md` | Manual paso a paso | ✅ Listo |

---

## ⚡ Para Probar el Sistema

1. **Abrir el proyecto** en el navegador (`npm run dev`)
2. **Ver el Header** (arriba) → Deberías ver dos botones:
   - 🔵 **Tailwind** (azul)
   - 🟡 **Material UI** (amarillo)
3. **Hacer clic en cada botón** y ver que cambia el estilo
4. **Recargar la página** → Mantiene el estilo seleccionado

---

## ✅ Checklist Rápido

**Ya está hecho (NO tocar):**
- [x] Context Provider creado
- [x] Hook `useThemeStyle()` disponible
- [x] Botones en el Header
- [x] localStorage configurado
- [x] Mejora de contraste en Sidebar

**Por hacer (Tu compañero/a):**
- [ ] Instalar Material UI
- [ ] Convertir componente Home
- [ ] Convertir componente Sidebar
- [ ] Convertir componente Profile
- [ ] Convertir componente Address
- [ ] Probar dark mode en Material UI

---

## 🎯 Regla de Oro

```
╔════════════════════════════════════════════════════════╗
║  SI styleMode === 'materialui'  →  Material UI (NUEVO)║
║  ELSE (por defecto)             →  Tailwind (ACTUAL)  ║
║                                                        ║
║  ⚠️ NUNCA modificar el código Tailwind existente      ║
╚════════════════════════════════════════════════════════╝
```

---

## 📞 Contacto

Si tienes dudas:
1. Revisa `ExampleStyleSwitch.tsx` (ejemplo completo)
2. Lee `INSTRUCCIONES_MATERIAL_UI.md` (paso a paso)
3. Consulta `STYLE_GUIDE.md` (colores y estilos)
4. Pregunta a tu compañero/a

---

**¡Todo listo para empezar!** 🎉

Solo falta que tu compañero/a instale Material UI y comience a convertir los componentes usando el patrón del ejemplo.
