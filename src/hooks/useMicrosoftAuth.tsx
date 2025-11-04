import { useEffect, useState } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { callMsGraph, MicrosoftUser } from '../services/microsoftGraphService';

/**
 * Hook personalizado para manejar la autenticación de Microsoft
 * y obtener los datos del usuario
 */
export const useMicrosoftAuth = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [userData, setUserData] = useState<MicrosoftUser | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && accounts.length > 0) {
      fetchUserData();
    }
  }, [isAuthenticated, accounts]);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const account = accounts[0];
      
      // Obtener token de acceso
      const response = await instance.acquireTokenSilent({
        scopes: ['User.Read'],
        account: account,
      });

      // Obtener datos del usuario desde Microsoft Graph
      const userData = await callMsGraph(response.accessToken);
      setUserData(userData);

      // Intentar obtener foto del usuario
      try {
        const { getUserPhoto } = await import('../services/microsoftGraphService');
        const photo = await getUserPhoto(response.accessToken);
        setUserPhoto(photo);
      } catch (photoError) {
        console.warn('No se pudo obtener la foto del usuario:', photoError);
      }
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      setError('Error al cargar información del usuario');
    } finally {
      setLoading(false);
    }
  };

  // Datos básicos del account (disponibles inmediatamente)
  const accountInfo = accounts[0] || null;

  return {
    isAuthenticated,
    userData,
    userPhoto,
    accountInfo,
    loading,
    error,
    instance,
    accounts,
  };
};
