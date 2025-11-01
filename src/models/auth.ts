// src/models/auth.ts
// Single Responsibility: Solo modelos relacionados con autenticación

import { User } from "./user";

// Extiende User para incluir información de autenticación
export interface AuthUser extends User {
  token: string;
  refreshToken?: string;
  tokenExpiration?: string;
  provider?: 'google' | 'facebook' | 'local';
}

// Estado de autenticación para el store
export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}