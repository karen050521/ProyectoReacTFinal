import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addressService } from "../../services/addressService";
import Swal from "sweetalert2";
import { Address } from '../../models/Address';
import AddressFormValidator from '../../components/Address/AddressFormValidator';
import Breadcrumb from "../../components/Breadcrumb";

const UpdateAddressPage = () => {
    const { id } = useParams(); // Obtener el ID de la URL
    const navigate = useNavigate();
    const [address, setAddress] = useState<Address | null>(null);

    // Cargar datos de la dirección después del montaje
    useEffect(() => {
        console.log("Id->"+id)
        const fetchAddress = async () => {
            if (!id) {
                console.error("No se proporcionó ID en la URL");
                return;
            }
            
            try {
                console.log("Cargando dirección con ID:", id);
                const addressData = await addressService.getAddressById(parseInt(id));
                console.log("Dirección cargada:", addressData);
                setAddress(addressData);
            } catch (error) {
                console.error("Error cargando dirección:", error);
                Swal.fire({
                    title: "Error",
                    text: "No se pudo cargar la dirección",
                    icon: "error",
                    timer: 3000
                });
                navigate("/addresses");
            }
        };

        fetchAddress();
    }, [id]);

    const handleUpdateAddress = async (theAddress: Address) => {
        try {
            console.log("Datos a actualizar:", theAddress);
            console.log("ID de la dirección:", theAddress.id);
            
            if (!theAddress.id) {
                console.error("ERROR: No se proporcionó ID de dirección para actualizar");
                Swal.fire({
                    title: "Error",
                    text: "No se pudo identificar la dirección a actualizar",
                    icon: "error",
                    timer: 3000
                });
                return;
            }
            
            const updatedAddress = await addressService.updateAddress(theAddress.id, theAddress);
            if (updatedAddress) {
                Swal.fire({
                    title: "Completado",
                    text: "Se ha actualizado correctamente la dirección",
                    icon: "success",
                    timer: 3000
                });
                navigate("/addresses"); // Redirección en React Router
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Existe un problema al momento de actualizar la dirección",
                    icon: "error",
                    timer: 3000
                });
            }
        } catch (error) {
            console.error("Error al actualizar dirección:", error);
            Swal.fire({
                title: "Error",
                text: "Existe un problema al momento de actualizar la dirección",
                icon: "error",
                timer: 3000
            });
        }
    };

    if (!address) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Cargando dirección...</p>
                </div>
            </div>
        ); // Muestra un mensaje de carga mientras se obtienen los datos
    }

    return (
        <>
            <Breadcrumb pageName="Actualizar Dirección" />
            <AddressFormValidator
                handleUpdate={handleUpdateAddress}
                mode={2} // 2 significa actualización
                address={address}
            />
        </>
    );
};

export default UpdateAddressPage;