import React, { useEffect, useState } from "react";
import GenericTable from "../../components/GenericTable";
import {Address } from "../../models/Address";
import {addressService} from "../../services/addressService";
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ListAddresses: React.FC = () => {
    const [Addresses, setAddresses] = useState<Address[]>([]);

   const navigate = useNavigate();

    useEffect(() => {

        fetchData();
        console.log("Addresses fetched:", Addresses);
    }, []);

    const fetchData = async () => {
        try {
            const addresses = await addressService.getAddresses();
            setAddresses(addresses);
        } catch (error) {
            console.error("Error fetching addresses:", error);
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
            <Breadcrumb pageName="Gestión de Direcciones" />
            
            <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="text-xl font-semibold text-black dark:text-white">
                        Lista de Direcciones
                    </h4>
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
                        Nueva Dirección
                    </button>
                </div>
                
                <GenericTable
                    data={Addresses}
                    columns={["id", "user_id", "street", "number", "latitude", "longitude", "created_at", "updated_at"]}
                    actions={[
                        { name: "edit", label: "Editar" },
                        { name: "delete", label: "Eliminar" },
                    ]}
                    onAction={handleAction}
                />
            </div>
        </>
    );
};

export default ListAddresses;