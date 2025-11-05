import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../interceptors/axiosInterceptor";
import type { Address } from "../../models/Address";
import { getUserById } from "../../services/userService";
import Breadcrumb from "../../components/Breadcrumb";

const defaultLat = 28.221;
const defaultLng = -31.155;

export default function AddressViewPage(): JSX.Element {
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();

  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  // Cargar dirección del usuario
  useEffect(() => {
    async function fetchAddress() {
      if (!userId) return;
      setLoading(true);
      try {
        const endpoint = `/addresses/user/${userId}`;
        console.log("🔍 Fetching address from:", endpoint);
        const resp = await api.get<Address | null>(endpoint);
        console.log("✅ Response data:", resp.data);
        const data = resp.data as any;
        if (data) {
          setAddress(data);
        }
      } catch (err: any) {
        console.error("❌ Error fetching address:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAddress();
  }, [userId]);

  // Obtener nombre del usuario
  useEffect(() => {
    async function fetchUserName() {
      if (!userId) return;
      try {
        const numericId = Number(userId);
        if (Number.isNaN(numericId)) return;
        const user = await getUserById(numericId);
        if (user) {
          setUserName(user.name ?? null);
        }
      } catch (err) {
        console.debug("Error fetching user name:", err);
      }
    }
    fetchUserName();
  }, [userId]);

  // Generar URL del mapa
  const getMapUrl = () => {
    const lat = address?.latitude ?? defaultLat;
    const lng = address?.longitude ?? defaultLng;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;
  };

  if (loading) {
    return (
      <>
        <Breadcrumb pageName={userName ? `${userName} - Dirección` : 'Dirección'} />
        <div className="p-6 bg-white rounded-md shadow-md dark:bg-boxdark dark:border-strokedark">
          <p className="text-gray-500 dark:text-gray-300">Cargando...</p>
        </div>
      </>
    );
  }

  if (!address) {
    return (
      <>
        <Breadcrumb pageName={userName ? `${userName} - Dirección` : 'Dirección'} />
        <div className="p-6 bg-white rounded-md shadow-md dark:bg-boxdark dark:border-strokedark">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">No hay dirección registrada</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Este usuario no tiene una dirección guardada.</p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/addresses/edit/${userId}`)}
              style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
              className="py-2 px-6 font-semibold rounded-md hover:opacity-90"
            >
              Crear Dirección
            </button>
            <button
              onClick={() => navigate("/users")}
              style={{ backgroundColor: '#6b7280', color: '#ffffff' }}
              className="py-2 px-6 font-semibold rounded-md hover:opacity-90"
            >
              Volver a Usuarios
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb pageName={userName ? `${userName} - Dirección` : 'Dirección'} />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          {userName ? `Dirección de ${userName}` : 'Dirección del Usuario'}
        </h1>

        <div className="flex gap-6">
          {/* Mapa */}
          <div className="w-2/3 bg-white rounded shadow p-4 dark:bg-boxdark dark:border-strokedark">
            <iframe
              key={`map-${address.latitude}-${address.longitude}`}
              src={getMapUrl()}
              title="OpenStreetMap"
              className="w-full border-0 rounded"
              style={{ height: '500px', minHeight: '500px', width: '100%' }}
              loading="eager"
            />
          </div>

          {/* Información de la dirección */}
          <div className="w-1/3 bg-white rounded shadow p-6 flex flex-col gap-4 dark:bg-boxdark dark:border-strokedark">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Detalles de la Dirección</h2>
            
            <div className="border-b pb-3 dark:border-strokedark">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">Calle</label>
              <p className="text-lg text-gray-800 dark:text-white">{address.street || 'N/A'}</p>
            </div>

            <div className="border-b pb-3 dark:border-strokedark">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">Número</label>
              <p className="text-lg text-gray-800 dark:text-white">{address.number || 'N/A'}</p>
            </div>

            <div className="border-b pb-3 dark:border-strokedark">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">Latitud</label>
              <p className="text-lg text-gray-800 dark:text-white">{address.latitude}</p>
            </div>

            <div className="border-b pb-3 dark:border-strokedark">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">Longitud</label>
              <p className="text-lg text-gray-800 dark:text-white">{address.longitude}</p>
            </div>

            {address.created_at && (
              <div className="border-b pb-3 dark:border-strokedark">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">Fecha de Creación</label>
                <p className="text-gray-800 dark:text-white">
                  {new Date(address.created_at).toLocaleString('es-ES')}
                </p>
              </div>
            )}

            {address.updated_at && (
              <div className="pb-3">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">Última Actualización</label>
                <p className="text-gray-800 dark:text-white">
                  {new Date(address.updated_at).toLocaleString('es-ES')}
                </p>
              </div>
            )}

            {/* Botones */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => navigate(`/addresses/edit/${userId}`)}
                style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                className="py-2 px-6 font-semibold rounded-md hover:opacity-90"
              >
                Editar Dirección
              </button>
              <button
                onClick={() => navigate("/users")}
                style={{ backgroundColor: '#6b7280', color: '#ffffff' }}
                className="py-2 px-6 font-semibold rounded-md hover:opacity-90"
              >
                Volver a Usuarios
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
