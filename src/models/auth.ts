// src/models/auth.ts
// Single Responsibility: Solo modelos relacionados con autenticación

import { User } from "./user";

// Extiende User para incluir información de autenticación
export interface AuthUser extends User {
  token: string;
  refreshToken?: string;
  tokenExpiration?: string;
  provider?: 'google' | 'facebook' | 'local' | 'microsoft';
  //  PROPIEDADES ADICIONALES PARA OAUTH
  displayName?: string;    // Para Firebase y Microsoft
  photoURL?: string;       // Para Firebase y Microsoft
  firebase_uid?: string;   // Para Firebase
}

// Estado de autenticación para el store
export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}