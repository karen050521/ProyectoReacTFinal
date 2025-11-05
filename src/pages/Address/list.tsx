import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";

/**
 * AddressList - Página de redirección
 * 
 * Las direcciones se gestionan desde la vista de usuarios.
 * Para ver/editar la dirección de un usuario, ir a:
 * - /addresses/user/:userId (ver)
 * - /addresses/edit/:userId (editar)
 * - /addresses/create/:userId (crear)
 */
export default function AddressList(): JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir automáticamente a la lista de usuarios
    const timer = setTimeout(() => {
      navigate("/users");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <Breadcrumb pageName="Direcciones" />
      <div className="p-6 bg-white rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Gestión de Direcciones</h1>
        <p className="text-gray-600 mb-4">
          Las direcciones se gestionan desde la vista de usuarios.
        </p>
        <p className="text-gray-500 mb-6">
          Redirigiendo a la lista de usuarios en 3 segundos...
        </p>
        <button
          onClick={() => navigate("/users")}
          className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          Ir a Usuarios Ahora
        </button>
      </div>
    </>
  );
}
