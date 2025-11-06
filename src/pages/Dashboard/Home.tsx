import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-black dark:text-white mb-3">
          Sistema de Seguridad con ReactJS
        </h2>
        <p className="text-xl text-[#359E39] dark:text-[#359E39] font-semibold mb-4">
          Gestión Integral de Seguridad Empresarial
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          Innovación tecnológica y ciberseguridad al servicio de su organización
        </p>
      </div>

      {/* Project Description - Hero Section */}
      <div className="mb-8 rounded-lg bg-gradient-to-br from-[#359E39]/5 via-[#1E3A8A]/5 to-[#2563EB]/5 p-8 border-l-4 border-[#359E39]">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#359E39] flex-shrink-0">
            <svg className="fill-white" width="32" height="32" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-black dark:text-white mb-2">
              Descripción del Proyecto
            </h3>
            <div className="h-1 w-20 bg-gradient-to-r from-[#359E39] to-[#1E3A8A] rounded-full"></div>
          </div>
        </div>

        <div className="space-y-5">
          <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            El presente proyecto tiene como finalidad desarrollar una{' '}
            <span className="font-bold text-[#1E3A8A] dark:text-[#2563EB]">aplicación frontend moderna basada en ReactJS</span>,
            orientada a la <span className="font-semibold">gestión integral de la seguridad</span> dentro de entornos
            empresariales y arquitecturas de microservicios.
          </p>

          <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            El sistema permitirá <span className="font-semibold">administrar usuarios, roles, permisos y autenticaciones</span> de
            manera eficiente y escalable, asegurando el{' '}
            <span className="text-[#359E39] font-semibold">control de acceso a cada módulo o recurso del ecosistema</span>.
            Además, integrará componentes interactivos, paneles dinámicos y validaciones en tiempo real para ofrecer una
            experiencia intuitiva y segura.
          </p>

          <div className="bg-white dark:bg-boxdark-2 rounded-lg p-6 border border-[#1E3A8A]/20">
            <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              <span className="font-bold text-[#1E3A8A] dark:text-[#2563EB]">Este proyecto refleja el compromiso de nuestra empresa
              con la innovación tecnológica y la ciberseguridad</span>, proporcionando herramientas confiables que fortalecen
              la protección de la información y la gestión de identidades digitales.
            </p>
          </div>

          <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            Nuestro objetivo es consolidar una{' '}
            <span className="font-bold text-[#359E39]">plataforma robusta, flexible y alineada con las mejores prácticas
            del desarrollo web moderno</span>, garantizando seguridad, escalabilidad y una experiencia de usuario excepcional.
          </p>
        </div>

        {/* Technical Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-300 dark:border-gray-600">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#359E39] flex-shrink-0">
              <svg className="fill-white" width="20" height="20" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-black dark:text-white mb-1">ReactJS Moderno</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Framework líder con componentes reutilizables y arquitectura escalable
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1E3A8A] dark:bg-[#2563EB] flex-shrink-0">
              <svg className="fill-white" width="20" height="20" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-black dark:text-white mb-1">Microservicios</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Arquitectura distribuida para máxima flexibilidad y rendimiento
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#359E39] flex-shrink-0">
              <svg className="fill-white" width="20" height="20" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-black dark:text-white mb-1">Control de Acceso</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sistema RBAC con gestión granular de permisos y roles
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1E3A8A] dark:bg-[#2563EB] flex-shrink-0">
              <svg className="fill-white" width="20" height="20" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-black dark:text-white mb-1">Tiempo Real</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Validaciones instantáneas y actualizaciones dinámicas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Grid */}
      <div className="mb-8">
        <h3 className="mb-4 text-2xl font-bold text-black dark:text-white">
          Módulos del Sistema
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {/* Users Module */}
          <div className="rounded-lg border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark-2">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#359E39]/10">
              <svg className="fill-[#359E39]" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" />
              </svg>
            </div>
            <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
              Gestión de Usuarios
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Administre perfiles completos de usuarios con información detallada: datos personales,
              direcciones, contraseñas encriptadas y estados de cuenta activos/inactivos.
            </p>
          </div>

          {/* Roles Module */}
          <div className="rounded-lg border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark-2">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1E3A8A]/10">
              <svg className="fill-[#1E3A8A]" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7V12C2 16.55 5.84 20.74 12 22C18.16 20.74 22 16.55 22 12V7L12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
              </svg>
            </div>
            <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
              Roles y Permisos
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sistema jerárquico de roles con asignación granular de permisos. Defina quién puede
              acceder a qué recursos con control basado en roles (RBAC).
            </p>
          </div>

          {/* Sessions Module */}
          <div className="rounded-lg border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark-2">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#2563EB]/10">
              <svg className="fill-[#2563EB]" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" />
              </svg>
            </div>
            <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
              Control de Sesiones
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Monitoreo en tiempo real de sesiones activas, historial de accesos y cierre
              automático por inactividad para máxima seguridad.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-8">
        <h3 className="mb-4 text-2xl font-bold text-black dark:text-white">
          Funcionalidades Principales
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3 rounded-lg border border-stroke p-4 dark:border-strokedark">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#359E39]/10">
              <svg className="fill-[#359E39]" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM9 8V6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8H9Z" />
              </svg>
            </div>
            <div>
              <h4 className="mb-1 font-semibold text-black dark:text-white">Gestión de Contraseñas</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Políticas de contraseñas robustas con encriptación SHA-256 y recuperación segura
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-stroke p-4 dark:border-strokedark">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1E3A8A]/10">
              <svg className="fill-[#1E3A8A]" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" />
              </svg>
            </div>
            <div>
              <h4 className="mb-1 font-semibold text-black dark:text-white">Gestión de Direcciones</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Registro completo de ubicaciones físicas asociadas a cada usuario del sistema
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-stroke p-4 dark:border-strokedark">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB]/10">
              <svg className="fill-[#2563EB]" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM14 17H7V15H14V17ZM17 13H7V11H17V13ZM17 9H7V7H17V9Z" />
              </svg>
            </div>
            <div>
              <h4 className="mb-1 font-semibold text-black dark:text-white">Auditoría Completa</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Registro detallado de todas las operaciones con trazabilidad temporal completa
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-stroke p-4 dark:border-strokedark">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9CA3AF]/10">
              <svg className="fill-[#9CA3AF]" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C2.89 6 2.01 6.89 2.01 8L2 19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM10 4H14V6H10V4ZM20 19H4V8H20V19Z" />
              </svg>
            </div>
            <div>
              <h4 className="mb-1 font-semibold text-black dark:text-white">Perfiles Personalizados</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configuración de perfiles de acceso adaptados a las necesidades de cada organización
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Benefits */}
      <div className="mb-8">
        <h3 className="mb-4 text-2xl font-bold text-black dark:text-white">
          Beneficios de Seguridad
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-[#359E39]/5 p-5 border border-[#359E39]/20">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#359E39]">
                <svg className="fill-white" width="16" height="16" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
                </svg>
              </div>
              <h4 className="font-semibold text-black dark:text-white">Encriptación Avanzada</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Todas las contraseñas y datos sensibles están protegidos con algoritmos de encriptación de nivel empresarial
            </p>
          </div>

          <div className="rounded-lg bg-[#1E3A8A]/5 p-5 border border-[#1E3A8A]/20">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E3A8A]">
                <svg className="fill-white" width="16" height="16" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
                </svg>
              </div>
              <h4 className="font-semibold text-black dark:text-white">Control Granular</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Asigne permisos específicos por usuario, rol o grupo con precisión y flexibilidad total
            </p>
          </div>

          <div className="rounded-lg bg-[#2563EB]/5 p-5 border border-[#2563EB]/20">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2563EB]">
                <svg className="fill-white" width="16" height="16" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
                </svg>
              </div>
              <h4 className="font-semibold text-black dark:text-white">Cumplimiento Normativo</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sistema diseñado para cumplir con estándares internacionales de seguridad y protección de datos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;