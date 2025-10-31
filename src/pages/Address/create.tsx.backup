import { Address } from '../../models/Address';
import AddressFormValidator from '../../components/Address/AddressFormValidator'; 
import Swal from 'sweetalert2';
import { addressService } from "../../services/addressService";
import api from "../../interceptors/axiosInterceptor";
import Breadcrumb from '../../components/Breadcrumb';
import { useNavigate } from "react-router-dom";

const CreateAddress = () => {
    const navigate = useNavigate();

    // Función temporal para buscar usuario por email sin modificar userService
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

    // Lógica de creación
    const handleCreateAddress = async (address: Address) => {
        try {
            // Obtener usuario autenticado actual (Firebase)
            const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
            
            if (!currentUser || !currentUser.email) {
                Swal.fire({
                    title: "Error de Autenticación",
                    text: "No se pudo obtener el usuario autenticado o no tiene email. Por favor, inicia sesión nuevamente.",
                    icon: "error",
                    timer: 3000
                });
                return;
            }

            console.log("Usuario Firebase autenticado:", currentUser);
            console.log("Buscando usuario en backend con email:", currentUser.email);
            
            // Buscar usuario en backend por email usando función temporal
            const backendUser = await findUserByEmail(currentUser.email);
            
            if (!backendUser || !backendUser.id) {
                console.error("No se encontró usuario en backend con email:", currentUser.email);
                Swal.fire({
                    title: "Usuario No Encontrado",
                    text: "No se encontró un usuario en el backend con tu email. Contacta al administrador.",
                    icon: "error",
                    timer: 5000
                });
                return;
            }

            console.log("Usuario encontrado en backend:", backendUser);
            console.log("Creando dirección para usuario ID del backend:", backendUser.id);
            
            // Verificar si el usuario ya tiene una dirección
            try {
                const existingAddress = await api.get(`/addresses/user/${backendUser.id}`);
                if (existingAddress.data) {
                    console.log("Usuario ya tiene dirección:", existingAddress.data);
                    Swal.fire({
                        title: "Dirección Existente",
                        text: "Ya tienes una dirección registrada. Cada usuario solo puede tener una dirección. ¿Deseas editarla?",
                        icon: "info",
                        showCancelButton: true,
                        confirmButtonText: "Editar Existente",
                        cancelButtonText: "Cancelar"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate(`/addresses/update/${existingAddress.data.id}`);
                        }
                    });
                    return;
                }
            } catch (existingError: any) {
                // Si es 404, significa que no tiene dirección (OK para crear)
                if (existingError.response?.status !== 404) {
                    console.error("Error verificando dirección existente:", existingError);
                }
            }
            
            const createdAddress = await addressService.createAddress(Number(backendUser.id), address);
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
            
            let errorMessage = "Existe un problema al momento de crear la dirección";
            
            // Si es un error específico, usar ese mensaje
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            
            Swal.fire({
                title: "Error",
                text: errorMessage,
                icon: "error",
                timer: 5000 // Más tiempo para leer el mensaje
            });
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