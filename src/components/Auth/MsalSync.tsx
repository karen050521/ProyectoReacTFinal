import { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { useDispatch } from 'react-redux';
import { setAuthenticated, setUserData, setUserPhoto } from '../../store/microsoftAuthSlice';
import { callMsGraph, getUserPhoto } from '../../services/microsoftGraphService';
import securityService from '../../services/securityService';

/**
 * Componente que sincroniza el estado de MSAL con Redux al cargar la aplicación
 */
const MsalSync = ({ children }: { children: React.ReactNode }) => {
  const { instance, accounts } = useMsal();
  const dispatch = useDispatch();

  useEffect(() => {
    const syncMsalToRedux = async () => {
      if (accounts.length > 0) {
        console.log('Sincronizando datos de MSAL con Redux...');
        
        try {
          const account = accounts[0];
          
          // Obtener token de acceso
          const tokenResponse = await instance.acquireTokenSilent({
            scopes: ['User.Read'],
            account: account,
          });

          // Obtener datos del usuario desde Microsoft Graph
          const userData = await callMsGraph(tokenResponse.accessToken);
          
          // Normalizar usuario para AuthProvider
          const normalizedUser = {
            id: userData.id,
            displayName: userData.displayName,
            email: userData.mail ?? userData.userPrincipalName,
            givenName: userData.givenName,
            surname: userData.surname,
            userPrincipalName: userData.userPrincipalName,
            jobTitle: userData.jobTitle,
            officeLocation: userData.officeLocation,
            mobilePhone: userData.mobilePhone,
            provider: 'microsoft', // Identificar el proveedor
            token: tokenResponse.accessToken,
          };
          
          // Actualizar Redux (mantener funcionalidad existente)
          dispatch(setAuthenticated(true));
          dispatch(setUserData({
            id: userData.id,
            displayName: userData.displayName,
            email: userData.mail,
            givenName: userData.givenName,
            surname: userData.surname,
            userPrincipalName: userData.userPrincipalName,
            jobTitle: userData.jobTitle,
            officeLocation: userData.officeLocation,
            mobilePhone: userData.mobilePhone,
          }));

          // 🔥 INTEGRACIÓN CON BACKEND: Después del login de Microsoft
          try {
            console.log("🔗 Integrando Microsoft con backend...");
            await securityService.loginWithMicrosoft(normalizedUser);
            console.log("✅ Usuario autenticado en backend también");
          } catch (backendError) {
            console.warn("⚠️ Error al integrar con backend, pero Microsoft OK:", backendError);
            // Continuar con Microsoft aunque backend falle
            // Emitir evento manual si backend falla
            window.dispatchEvent(new CustomEvent('authStateChanged', {
              detail: {
                user: normalizedUser,
                token: tokenResponse.accessToken
              }
            }));
          }

          console.log('🔄 MsalSync: Sincronización Microsoft completada');

          // Intentar obtener la foto del usuario
          try {
            const photo = await getUserPhoto(tokenResponse.accessToken);
            if (photo) {
              dispatch(setUserPhoto(photo));
            }
          } catch (photoError) {
            console.warn('No se pudo obtener la foto del usuario');
          }

          console.log('Sincronización completada');
        } catch (error) {
          console.error('Error al sincronizar datos:', error);
        }
      }
    };

    syncMsalToRedux();
  }, [accounts, instance, dispatch]);

  return <>{children}</>;
};

export default MsalSync;
