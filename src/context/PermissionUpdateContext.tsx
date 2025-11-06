import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PermissionUpdateContextType {
  updateTrigger: number;
  triggerPermissionUpdate: () => void;
  isDynamicMode: boolean;
  setDynamicMode: (enabled: boolean) => void;
  isTransitioning: boolean;
  setTransitioning: (transitioning: boolean) => void;
}

const PermissionUpdateContext = createContext<PermissionUpdateContextType | undefined>(undefined);

interface PermissionUpdateProviderProps {
  children: ReactNode;
}

export const PermissionUpdateProvider: React.FC<PermissionUpdateProviderProps> = ({ children }) => {
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [isDynamicMode, setIsDynamicMode] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const triggerPermissionUpdate = () => {
    console.log("🔄 Triggering global permission update");
    setIsTransitioning(true);
    setUpdateTrigger(prev => prev + 1);
    setIsDynamicMode(true);
    
    // Resetear estado de transición después de un pequeño delay
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
  };

  const setDynamicMode = (enabled: boolean) => {
    console.log(`🎯 Setting dynamic mode: ${enabled}`);
    setIsDynamicMode(enabled);
  };

  const setTransitioning = (transitioning: boolean) => {
    console.log(`⏳ Setting transitioning state: ${transitioning}`);
    setIsTransitioning(transitioning);
  };

  return (
    <PermissionUpdateContext.Provider 
      value={{ 
        updateTrigger, 
        triggerPermissionUpdate, 
        isDynamicMode, 
        setDynamicMode,
        isTransitioning,
        setTransitioning
      }}
    >
      {children}
    </PermissionUpdateContext.Provider>
  );
};

export const usePermissionUpdate = () => {
  const context = useContext(PermissionUpdateContext);
  if (context === undefined) {
    throw new Error('usePermissionUpdate must be used within a PermissionUpdateProvider');
  }
  return context;
};