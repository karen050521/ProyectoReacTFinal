import { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { useDispatch } from 'react-redux';
import { setAuthenticated, setUserData, setUserPhoto } from '../../store/microsoftAuthSlice';
import { callMsGraph, getUserPhoto } from '../../services/microsoftGraphService';

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
          
          // Actualizar Redux
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
