import React, { useEffect, useState } from "react";
import GenericTable from "../../components/GenericTable";
import {Address } from "../../models/Address";
import {addressService} from "../../services/addressService";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ListAddresses: React.FC = () => {
    const [Addresses, setAddresses] = useState<Address[]>([]);

   const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const addresses = await addressService.getAddresses();
            console.debug('Address.list fetchData -> received', addresses);
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
        <div>
            <h2>Address List</h2>
            <GenericTable
                data={Addresses}
                columns={["id", "user_id", "street", "number", "latitude", "longitude", "created_at", "updated_at"]}
                actions={[
                    { name: "edit", label: "Edit" },
                    { name: "delete", label: "Delete" },
                ]}
                onAction={handleAction}
            />
        </div>
    );
};

export default ListAddresses;