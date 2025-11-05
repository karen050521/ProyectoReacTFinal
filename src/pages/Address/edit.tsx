import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../interceptors/axiosInterceptor";
import type { Address } from "../../models/Address";
import { getUserById } from "../../services/userService";
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";

const defaultLat = 5.0703;
const defaultLng = -75.5138;

export default function AddressEditPage(): JSX.Element {
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();

  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [latitude, setLatitude] = useState<number | "">(defaultLat);
  const [longitude, setLongitude] = useState<number | "">(defaultLng);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Cargar dirección del usuario si existe
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
          const newLat = typeof data.latitude === "number" ? data.latitude : defaultLat;
          const newLng = typeof data.longitude === "number" ? data.longitude : defaultLng;
          console.log("📍 Setting coordinates:", newLat, newLng);
          
          setStreet(data.street ?? "");
          setNumber(data.number ?? "");
          setLatitude(newLat);
          setLongitude(newLng);
          setAddressId(data.id ?? null);
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
    const lat = typeof latitude === "number" ? latitude : defaultLat;
    const lng = typeof longitude === "number" ? longitude : defaultLng;
    console.log("🗺️ Generating map URL with coordinates:", { lat, lng });
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;
  };

  const handleSave = async () => {
    if (!userId) {
      Swal.fire("Error", "User ID no provisto", "error");
      return;
    }
    if (!street || !number || latitude === "" || longitude === "") {
      Swal.fire("Error", "Complete todos los campos", "warning");
      return;
    }

    try {
      setLoading(true);
      const payload = { street, number, latitude: Number(latitude), longitude: Number(longitude) };

      if (addressId) {
        // Actualizar
        await api.put(`/addresses/${addressId}`, payload);
        Swal.fire({
          title: "Éxito",
          text: "Dirección actualizada correctamente",
          icon: "success",
          timer: 2000
        });
      } else {
        // Crear
        const resp = await api.post(`/addresses/user/${userId}`, payload);
        setAddressId(resp.data?.id ?? null);
        Swal.fire({
          title: "Éxito",
          text: "Dirección creada correctamente",
          icon: "success",
          timer: 2000
        });
      }
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Error al guardar la dirección",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!addressId) {
      Swal.fire("Error", "No hay dirección para eliminar", "warning");
      return;
    }

    const result = await Swal.fire({
      title: "¿Eliminar dirección?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await api.delete(`/addresses/${addressId}`);
        Swal.fire("Eliminado", "La dirección ha sido eliminada", "success");
        // Limpiar formulario
        setAddressId(null);
        setStreet("");
        setNumber("");
        setLatitude(defaultLat);
        setLongitude(defaultLng);
      } catch (err: any) {
        console.error(err);
        Swal.fire("Error", "Error al eliminar la dirección", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Breadcrumb pageName={userName ? `${userName} - Editar Dirección` : 'Editar Dirección'} />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">
          {userName ? `Dirección de ${userName}` : 'Dirección'}
        </h1>

        <div className="flex gap-6">
          <div className="w-2/3 bg-white rounded shadow p-4">
            <div className="mb-2 p-2 bg-gray-100 rounded text-sm">
              <strong>Coordenadas actuales:</strong> Lat: {latitude}, Lng: {longitude}
            </div>
            <iframe
              key={`map-${latitude}-${longitude}-${addressId}`}
              ref={iframeRef}
              src={getMapUrl()}
              title="OpenStreetMap"
              className="w-full border-0 rounded"
              style={{ height: '500px', minHeight: '500px', width: '100%' }}
              loading="eager"
            />
            <p className="text-sm text-gray-500 mt-2">
              💡 Tip: Cambia latitud y longitud abajo para actualizar la ubicación en el mapa
            </p>
          </div>

          <div className="w-1/3 bg-white rounded shadow p-4 flex flex-col gap-3">
            <label className="block">
              <span className="text-gray-700 font-medium">Calle</span>
              <input
                className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Nombre de la calle"
              />
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium">Número</span>
              <input
                className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Número"
              />
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium">Latitud</span>
              <input
                type="number"
                step="any"
                className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium">Longitud</span>
              <input
                type="number"
                step="any"
                className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </label>

            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={handleSave}
                disabled={loading}
                style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                className="py-2 px-6 font-semibold rounded-md hover:opacity-90 disabled:opacity-50"
              >
                {addressId ? "Guardar Cambios" : "Crear Dirección"}
              </button>

              {addressId && (
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
                  className="py-2 px-6 font-semibold rounded-md hover:opacity-90 disabled:opacity-50"
                >
                  Eliminar Dirección
                </button>
              )}

              <button
                onClick={() => navigate(`/addresses/user/${userId}`)}
                style={{ backgroundColor: '#6b7280', color: '#ffffff' }}
                className="py-2 px-6 font-semibold rounded-md hover:opacity-90"
              >
                Volver a Vista
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
