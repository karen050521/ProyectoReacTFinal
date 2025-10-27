// src/services/auth/FirebaseAuthProvider.ts
// Single Responsibility: Solo maneja autenticación con Firebase
// Dependency Inversion: Implementa interface IAuthProvider

import { IAuthProvider, IAuthResult, IFirebaseConfig, IAuthError } from "../../interfaces/auth.interface";
import { AuthUser } from "../../models/auth";
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, User as FirebaseUser } from "firebase/auth";
import { isFirebaseConfigured } from "../../config/firebase.config";

export class FirebaseAuthProvider implements IAuthProvider {
  private config: IFirebaseConfig;
  private isInitialized: boolean = false;
  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;
  private provider: GoogleAuthProvider | null = null;

  constructor(config: IFirebaseConfig) {
    this.config = config;
  }

  // Lazy initialization para evitar errores si Firebase no está configurado
  private async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Verificar si Firebase está configurado
      if (!isFirebaseConfigured()) {
        console.warn("🔥 Firebase no configurado. Usando modo desarrollo.");
        this.isInitialized = true;
        return;
      }

      // Inicializar Firebase con credenciales reales
      this.app = initializeApp(this.config);
      this.auth = getAuth(this.app);
      this.provider = new GoogleAuthProvider();
      
      // Configurar provider scope adicional
      this.provider.addScope('email');
      this.provider.addScope('profile');
      
      this.isInitialized = true;
      console.log("🔥 Firebase initialized successfully");
    } catch (error) {
      console.error("❌ Firebase initialization failed:", error);
      throw this.createAuthError("FIREBASE_INIT_ERROR", "Failed to initialize Firebase", error);
    }
  }

  async signIn(): Promise<IAuthResult> {
    await this.initialize();

    try {
      // Si Firebase no está configurado, usar stub temporal
      if (!isFirebaseConfigured() || !this.auth || !this.provider) {
        console.warn("🔥 Using development auth (Firebase not configured)");
        return this.createTemporaryAuthResult();
      }

      // Usar Firebase real
      console.log("🔥 Signing in with Google...");
      const result = await signInWithPopup(this.auth, this.provider);
      const firebaseUser = result.user;
      
      return this.mapFirebaseUserToAuthResult(firebaseUser);
      
    } catch (error: any) {
      console.error("❌ Sign in failed:", error);
      
      // Si es error de popup cancelado por el usuario
      if (error.code === 'auth/popup-cancelled-by-user') {
        throw this.createAuthError("USER_CANCELLED", "Sign in was cancelled by user", error);
      }
      
      throw this.createAuthError("SIGN_IN_ERROR", "Failed to sign in with Google", error);
    }
  }

  async signOut(): Promise<void> {
    await this.initialize();

    try {
      // Si Firebase no está configurado, limpiar localStorage
      if (!isFirebaseConfigured() || !this.auth) {
        console.warn("🔥 Using development sign out (Firebase not configured)");
        localStorage.removeItem("user");
        return;
      }

      // Usar Firebase real
      await firebaseSignOut(this.auth);
      localStorage.removeItem("user"); // Limpiar también localStorage
      console.log("🔥 User signed out successfully");
    } catch (error) {
      console.error("❌ Sign out failed:", error);
      throw this.createAuthError("SIGN_OUT_ERROR", "Failed to sign out", error);
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    await this.initialize();

    try {
      // Si Firebase no está configurado, revisar localStorage
      if (!isFirebaseConfigured() || !this.auth) {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
      }

      // Usar Firebase real
      const firebaseUser = this.auth.currentUser;
      if (!firebaseUser) return null;

      return this.mapFirebaseUserToUser(firebaseUser);
      
    } catch (error) {
      console.error("❌ Error getting current user:", error);
      return null;
    }
  }

  // Helper methods (Private - Single Responsibility)
  private createAuthError(code: string, message: string, details?: any): IAuthError {
    return { code, message, details };
  }

  private createTemporaryAuthResult(): IAuthResult {
    const user: AuthUser = {
      id: Date.now(), // Temporal ID
      name: "Usuario de Desarrollo",
      email: "dev@example.com",
      token: `temp_token_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      provider: 'google',
    };

    // Guardar en localStorage para persistencia en desarrollo
    localStorage.setItem("user", JSON.stringify(user));

    return {
      user,
      token: user.token,
      refreshToken: `refresh_${Date.now()}`,
    };
  }

  private mapFirebaseUserToAuthResult(firebaseUser: FirebaseUser): IAuthResult {
    const user: AuthUser = {
      id: Date.now(), // Firebase UID suele ser string, convertir a número
      name: firebaseUser.displayName || "Usuario Sin Nombre",
      email: firebaseUser.email || "",
      token: `firebase_token_${Date.now()}`, // En producción usar getIdToken()
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      provider: 'google',
    };

    // Guardar en localStorage para persistencia
    localStorage.setItem("user", JSON.stringify(user));

    return {
      user,
      token: user.token,
      refreshToken: `refresh_${Date.now()}`,
    };
  }

  private mapFirebaseUserToUser(firebaseUser: FirebaseUser): AuthUser {
    return {
      id: Date.now(), // Firebase UID convertido
      name: firebaseUser.displayName || "Usuario Sin Nombre",
      email: firebaseUser.email || "",
      token: `firebase_token_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      provider: 'google',
    };
  }
}