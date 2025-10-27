// src/interfaces/auth.interface.ts
// Interface Segregation Principle: interfaces específicas y pequeñas

import { AuthUser } from "../models/auth";

// Interface base para cualquier proveedor de autenticación
export interface IAuthProvider {
  signIn(): Promise<IAuthResult>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
}

// Interface para el resultado de autenticación
export interface IAuthResult {
  user: AuthUser;
  token: string;
  refreshToken?: string;
}

// Interface para el contexto de autenticación
export interface IAuthContext {
  currentUser: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

// Interface para configuración de Firebase
export interface IFirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string; // opcional para Google Analytics
}

// Interface para manejo de errores de auth
export interface IAuthError {
  code: string;
  message: string;
  details?: any;
}