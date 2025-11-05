import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import { IAuthContext, IAuthProvider } from "../interfaces/auth.interface";
import { AuthUser } from "../models/auth";
import { FirebaseAuthProvider } from "../services/auth/FirebaseAuthProvider";
import { firebaseConfig, getFirebaseSetupInstructions } from "../config/firebase.config";
import securityService from "../services/securityService";
import { UserStorageManager } from "../utils/userStorageManager";

// Dependency Inversion: AuthContext depende de abstracción IAuthProvider
const AuthContext = createContext<IAuthContext | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

interface Props {
  children: React.ReactNode;
  authProvider?: IAuthProvider; // Permite inyectar diferentes providers
}

export const AuthProvider: React.FC<Props> = ({ children, authProvider }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Dependency Injection: usa provider inyectado o default Firebase
  const getAuthProvider = (): IAuthProvider => {
    if (authProvider) return authProvider;
    
    // Default Firebase provider con configuración centralizada
    return new FirebaseAuthProvider(firebaseConfig);
  };

  const authProviderInstance = getAuthProvider();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // 🔥 VERIFICAR AMBOS TIPOS DE AUTENTICACIÓN
        
        // 1. Verificar si hay sesión del backend (login tradicional o Firebase integrado)
        const sessionToken = UserStorageManager.getSession();
        const storedUser = UserStorageManager.getUser();
        
        if (sessionToken && storedUser) {
          console.log("✅ Sesión del backend encontrada con token válido");
          // Adaptar usuario del backend al formato AuthUser
          const authUser: AuthUser = {
            ...storedUser,
            token: sessionToken,
            provider: storedUser.provider || 'local' as const
          };
          setCurrentUser(authUser);
          dispatch(setUser(storedUser));
          setLoading(false);
          return; // Ya está autenticado con sesión real
        }
        
        // 2. Verificar si hay usuario de Firebase sin integrar con backend
        if (storedUser && !sessionToken) {
          if (storedUser.provider === 'google' || storedUser.token?.includes('firebase_token')) {
            console.log("⚠️ Usuario de Firebase sin sesión backend");
            console.log("🔄 Intentando integrar con backend...");
            
            try {
              // Intentar integrar con backend automáticamente
              await securityService.loginWithFirebase(storedUser);
              console.log("✅ Integración automática completada");
              // El evento authStateChanged manejará la actualización
              setLoading(false);
              return;
            } catch (error) {
              console.warn("⚠️ Integración automática falló, modo Firebase temporal:", error);
              // Continuar con Firebase temporal
              const authUser: AuthUser = {
                ...storedUser,
                provider: 'google' as const
              };
              setCurrentUser(authUser);
              dispatch(setUser(storedUser));
              setLoading(false);
              return;
            }
          }
        }
        
        // 3. Si no hay nada, verificar Firebase activo
        const firebaseUser = await authProviderInstance.getCurrentUser();
        if (firebaseUser) {
          console.log("✅ Usuario de Firebase activo encontrado");
          // 🔥 GUARDAR EN LOCALSTORAGE CON EL NUEVO MANAGER
          UserStorageManager.saveUser(firebaseUser);
          setCurrentUser(firebaseUser);
          dispatch(setUser(firebaseUser));
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    // 🔥 ESCUCHAR CAMBIOS DE AUTENTICACIÓN DESDE SecurityService
    const handleAuthStateChange = (event: any) => {
      console.log("🔄 AuthContext: Detectado cambio de autenticación", event.detail);
      const { user, token } = event.detail;
      const authUser: AuthUser = {
        ...user,
        token: token,
        provider: 'local' as const
      };
      
      // 🔥 GUARDAR CON EL NUEVO MANAGER
      UserStorageManager.saveUser(authUser, token);
      
      setCurrentUser(authUser);
      dispatch(setUser(user));
    };

    window.addEventListener('authStateChanged', handleAuthStateChange);

    // Mostrar instrucciones de configuración en desarrollo
    if (firebaseConfig.apiKey === "TU_API_KEY") {
      console.warn(getFirebaseSetupInstructions());
    }

    initializeAuth();

    // Cleanup
    return () => {
      window.removeEventListener('authStateChanged', handleAuthStateChange);
    };
  }, [dispatch]);

  const signIn = async () => {
    try {
      setLoading(true);
      const result = await authProviderInstance.signIn();
      
      // 🔥 GUARDAR USUARIO INMEDIATAMENTE DESPUÉS DEL LOGIN
      UserStorageManager.saveUser(result.user);
      
      // 🔥 INTEGRACIÓN CON BACKEND: Después del login de Firebase
      try {
        console.log("🔗 Integrando Firebase con backend...");
        await securityService.loginWithFirebase(result.user);
        console.log("✅ Usuario autenticado en backend también");
      } catch (backendError) {
        console.warn("⚠️ Error al integrar con backend, pero Firebase OK:", backendError);
        // Continuar con Firebase aunque backend falle
      }
      
      setCurrentUser(result.user);
      dispatch(setUser(result.user));
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await authProviderInstance.signOut();
      
      // 🔥 LIMPIAR SESIÓN DEL BACKEND Y LOCALSTORAGE
      securityService.logout();
      UserStorageManager.clearUser();
      
      setCurrentUser(null);
      dispatch(setUser(null));
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const refreshAuth = async () => {
    try {
      // 🔥 VERIFICAR AMBOS TIPOS DE AUTENTICACIÓN
      
      // 1. Verificar sesión del backend primero
      const sessionToken = UserStorageManager.getSession();
      const storedUser = UserStorageManager.getUser();
      
      if (sessionToken && storedUser) {
        console.log("🔄 Refrescando sesión del backend");
        // Adaptar usuario del backend al formato AuthUser
        const authUser: AuthUser = {
          ...storedUser,
          token: sessionToken,
          provider: 'local' as const
        };
        setCurrentUser(authUser);
        dispatch(setUser(storedUser));
        return;
      }
      
      // 2. Verificar si hay usuario de Firebase en localStorage (sin session token)
      if (storedUser && !sessionToken) {
        if (storedUser.provider === 'google' || storedUser.token?.includes('firebase_token')) {
          console.log("🔄 Refrescando usuario de Firebase desde localStorage");
          const authUser: AuthUser = {
            ...storedUser,
            provider: 'google' as const
          };
          setCurrentUser(authUser);
          dispatch(setUser(storedUser));
          return;
        }
      }
      
      // 3. Si no hay ninguno, verificar Firebase activo
      const firebaseUser = await authProviderInstance.getCurrentUser();
      if (firebaseUser) {
        // 🔥 GUARDAR EN LOCALSTORAGE SI NO ESTABA
        UserStorageManager.saveUser(firebaseUser);
      }
      setCurrentUser(firebaseUser);
      dispatch(setUser(firebaseUser));
    } catch (error) {
      console.error("Error refreshing auth:", error);
    }
  };

  const value: IAuthContext = {
    currentUser,
    loading,
    isAuthenticated: !!currentUser,
    signIn,
    signOut,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};