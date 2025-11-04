import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

/**
 * Hook personalizado para obtener el usuario actual desde múltiples fuentes:
 * 1. AuthContext (Firebase/Backend integrado) - PRIORITARIO
 * 2. Redux Store - SECUNDARIO
 * 3. LocalStorage - FALLBACK
 * 4. Perfil del usuario (si está en una variable específica)
 */
export const useCurrentUser = () => {
  const { currentUser: authUser } = useAuth();
  const storeUser = useSelector((state: RootState) => state.user.user); // Acceder a user.user
  const [fallbackUser, setFallbackUser] = useState<any>(null);

  useEffect(() => {
    // Si no hay usuario en AuthContext ni en Store, buscar en localStorage
    if (!authUser && (!storeUser || !storeUser.email)) {
      try {
        // Buscar en diferentes claves de localStorage
        const localUser = localStorage.getItem("user");
        const localProfile = localStorage.getItem("profile");
        const localAuth = localStorage.getItem("auth");
        
        if (localUser) {
          const userData = JSON.parse(localUser);
          setFallbackUser(userData);
        } else if (localProfile) {
          const profileData = JSON.parse(localProfile);
          setFallbackUser(profileData);
        } else if (localAuth) {
          const authData = JSON.parse(localAuth);
          setFallbackUser(authData);
        }
      } catch (error) {
        console.warn("Error parsing user data from localStorage:", error);
      }
    }
  }, [authUser, storeUser]);

  // Priorizar fuentes en este orden
  const getCurrentUser = () => {
    // 1. AuthContext (más confiable)
    if (authUser && authUser.email) {
      return authUser;
    }
    
    // 2. Redux Store
    if (storeUser && storeUser.email) {
      return storeUser;
    }
    
    // 3. Fallback de localStorage
    if (fallbackUser && fallbackUser.email) {
      return fallbackUser;
    }
    
    return null;
  };

  const currentUser = getCurrentUser();

  return {
    currentUser,
    isAuthenticated: !!currentUser,
    email: currentUser?.email || null,
    name: currentUser?.name || currentUser?.displayName || null,
    id: currentUser?.id || null,
    // Información de debug
    sources: {
      authContext: !!authUser,
      reduxStore: !!(storeUser && storeUser.email),
      localStorage: !!fallbackUser,
    }
  };
};