import React from "react";
import RoleList from "../../views/MaterialUI/RoleViews/RoleList";
import { AdminGuard } from "../../components/guards/PermissionGuard";
import { useNavigate } from "react-router-dom";

const RolePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AdminGuard fallback={
      <div className="mx-auto max-w-7xl">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
              Acceso Denegado
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              No tienes permisos para gestionar roles del sistema.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Esta función está disponible solo para Administradores.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 inline-flex items-center justify-center rounded-md bg-gray-600 py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
            >
              ← Volver
            </button>
          </div>
        </div>
      </div>
    }>
      <RoleList />
    </AdminGuard>
  );
};

export default RolePage;