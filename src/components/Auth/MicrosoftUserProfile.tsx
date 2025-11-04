import { useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { callMsGraph, getUserPhoto, MicrosoftUser } from '../../services/microsoftGraphService';
import toast from 'react-hot-toast';

/**
 * Componente que muestra información del usuario autenticado con Microsoft
 */
const MicrosoftUserProfile = () => {
  const { instance, accounts } = useMsal();
  const [userData, setUserData] = useState<MicrosoftUser | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (accounts.length > 0) {
      fetchUserData();
    }
  }, [accounts]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const account = accounts[0];
      
      // Obtener token de acceso
      const response = await instance.acquireTokenSilent({
        scopes: ['User.Read'],
        account: account,
      });

      // Obtener datos del usuario
      const userData = await callMsGraph(response.accessToken);
      setUserData(userData);

      // Obtener foto del usuario
      const photo = await getUserPhoto(response.accessToken);
      setUserPhoto(photo);
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      toast.error('Error al cargar información del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await instance.logoutPopup();
      setUserData(null);
      setUserPhoto(null);
      toast.success('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          Perfil de Microsoft
        </h3>
      </div>
      <div className="p-7">
        <div className="mb-5.5 flex items-center gap-5">
          {/* Foto de perfil */}
          <div className="h-20 w-20 rounded-full overflow-hidden">
            {userPhoto ? (
              <img
                src={userPhoto}
                alt={userData.displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary text-white text-2xl font-bold">
                {userData.givenName?.[0]}{userData.surname?.[0]}
              </div>
            )}
          </div>

          {/* Información básica */}
          <div>
            <h4 className="text-lg font-semibold text-black dark:text-white">
              {userData.displayName}
            </h4>
            <p className="text-sm text-body">{userData.mail}</p>
            {userData.jobTitle && (
              <p className="text-sm text-body">{userData.jobTitle}</p>
            )}
          </div>
        </div>

        {/* Detalles completos */}
        <div className="space-y-3">
          <div>
            <span className="mb-1 block text-sm font-medium text-black dark:text-white">
              Nombre completo
            </span>
            <p className="text-sm text-body">
              {userData.givenName} {userData.surname}
            </p>
          </div>

          <div>
            <span className="mb-1 block text-sm font-medium text-black dark:text-white">
              Email
            </span>
            <p className="text-sm text-body">{userData.userPrincipalName}</p>
          </div>

          {userData.officeLocation && (
            <div>
              <span className="mb-1 block text-sm font-medium text-black dark:text-white">
                Ubicación
              </span>
              <p className="text-sm text-body">{userData.officeLocation}</p>
            </div>
          )}

          {userData.mobilePhone && (
            <div>
              <span className="mb-1 block text-sm font-medium text-black dark:text-white">
                Teléfono móvil
              </span>
              <p className="text-sm text-body">{userData.mobilePhone}</p>
            </div>
          )}
        </div>

        {/* Botón de cerrar sesión */}
        <button
          onClick={handleLogout}
          className="mt-5 inline-flex items-center justify-center rounded-md bg-meta-1 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default MicrosoftUserProfile;
