import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-[#359E39] p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10 dark:bg-black/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-white/10 dark:bg-black/10 blur-3xl"></div>
        
        <div className="relative z-10 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-lg shadow-xl">
              <svg className="fill-white dark:fill-black" width="48" height="48" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
              </svg>
            </div>
          </div>
          
          <h1 className="mb-4 text-5xl font-extrabold text-white dark:text-black drop-shadow-lg">
            Sistema de Seguridad
          </h1>
          <p className="mb-8 text-xl text-white/90 dark:text-black/90 font-light max-w-2xl mx-auto">
            Gestión integral de usuarios, roles y permisos con tecnología ReactJS
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate('/users')}
              className="rounded-lg bg-white dark:bg-black px-8 py-3 font-semibold text-[#1E3A8A] dark:text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Ver Usuarios
            </button>
            <button
              onClick={() => navigate('/roles')}
              className="rounded-lg bg-white/10 dark:bg-black/10 backdrop-blur-sm border-2 border-white dark:border-black px-8 py-3 font-semibold text-white dark:text-black hover:bg-white/20 dark:hover:bg-black/20 transform hover:-translate-y-1 transition-all duration-200"
            >
              Gestionar Roles
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group rounded-xl bg-white dark:bg-boxdark p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-stroke dark:border-strokedark cursor-pointer transform hover:-translate-y-2">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#359E39]/10 group-hover:bg-[#359E39]/20 transition-colors">
            <svg className="fill-[#359E39]" width="28" height="28" viewBox="0 0 24 24">
              <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" />
            </svg>
          </div>
          <h3 className="mb-2 text-2xl font-bold text-black dark:text-white">Usuarios</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Control total de accesos</p>
        </div>

        <div className="group rounded-xl bg-white dark:bg-boxdark p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-stroke dark:border-strokedark cursor-pointer transform hover:-translate-y-2">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1E3A8A]/10 group-hover:bg-[#1E3A8A]/20 transition-colors">
            <svg className="fill-[#1E3A8A]" width="28" height="28" viewBox="0 0 24 24">
              <path d="M12 2L2 7V12C2 16.55 5.84 20.74 12 22C18.16 20.74 22 16.55 22 12V7L12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
            </svg>
          </div>
          <h3 className="mb-2 text-2xl font-bold text-black dark:text-white">Roles</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Permisos personalizados</p>
        </div>

        <div className="group rounded-xl bg-white dark:bg-boxdark p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-stroke dark:border-strokedark cursor-pointer transform hover:-translate-y-2">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#2563EB]/10 group-hover:bg-[#2563EB]/20 transition-colors">
            <svg className="fill-[#2563EB]" width="28" height="28" viewBox="0 0 24 24">
              <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" />
            </svg>
          </div>
          <h3 className="mb-2 text-2xl font-bold text-black dark:text-white">Sesiones</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Monitoreo en tiempo real</p>
        </div>

        <div className="group rounded-xl bg-white dark:bg-boxdark p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-stroke dark:border-strokedark cursor-pointer transform hover:-translate-y-2">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#9CA3AF]/10 group-hover:bg-[#9CA3AF]/20 transition-colors">
            <svg className="fill-[#9CA3AF]" width="28" height="28" viewBox="0 0 24 24">
              <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM9 8V6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8H9Z" />
            </svg>
          </div>
          <h3 className="mb-2 text-2xl font-bold text-black dark:text-white">Seguridad</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Encriptación avanzada</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Modern Design Card */}
        <div className="rounded-xl bg-gradient-to-br from-[#359E39]/5 to-[#359E39]/10 p-8 border border-[#359E39]/20">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#359E39] shadow-lg">
              <svg className="fill-white" width="32" height="32" viewBox="0 0 24 24">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM14 17H7V15H14V17ZM17 13H7V11H17V13ZM17 9H7V7H17V9Z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-black dark:text-white">Interfaz Moderna</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Diseño intuitivo y responsive</p>
            </div>
          </div>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <svg className="fill-[#359E39] flex-shrink-0" width="20" height="20" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
              </svg>
              <span>Componentes reutilizables</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <svg className="fill-[#359E39] flex-shrink-0" width="20" height="20" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
              </svg>
              <span>Modo claro/oscuro automático</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <svg className="fill-[#359E39] flex-shrink-0" width="20" height="20" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
              </svg>
              <span>Experiencia fluida en todos los dispositivos</span>
            </li>
          </ul>
        </div>

        {/* Security Features Card */}
        <div className="rounded-xl bg-gradient-to-br from-[#1E3A8A]/5 to-[#2563EB]/10 p-8 border border-[#1E3A8A]/20">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1E3A8A] shadow-lg">
              <svg className="fill-white" width="32" height="32" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-black dark:text-white">Máxima Seguridad</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Protección empresarial</p>
            </div>
          </div>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <svg className="fill-[#1E3A8A] flex-shrink-0" width="20" height="20" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
              </svg>
              <span>Encriptación de extremo a extremo</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <svg className="fill-[#1E3A8A] flex-shrink-0" width="20" height="20" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
              </svg>
              <span>Autenticación multifactor</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <svg className="fill-[#1E3A8A] flex-shrink-0" width="20" height="20" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
              </svg>
              <span>Auditoría completa de accesos</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl bg-white dark:bg-boxdark p-8 shadow-md border border-stroke dark:border-strokedark">
        <h3 className="mb-6 text-2xl font-bold text-black dark:text-white text-center">
          Acceso Rápido
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/users')}
            className="group flex flex-col items-center gap-3 rounded-xl bg-gray-50 dark:bg-boxdark-2 p-6 hover:bg-[#359E39]/10 dark:hover:bg-[#359E39]/20 transition-all duration-200 border border-transparent hover:border-[#359E39]"
          >
            <svg className="fill-[#359E39] group-hover:scale-110 transition-transform" width="32" height="32" viewBox="0 0 24 24">
              <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" />
            </svg>
            <span className="text-sm font-semibold text-black dark:text-white">Usuarios</span>
          </button>

          <button
            onClick={() => navigate('/roles')}
            className="group flex flex-col items-center gap-3 rounded-xl bg-gray-50 dark:bg-boxdark-2 p-6 hover:bg-[#1E3A8A]/10 dark:hover:bg-[#1E3A8A]/20 transition-all duration-200 border border-transparent hover:border-[#1E3A8A]"
          >
            <svg className="fill-[#1E3A8A] group-hover:scale-110 transition-transform" width="32" height="32" viewBox="0 0 24 24">
              <path d="M12 2L2 7V12C2 16.55 5.84 20.74 12 22C18.16 20.74 22 16.55 22 12V7L12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
            </svg>
            <span className="text-sm font-semibold text-black dark:text-white">Roles</span>
          </button>

          <button
            onClick={() => navigate('/permissions')}
            className="group flex flex-col items-center gap-3 rounded-xl bg-gray-50 dark:bg-boxdark-2 p-6 hover:bg-[#2563EB]/10 dark:hover:bg-[#2563EB]/20 transition-all duration-200 border border-transparent hover:border-[#2563EB]"
          >
            <svg className="fill-[#2563EB] group-hover:scale-110 transition-transform" width="32" height="32" viewBox="0 0 24 24">
              <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM9 8V6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8H9Z" />
            </svg>
            <span className="text-sm font-semibold text-black dark:text-white">Permisos</span>
          </button>

          <button
            onClick={() => navigate('/sessions')}
            className="group flex flex-col items-center gap-3 rounded-xl bg-gray-50 dark:bg-boxdark-2 p-6 hover:bg-[#9CA3AF]/10 dark:hover:bg-[#9CA3AF]/20 transition-all duration-200 border border-transparent hover:border-[#9CA3AF]"
          >
            <svg className="fill-[#9CA3AF] group-hover:scale-110 transition-transform" width="32" height="32" viewBox="0 0 24 24">
              <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" />
            </svg>
            <span className="text-sm font-semibold text-black dark:text-white">Sesiones</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
