import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type StyleMode = 'tailwind' | 'materialui';

interface ThemeStyleContextType {
  styleMode: StyleMode;
  setStyleMode: (mode: StyleMode) => void;
  toggleStyleMode: () => void;
}

const ThemeStyleContext = createContext<ThemeStyleContextType | undefined>(undefined);

export const ThemeStyleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [styleMode, setStyleModeState] = useState<StyleMode>(() => {
    // Leer del localStorage al iniciar
    const saved = localStorage.getItem('theme-style-mode');
    return (saved === 'materialui' ? 'materialui' : 'tailwind') as StyleMode;
  });

  const setStyleMode = (mode: StyleMode) => {
    setStyleModeState(mode);
    localStorage.setItem('theme-style-mode', mode);
  };

  const toggleStyleMode = () => {
    const newMode = styleMode === 'tailwind' ? 'materialui' : 'tailwind';
    setStyleMode(newMode);
  };

  useEffect(() => {
    // Guardar en localStorage cuando cambie
    localStorage.setItem('theme-style-mode', styleMode);
    
    // Agregar clase al body para estilos globales si es necesario
    if (styleMode === 'materialui') {
      document.body.classList.add('material-ui-mode');
      document.body.classList.remove('tailwind-mode');
    } else {
      document.body.classList.add('tailwind-mode');
      document.body.classList.remove('material-ui-mode');
    }
  }, [styleMode]);

  return (
    <ThemeStyleContext.Provider value={{ styleMode, setStyleMode, toggleStyleMode }}>
      {children}
    </ThemeStyleContext.Provider>
  );
};

export const useThemeStyle = () => {
  const context = useContext(ThemeStyleContext);
  if (context === undefined) {
    throw new Error('useThemeStyle must be used within a ThemeStyleProvider');
  }
  return context;
};