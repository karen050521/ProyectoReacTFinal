import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../interceptors/axiosInterceptor";
import type { Address } from "../../models/Address";
import { getUserById } from "../../services/userService";

const defaultLat = 5.0703;
const defaultLng = -75.5138;

export default function AddressCreatePage(): JSX.Element {
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
        // El backend citado usa ruta: /addresses/user/:userId (el baseURL ya incluye /api)
        const endpoint = `/addresses/user/${userId}`;
        console.log("🔍 Fetching address from:", endpoint);
        const resp = await api.get<Address | null>(endpoint);
        console.log("✅ Response data:", resp.data);
        const data = resp.data as any;
        if (data) {
          console.log("📍 Setting coordinates:", data.latitude, data.longitude);
          setStreet(data.street ?? "");
          setNumber(data.number ?? "");
          setLatitude(typeof data.latitude === "number" ? data.latitude : defaultLat);
          setLongitude(typeof data.longitude === "number" ? data.longitude : defaultLng);
          setAddressId(data.id ?? null);
        } else {
          console.log("⚠ No data found for user");
          // No tiene dirección, valores por defecto permanecen
        }
      } catch (err: any) {
        // Si 404 o no existe, mantener formulario vacío
        console.error("❌ Error fetching address:", err);
        console.error("Error details:", err.response?.data, err.response?.status);
      } finally {
        setLoading(false);
      }
    }
    fetchAddress();
  }, [userId]);

  // Obtener nombre del usuario para mostrar en el título
  useEffect(() => {
    async function fetchUserName() {
      if (!userId) return;
      try {
        const numericId = Number(userId);
        if (Number.isNaN(numericId)) return;
        const user = await getUserById(numericId);
        if (user) {
          // El modelo User en este proyecto tiene la propiedad name.
          setUserName(user.name ?? null);
        }
      } catch (err) {
        console.debug("Error fetching user name:", err);
      }
    }
    fetchUserName();
  }, [userId]);

  // Generar URL del iframe de OpenStreetMap basado en coordenadas
  const getMapUrl = () => {
    const lat = typeof latitude === "number" ? latitude : defaultLat;
    const lng = typeof longitude === "number" ? longitude : defaultLng;
    // Usar OpenStreetMap con iframe (más confiable que Leaflet desde CDN)
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;
  };

  const handleCreate = async () => {
    if (!userId) return alert("User ID no provisto en la ruta.");
    if (!street || !number || latitude === "" || longitude === "") return alert("Complete todos los campos.");
    try {
      setLoading(true);
      const payload = { street, number, latitude: Number(latitude), longitude: Number(longitude) };
      const resp = await api.post(`/addresses/user/${userId}`, payload);
      alert("Dirección creada correctamente");
      setAddressId(resp.data?.id ?? null);
    } catch (err: any) {
      console.error(err);
      alert("Error al crear dirección: " + (err?.message ?? err));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!addressId) return alert("No hay dirección para actualizar.");
    try {
      setLoading(true);
      const payload = { street, number, latitude: Number(latitude), longitude: Number(longitude) };
      await api.put(`/addresses/${addressId}`, payload);
      alert("Dirección actualizada");
    } catch (err: any) {
      console.error(err);
      alert("Error al actualizar dirección: " + (err?.message ?? err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!addressId) return alert("No hay dirección para eliminar.");
    if (!confirm("¿Eliminar esta dirección?")) return;
    try {
      setLoading(true);
      await api.delete(`/addresses/${addressId}`);
      alert("Dirección eliminada");
      // limpiar formulario
      setAddressId(null);
      setStreet("");
      setNumber("");
      setLatitude(defaultLat);
      setLongitude(defaultLng);
    } catch (err: any) {
      console.error(err);
      alert("Error al eliminar dirección: " + (err?.message ?? err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{userName ? `${userName} - Address` : 'Address'}</h1>

      <div className="flex gap-6">
        <div className="w-2/3 bg-white rounded shadow p-4">
          <iframe
            key={`${latitude}-${longitude}`}
            ref={iframeRef}
            src={getMapUrl()}
            title="OpenStreetMap"
            className="w-full border-0 rounded"
            style={{ height: '500px', minHeight: '500px', width: '100%' }}
            loading="lazy"
          />
          <p className="text-sm text-gray-500 mt-2">
            💡 Tip: Cambia latitud y longitud abajo para actualizar la ubicación en el mapa
          </p>
        </div>

        <div className="w-1/3 bg-white rounded shadow p-4 flex flex-col gap-3">
          <label className="block">
            <span className="text-gray-700">Street</span>
            <input
              className="mt-1 block w-full border rounded p-2"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Number</span>
            <input
              className="mt-1 block w-full border rounded p-2"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Latitude</span>
            <input
              type="number"
              step="any"
              className="mt-1 block w-full border rounded p-2"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Longitude</span>
            <input
              type="number"
              step="any"
              className="mt-1 block w-full border rounded p-2"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </label>

          <div className="mt-4 flex gap-2">
            {addressId ? (
              <>
                <button onClick={handleUpdate} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">
                  Update
                </button>
                <button onClick={handleDelete} disabled={loading} className="px-4 py-2 bg-red-600 text-white rounded">
                  Delete
                </button>
              </>
            ) : (
              <button
                onClick={handleCreate}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Create
              </button>
            )}

            <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}