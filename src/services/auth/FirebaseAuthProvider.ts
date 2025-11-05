// src/services/auth/FirebaseAuthProvider.ts
import { IAuthProvider, IAuthResult, IFirebaseConfig, IAuthError } from "../../interfaces/auth.interface";
import { AuthUser } from "../../models/auth";
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, User as FirebaseUser } from "firebase/auth";
import { isFirebaseConfigured } from "../../config/firebase.config";
import { UserStorageManager } from "../../utils/userStorageManager";

export class FirebaseAuthProvider implements IAuthProvider {
  private config: IFirebaseConfig;
  private isInitialized: boolean = false;
  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;
  private provider: GoogleAuthProvider | null = null;

  constructor(config: IFirebaseConfig) {
    this.config = config;
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      if (!isFirebaseConfigured()) {
        console.warn("Firebase no configurado. Usando modo desarrollo.");
        this.isInitialized = true;
        return;
      }

      this.app = initializeApp(this.config);
      this.auth = getAuth(this.app);
      this.provider = new GoogleAuthProvider();

      // CONFIGURACIÓN MEJORADA para asegurar que obtenemos email
      this.provider.addScope("email");
      this.provider.addScope("profile");
      
      // IMPORTANTE: Forzar selección de cuenta para obtener datos frescos
      this.provider.setCustomParameters({
        prompt: 'select_account'
      });

      this.isInitialized = true;
      console.log("Firebase initialized successfully");
    } catch (error) {
      console.error("Firebase initialization failed:", error);
      throw this.createAuthError("FIREBASE_INIT_ERROR", "Failed to initialize Firebase", error);
    }
  }

  async signIn(): Promise<IAuthResult> {
    await this.initialize();

    try {
      if (!isFirebaseConfigured() || !this.auth || !this.provider) {
        console.warn("Using development auth (Firebase not configured)");
        return this.createTemporaryAuthResult();
      }

      console.log("Signing in with Google...");
      const result = await signInWithPopup(this.auth, this.provider);
      const firebaseUser = result.user;

      // VERIFICACIÓN INICIAL: Revisar si tenemos datos básicos
      console.log("Datos inmediatos después del signIn:", {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        emailVerified: firebaseUser.emailVerified
      });

      // Si no hay email, esperar un momento y recargar el usuario
      if (!firebaseUser.email) {
        console.warn("Email no disponible inmediatamente, recargando usuario...");
        await firebaseUser.reload();
        console.log("Datos después de reload:", {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          emailVerified: firebaseUser.emailVerified
        });
      }

      // Espera el token real del usuario
      const token = await firebaseUser.getIdToken();

      return this.mapFirebaseUserToAuthResult(firebaseUser, token);

    } catch (error: any) {
      console.error("Sign in failed:", error);

      if (error.code === "auth/popup-cancelled-by-user") {
        throw this.createAuthError("USER_CANCELLED", "Sign in was cancelled by user", error);
      }

      throw this.createAuthError("SIGN_IN_ERROR", "Failed to sign in with Google", error);
    }
  }

  async signOut(): Promise<void> {
    await this.initialize();

    try {
      if (!isFirebaseConfigured() || !this.auth) {
        console.warn("Using development sign out (Firebase not configured)");
        localStorage.removeItem("user");
        return;
      }

      await firebaseSignOut(this.auth);
      localStorage.removeItem("user");
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Sign out failed:", error);
      throw this.createAuthError("SIGN_OUT_ERROR", "Failed to sign out", error);
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    await this.initialize();

    try {
      if (!isFirebaseConfigured() || !this.auth) {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
      }

      const firebaseUser = this.auth.currentUser;
      if (!firebaseUser) return null;

      const token = await firebaseUser.getIdToken();

      return this.mapFirebaseUserToUser(firebaseUser, token);
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  // =================== Helpers ===================

  private createAuthError(code: string, message: string, details?: any): IAuthError {
    return { code, message, details };
  }

  private createTemporaryAuthResult(): IAuthResult {
    const user: AuthUser = {
      id: Date.now(),
      name: "Usuario de Desarrollo",
      email: "dev@example.com",
      token: `temp_token_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      provider: "google",
    };

    // 🔥 USAR UserStorageManager EN LUGAR DE ESCRIBIR DIRECTAMENTE
    UserStorageManager.saveUser(user);

    return {
      user,
      token: user.token,
      refreshToken: `refresh_${Date.now()}`,
    };
  }

  private mapFirebaseUserToAuthResult(firebaseUser: FirebaseUser, token: string): IAuthResult {
    // DEBUG: Agregar logs para ver qué datos tenemos
    console.log("DEBUG Firebase User Data:", {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      emailVerified: firebaseUser.emailVerified,
      providerData: firebaseUser.providerData
    });

    // Intentar obtener email de diferentes fuentes
    let userEmail = firebaseUser.email;
    
    // Si no hay email principal, intentar obtenerlo de providerData
    if (!userEmail && firebaseUser.providerData && firebaseUser.providerData.length > 0) {
      const googleProvider = firebaseUser.providerData.find(p => p.providerId === 'google.com');
      if (googleProvider && googleProvider.email) {
        userEmail = googleProvider.email;
        console.log("Email obtenido de providerData:", userEmail);
      }
    }

    // VALIDACIÓN: Si aún no hay email, esto es un problema serio
    if (!userEmail) {
      console.error("CRÍTICO: No se pudo obtener email del usuario Firebase");
      console.error("FirebaseUser completo:", firebaseUser);
      throw this.createAuthError("NO_EMAIL", "No se pudo obtener el email del usuario", firebaseUser);
    }

    const user: AuthUser = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || "Usuario Sin Nombre",
      email: userEmail,
      token,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      provider: "google",
    };

    // DEBUG: Ver qué usuario final se está creando
    console.log("DEBUG AuthUser creado:", user);

    // 🔥 USAR UserStorageManager EN LUGAR DE ESCRIBIR DIRECTAMENTE
    UserStorageManager.saveUser(user);

    return {
      user,
      token,
      refreshToken: `refresh_${Date.now()}`,
    };
  }

  private mapFirebaseUserToUser(firebaseUser: FirebaseUser, token: string): AuthUser {
    // DEBUG: Logs para getCurrentUser
    console.log("DEBUG Firebase User (getCurrentUser):", {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      emailVerified: firebaseUser.emailVerified
    });

    // Intentar obtener email de diferentes fuentes
    let userEmail = firebaseUser.email;
    
    if (!userEmail && firebaseUser.providerData && firebaseUser.providerData.length > 0) {
      const googleProvider = firebaseUser.providerData.find(p => p.providerId === 'google.com');
      if (googleProvider && googleProvider.email) {
        userEmail = googleProvider.email;
        console.log("Email obtenido de providerData (getCurrentUser):", userEmail);
      }
    }

    return {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || "Usuario Sin Nombre",
      email: userEmail || "",
      token,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      provider: "google",
    };
  }
}
