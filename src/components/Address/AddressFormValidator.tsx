import { Address } from "../../models/Address";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Definimos la interfaz para los props
interface AddressFormProps {
    mode: number; // Puede ser 1 (crear) o 2 (actualizar)
    handleCreate?: (values: Address) => void;
    handleUpdate?: (values: Address) => void;
    address?: Address | null;
}

const AddressFormValidator: React.FC<AddressFormProps> = ({ 
    mode, 
    handleCreate, 
    handleUpdate, 
    address 
}) => {
    const handleSubmit = (formattedValues: Address) => {
        if (mode === 1 && handleCreate) {
            handleCreate(formattedValues);  // Si `handleCreate` está definido, lo llamamos
        } else if (mode === 2 && handleUpdate) {
            handleUpdate(formattedValues);  // Si `handleUpdate` está definido, lo llamamos
        } else {
            console.error('No function provided for the current mode');
        }
    };

    return (
        <Formik
            initialValues={address ? {
                street: address.street || "",
                number: address.number || "",
                latitude: address.latitude !== null ? address.latitude : "",
                longitude: address.longitude !== null ? address.longitude : "",
            } : {
                street: "",
                number: "",
                latitude: "",
                longitude: "",
            }}
            validationSchema={Yup.object({
                street: Yup.string()
                    .min(3, "La calle debe tener al menos 3 caracteres")
                    .max(100, "La calle no puede exceder 100 caracteres")
                    .required("La calle es obligatoria"),
                number: Yup.string()
                    .min(1, "El número debe tener al menos 1 caracter")
                    .max(10, "El número no puede exceder 10 caracteres")
                    .required("El número es obligatorio"),
                latitude: Yup.number()
                    .transform((value, originalValue) => {
                        return originalValue === "" ? null : value;
                    })
                    .min(-90, "La latitud debe estar entre -90 y 90")
                    .max(90, "La latitud debe estar entre -90 y 90")
                    .nullable(),
                longitude: Yup.number()
                    .transform((value, originalValue) => {
                        return originalValue === "" ? null : value;
                    })
                    .min(-180, "La longitud debe estar entre -180 y 180")
                    .max(180, "La longitud debe estar entre -180 y 180")
                    .nullable(),
            })}
            onSubmit={(values) => {
                // Convert empty strings to null for latitude and longitude
                const formattedValues = {
                    ...values,
                    id: address?.id, // Include the address ID for updates
                    latitude: values.latitude === "" ? null : Number(values.latitude),
                    longitude: values.longitude === "" ? null : Number(values.longitude),
                };
                handleSubmit(formattedValues);
            }}
        >
            {({ handleSubmit }) => (
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            {mode === 1 ? "Crear Dirección" : "Actualizar Dirección"}
                        </h3>
                    </div>
                    <Form onSubmit={handleSubmit} className="p-6.5">
                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            {/* Calle */}
                            <div className="w-full xl:w-1/2">
                                <label htmlFor="street" className="mb-2.5 block text-black dark:text-white">
                                    Calle <span className="text-meta-1">*</span>
                                </label>
                                <Field
                                    type="text"
                                    name="street"
                                    placeholder="Ingrese el nombre de la calle"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                <ErrorMessage name="street" component="p" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Número */}
                            <div className="w-full xl:w-1/2">
                                <label htmlFor="number" className="mb-2.5 block text-black dark:text-white">
                                    Número <span className="text-meta-1">*</span>
                                </label>
                                <Field
                                    type="text"
                                    name="number"
                                    placeholder="Ingrese el número"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                <ErrorMessage name="number" component="p" className="text-red-500 text-sm mt-1" />
                            </div>
                        </div>

                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            {/* Latitud */}
                            <div className="w-full xl:w-1/2">
                                <label htmlFor="latitude" className="mb-2.5 block text-black dark:text-white">
                                    Latitud (Opcional)
                                </label>
                                <Field
                                    type="number"
                                    name="latitude"
                                    step="any"
                                    placeholder="Ej: -34.6118"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                <ErrorMessage name="latitude" component="p" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Longitud */}
                            <div className="w-full xl:w-1/2">
                                <label htmlFor="longitude" className="mb-2.5 block text-black dark:text-white">
                                    Longitud (Opcional)
                                </label>
                                <Field
                                    type="number"
                                    name="longitude"
                                    step="any"
                                    placeholder="Ej: -58.3960"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                <ErrorMessage name="longitude" component="p" className="text-red-500 text-sm mt-1" />
                            </div>
                        </div>

                        {/* Información adicional */}
                        <div className="mb-6">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                <strong>Nota:</strong> Las coordenadas de latitud y longitud son opcionales. 
                                Si las proporcionas, asegúrate de que sean válidas para una mejor geolocalización.
                            </p>
                        </div>

                        {/* Botón de enviar */}
                        <button
                            type="submit"
                            className={`flex w-full justify-center rounded p-3 font-medium text-gray hover:bg-opacity-90 ${
                                mode === 1 
                                    ? "bg-primary text-white" 
                                    : "bg-success text-white"
                            }`}
                        >
                            {mode === 1 ? "Crear Dirección" : "Actualizar Dirección"}
                        </button>
                    </Form>
                </div>
            )}
        </Formik>
    );
};

export default AddressFormValidator;