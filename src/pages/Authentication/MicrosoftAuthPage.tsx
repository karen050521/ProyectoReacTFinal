import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import MicrosoftLoginButton from '../../components/Auth/MicrosoftLoginButton';
import MicrosoftUserProfile from '../../components/Auth/MicrosoftUserProfile';
import Breadcrumb from '../../components/Breadcrumb';
/**
 * Página de prueba para autenticación con Microsoft OAuth
 */
const MicrosoftAuthPage = () => {
  const isAuthenticated = useIsAuthenticated();
  const { accounts } = useMsal();

  return (
    <>
      <Breadcrumb pageName="Autenticación Microsoft" />

      <div className="grid grid-cols-1 gap-9">
        {/* Card de bienvenida */}
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                {isAuthenticated ? '¡Bienvenido!' : 'Iniciar Sesión'}
              </h3>
            </div>
            <div className="p-6.5">
              {!isAuthenticated ? (
                <div className="space-y-4">
                  <p className="text-body">
                    Inicia sesión con tu cuenta de Microsoft para acceder a todas las funcionalidades de la aplicación.
                  </p>
                  <MicrosoftLoginButton />
                  
                  <div className="mt-4 rounded-md bg-primary/10 p-4">
                    <h4 className="mb-2 font-semibold text-black dark:text-white">
                      ℹ️ Información
                    </h4>
                    <ul className="list-inside list-disc space-y-1 text-sm text-body">
                      <li>Utiliza tu cuenta corporativa o personal de Microsoft</li>
                      <li>La autenticación es segura mediante OAuth 2.0</li>
                      <li>Solo solicitamos permisos básicos de lectura de perfil</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-md bg-success/10 p-4">
                    <p className="text-success">
                      ✓ Autenticado exitosamente como{' '}
                      <strong>{accounts[0]?.name}</strong>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Perfil del usuario (solo si está autenticado) */}
        {isAuthenticated && (
          <div className="flex flex-col gap-9">
            <MicrosoftUserProfile />
          </div>
        )}

        {/* Card de información técnica */}
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Información Técnica
              </h3>
            </div>
            <div className="p-6.5">
              <div className="space-y-3">
                <div>
                  <span className="mb-1 block text-sm font-medium text-black dark:text-white">
                    Estado de autenticación
                  </span>
                  <p className="text-sm text-body">
                    {isAuthenticated ? '🟢 Autenticado' : '🔴 No autenticado'}
                  </p>
                </div>

                <div>
                  <span className="mb-1 block text-sm font-medium text-black dark:text-white">
                    Número de cuentas activas
                  </span>
                  <p className="text-sm text-body">{accounts.length}</p>
                </div>

                {accounts.length > 0 && (
                  <>
                    <div>
                      <span className="mb-1 block text-sm font-medium text-black dark:text-white">
                        Tipo de cuenta
                      </span>
                      <p className="text-sm text-body">
                        {accounts[0]?.idTokenClaims?.['tid'] ? 'Azure AD' : 'Personal'}
                      </p>
                    </div>

                    <div>
                      <span className="mb-1 block text-sm font-medium text-black dark:text-white">
                        Username
                      </span>
                      <p className="text-sm text-body break-all">
                        {accounts[0]?.username}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MicrosoftAuthPage;
