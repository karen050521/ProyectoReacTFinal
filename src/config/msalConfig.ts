import { Configuration, PopupRequest } from '@azure/msal-browser';

/**
 * Configuración para Microsoft Authentication Library (MSAL)
 * Documentación: https://github.com/AzureAD/microsoft-authentication-library-for-js
 */

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || '',
    // Usar 'common' para permitir cuentas personales y organizacionales
    // O usar 'consumers' para solo cuentas personales
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: import.meta.env.VITE_MICROSOFT_REDIRECT_URI || 'http://localhost:5173/auth/callback',
    postLogoutRedirectUri: import.meta.env.VITE_MICROSOFT_LOGOUT_URI || 'http://localhost:5173',
    // NO usar client secret en aplicaciones SPA (solo para backend)
  },
  cache: {
    cacheLocation: 'sessionStorage', // Opciones: 'sessionStorage' o 'localStorage'
    storeAuthStateInCookie: false, // Cambiar a true si hay problemas con IE11 o Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case 0: // LogLevel.Error
            console.error(message);
            return;
          case 1: // LogLevel.Warning
            console.warn(message);
            return;
          case 2: // LogLevel.Info
            console.info(message);
            return;
          case 3: // LogLevel.Verbose
            console.debug(message);
            return;
        }
      },
    },
  },
};

/**
 * Scopes (permisos) que solicitaremos al usuario
 * Más info: https://docs.microsoft.com/en-us/graph/permissions-reference
 */
export const loginRequest: PopupRequest = {
  scopes: ['User.Read', 'openid', 'profile', 'email'],
};

/**
 * Endpoint de Microsoft Graph API
 */
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
  graphMePhotoEndpoint: 'https://graph.microsoft.com/v1.0/me/photo/$value',
};
