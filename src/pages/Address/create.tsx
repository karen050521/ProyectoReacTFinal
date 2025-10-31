import React from 'react';
import { Address } from '../../models/Address';
import AddressFormValidator from '../../components/Address/AddressFormValidator'; 
import Swal from 'sweetalert2';
import { addressService } from "../../services/addressService";
import Breadcrumb from '../../components/Breadcrumb';
import { useNavigate } from "react-router-dom";

const CreateAddress = () => {
    const navigate = useNavigate();

    // Lógica de creación
    const handleCreateAddress = async (address: Address) => {
        try {
            // TODO: Por ahora usando un userId hardcodeado. 
            // En el futuro esto vendrá del usuario autenticado
            const userId = 1; // Cambiar por el usuario autenticado
            
            const createdAddress = await addressService.createAddress(userId, address);
            if (createdAddress) {
                Swal.fire({
                    title: "Completado",
                    text: "Se ha creado correctamente la dirección",
                    icon: "success",
                    timer: 3000
                })
                console.log("Dirección creada con éxito:", createdAddress);
                navigate("/addresses");
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Existe un problema al momento de crear la dirección",
                    icon: "error",
                    timer: 3000
                })
            }
        } catch (error) {
            console.error("Error al crear dirección:", error);
            Swal.fire({
                title: "Error",
                text: "Existe un problema al momento de crear la dirección",
                icon: "error",
                timer: 3000
            })
        }
    };

    return (
        <div>
            <Breadcrumb pageName="Crear Dirección" />
            <AddressFormValidator
                handleCreate={handleCreateAddress}
                mode={1} // 1 significa creación
            />
        </div>
    );
};

export default CreateAddress;