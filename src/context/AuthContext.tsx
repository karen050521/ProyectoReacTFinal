import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import { IAuthContext, IAuthProvider } from "../interfaces/auth.interface";
import { AuthUser } from "../models/auth";
import { FirebaseAuthProvider } from "../services/auth/FirebaseAuthProvider";
import { firebaseConfig, getFirebaseSetupInstructions } from "../config/firebase.config";
import securityService from "../services/securityService";

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
        const user = await authProviderInstance.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          dispatch(setUser(user)); // Sync with Redux
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    // Mostrar instrucciones de configuración en desarrollo
    if (firebaseConfig.apiKey === "TU_API_KEY") {
      console.warn(getFirebaseSetupInstructions());
    }

    initializeAuth();
  }, [dispatch]);

  const signIn = async () => {
    try {
      setLoading(true);
      const result = await authProviderInstance.signIn();
      
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
      
      // 🔥 LIMPIAR SESIÓN DEL BACKEND TAMBIÉN
      securityService.logout();
      
      setCurrentUser(null);
      dispatch(setUser(null));
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const refreshAuth = async () => {
    try {
      const user = await authProviderInstance.getCurrentUser();
      setCurrentUser(user);
      dispatch(setUser(user));
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