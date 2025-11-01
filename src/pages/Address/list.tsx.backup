import React, { useEffect, useState } from "react";
import GenericTable from "../../components/GenericTable";
import {Address } from "../../models/Address";
import {addressService} from "../../services/addressService";
import api from "../../interceptors/axiosInterceptor";
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ListAddresses: React.FC = () => {
    const [Addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // Función para buscar usuario por email (igual que en create.tsx)
    const findUserByEmail = async (email: string) => {
        try {
            const response = await api.get('/users');
            const users = response.data;
            return users.find((user: any) => user.email === email);
        } catch (error) {
            console.error("Error buscando usuario por email:", error);
            return null;
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Obtener usuario autenticado actual (Firebase)
            const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
            
            if (!currentUser || !currentUser.email) {
                console.error("No hay usuario autenticado");
                setAddresses([]);
                setLoading(false);
                return;
            }

            console.log("Usuario Firebase autenticado:", currentUser);
            console.log("Buscando usuario en backend con email:", currentUser.email);
            
            // Buscar usuario en backend por email
            const backendUser = await findUserByEmail(currentUser.email);
            
            if (!backendUser || !backendUser.id) {
                console.error("No se encontró usuario en backend con email:", currentUser.email);
                setAddresses([]);
                setLoading(false);
                return;
            }

            console.log("Usuario encontrado en backend:", backendUser);
            console.log("Buscando dirección para usuario ID:", backendUser.id);
            
            // Obtener solo la dirección del usuario actual
            const userAddress = await addressService.getAddressByUserId(Number(backendUser.id));
            
            if (userAddress) {
                console.log("Dirección encontrada:", userAddress);
                setAddresses([userAddress]); // Array con una sola dirección
            } else {
                console.log("Usuario no tiene dirección registrada");
                setAddresses([]);
            }
            
        } catch (error) {
            console.error("Error fetching addresses:", error);
            setAddresses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = (action: string, item: Record<string, any>) => {
        const address = item as Address;
        if (action === "edit") {
            console.log("Edit address:", address);
            navigate(`/addresses/update/${address.id}`);
        } else if (action === "delete") {
            console.log("Delete address:", address);
            Swal.fire({
                title: "Eliminación",
                text: "Está seguro de querer eliminar el registro?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, eliminar",
                cancelButtonText: "No"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const success = await addressService.deleteAddress(address.id!);
                    if (success) {
                        Swal.fire({
                            title: "Eliminado",
                            text: "El registro se ha eliminado",
                            icon: "success"
                        });
                    }
                    // 🔹 Vuelve a obtener los usuarios después de eliminar uno
                    fetchData();
                }
            });
        }
    };  
     return (
        <>
            <Breadcrumb pageName="Mi Dirección" />
            
            <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="text-xl font-semibold text-black dark:text-white">
                        Mi Dirección
                    </h4>
                    {Addresses.length === 0 && !loading && (
                        <button
                            onClick={() => navigate('/addresses/create')}
                            className="inline-flex items-center justify-center rounded-md bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                        >
                            <svg
                                className="fill-current mr-2"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z"
                                    fill=""
                                />
                            </svg>
                            Agregar Mi Dirección
                        </button>
                    )}
                </div>
                
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-2">Cargando dirección...</span>
                    </div>
                ) : Addresses.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            No tienes una dirección registrada
                        </p>
                        <button
                            onClick={() => navigate('/addresses/create')}
                            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-center font-medium text-white hover:bg-opacity-90"
                        >
                            Crear Mi Primera Dirección
                        </button>
                    </div>
                ) : (
                    <GenericTable
                        data={Addresses}
                        columns={["id", "user_id", "street", "number", "latitude", "longitude", "created_at", "updated_at"]}
                        actions={[
                            { name: "edit", label: "Editar" },
                            { name: "delete", label: "Eliminar" },
                        ]}
                        onAction={handleAction}
                    />
                )}
            </div>
        </>
    );
};

export default ListAddresses;