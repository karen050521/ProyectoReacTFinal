import { AuthUser } from "../models/auth";

/**
 * Utilidades para el manejo centralizado del almacenamiento de usuarios
 */
export class UserStorageManager {
  private static readonly USER_KEY = "user";
  private static readonly SESSION_KEY = "session";

  /**
   * Guarda el usuario en localStorage con un formato estandarizado
   */
  static saveUser(user: AuthUser, token?: string): void {
    try {
      const userToStore = {
        id: user.id,
        email: user.email,
        name: user.name || user.displayName,
        displayName: user.displayName,
        photoURL: user.photoURL,
        provider: user.provider,
        token: token || user.token,
        // Agregar timestamp para debugging
        lastSaved: new Date().toISOString()
      };

      localStorage.setItem(this.USER_KEY, JSON.stringify(userToStore));
      
      if (token) {
        localStorage.setItem(this.SESSION_KEY, token);
      }

      console.log("✅ Usuario guardado en localStorage:", userToStore);
    } catch (error) {
      console.error("❌ Error guardando usuario en localStorage:", error);
    }
  }

  /**
   * Obtiene el usuario desde localStorage
   */
  static getUser(): AuthUser | null {
    try {
      const userData = localStorage.getItem(this.USER_KEY);
      if (!userData) {
        return null;
      }

      const user = JSON.parse(userData);
      console.log("📖 Usuario leído desde localStorage:", user);
      return user;
    } catch (error) {
      console.error("❌ Error leyendo usuario desde localStorage:", error);
      return null;
    }
  }

  /**
   * Obtiene el token de sesión
   */
  static getSession(): string | null {
    return localStorage.getItem(this.SESSION_KEY);
  }

  /**
   * Limpia toda la información de usuario
   */
  static clearUser(): void {
    try {
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.SESSION_KEY);
      console.log("🧹 Usuario eliminado de localStorage");
    } catch (error) {
      console.error("❌ Error limpiando localStorage:", error);
    }
  }

  /**
   * Actualiza el usuario existente (merge)
   */
  static updateUser(updates: Partial<AuthUser>): void {
    try {
      const currentUser = this.getUser();
      if (!currentUser) {
        console.warn("⚠️ No hay usuario para actualizar");
        return;
      }

      const updatedUser = { ...currentUser, ...updates };
      this.saveUser(updatedUser);
    } catch (error) {
      console.error("❌ Error actualizando usuario:", error);
    }
  }

  /**
   * Verifica si hay un usuario autenticado válido
   */
  static hasValidUser(): boolean {
    const user = this.getUser();
    return !!(user && user.email);
  }

  /**
   * Debug: muestra toda la información de localStorage
   */
  static debugInfo(): void {
    console.log("🔍 Debug LocalStorage:", {
      user: localStorage.getItem(this.USER_KEY),
      session: localStorage.getItem(this.SESSION_KEY),
      hasValidUser: this.hasValidUser(),
      timestamp: new Date().toISOString()
    });
  }
}