import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../../config/msalConfig';
import toast from 'react-hot-toast';

/**
 * Componente para el botón de inicio de sesión con Microsoft
 */
const MicrosoftLoginButton = () => {
  const { instance } = useMsal();

  const handleLogin = async () => {
    try {
      // Opción 1: Login con Popup (más común en aplicaciones SPA)
      const response = await instance.loginPopup(loginRequest);
      console.log('Login exitoso:', response);
      toast.success('¡Inicio de sesión exitoso!');
      
      // Aquí puedes redirigir al usuario o guardar datos en Redux
      // window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error en el login:', error);
      toast.error('Error al iniciar sesión con Microsoft');
    }
  };


  return (
    <div className="flex flex-col gap-4">
      {/* Botón con Popup */}
      <button
        onClick={handleLogin}
        className="flex items-center justify-center gap-3 rounded-lg border border-stroke bg-white p-4 hover:bg-gray-2 dark:border-strokedark dark:bg-boxdark dark:hover:bg-meta-4"
      >
        <span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 21 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 0H0V10H10V0Z" fill="#F25022" />
            <path d="M21 0H11V10H21V0Z" fill="#7FBA00" />
            <path d="M10 11H0V21H10V11Z" fill="#00A4EF" />
            <path d="M21 11H11V21H21V11Z" fill="#FFB900" />
          </svg>
        </span>
        Iniciar sesión con Microsoft
      </button>

   
    </div>
  );
};

export default MicrosoftLoginButton;
