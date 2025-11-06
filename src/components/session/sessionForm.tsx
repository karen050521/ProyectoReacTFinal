import { Session } from "../../models/Session";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";


// Definimos la interfaz para los props
interface MyFormProps {
    mode: number; // Puede ser 1 (crear) o 2 (actualizar)
    handleCreate?: (values: Session) => void;
    handleUpdate?: (values: Session) => void;
    session?: Session | null;
    initialUserId?: number; // Nuevo: para pre-llenar el userId
}



const SessionFormValidator: React.FC<MyFormProps> = ({ mode, handleCreate, handleUpdate, session, initialUserId }) => {
    const navigate = useNavigate();

    const handleSubmit = (formattedValues: Session) => {
        if (mode === 1 && handleCreate) {
            handleCreate(formattedValues);  // Si `handleCreate` está definido, lo llamamos
        } else if (mode === 2 && handleUpdate) {
            handleUpdate(formattedValues);  // Si `handleUpdate` está definido, lo llamamos
        } else {
            console.error('No function provided for the current mode');
        }
    };

    const handleCancel = () => {
        navigate("/sessions");
    };

    return (
        <Formik
            initialValues={session ? session : {
                user_id: initialUserId || 0,
                token: "",
                expiration: "",
                FACode: "",
                state: "active",
            }}
            validationSchema={Yup.object({
                user_id: Yup.number()
                    .typeError("Debe ser un número")
                    .positive("Debe ser un número positivo")
                    .integer("Debe ser un número entero")
                    .required("El ID de usuario es obligatorio"),
                token: Yup.string()
                    .min(20, "El token debe tener al menos 20 caracteres")
                    .required("El token es obligatorio"),
                expiration: Yup.string()
                    .required("La fecha de expiración es obligatoria"),
                FACode: Yup.string()
                    .matches(/^\d{6}$/, "El código 2FA debe tener 6 dígitos")
                    .nullable(),
                state: Yup.string()
                    .oneOf(["active", "inactive", "expired"], "Estado inválido")
                    .required("El estado es obligatorio"),
            })}
            onSubmit={(values) => {
                // Convertir formato de fecha de 'YYYY-MM-DDTHH:mm' a 'YYYY-MM-DD HH:MM:SS'
                let formattedExpiration = values.expiration;
                if (formattedExpiration && formattedExpiration.includes('T')) {
                    // Si viene en formato datetime-local (YYYY-MM-DDTHH:mm)
                    formattedExpiration = formattedExpiration.replace('T', ' ') + ':00';
                } else if (formattedExpiration && !formattedExpiration.includes(':')) {
                    // Si viene solo fecha (YYYY-MM-DD), agregar hora por defecto
                    formattedExpiration = formattedExpiration + ' 23:59:59';
                } else if (formattedExpiration && formattedExpiration.split(':').length === 2) {
                    // Si tiene formato HH:mm, agregar segundos
                    formattedExpiration = formattedExpiration + ':00';
                }
                
                const formattedValues = {
                    ...values,
                    user_id: Number(values.user_id),
                    expiration: formattedExpiration,
                    FACode: values.FACode || null
                };
                handleSubmit(formattedValues);
            }}

        >
            {({ handleSubmit }) => (
                <Form onSubmit={handleSubmit} className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            {mode === 1 ? "Crear Nueva Sesión" : "Actualizar Sesión"}
                        </h3>
                    </div>

                    <div className="p-6.5 grid grid-cols-1 gap-6">
                        {/* User ID */}
                        <div>
                            <label htmlFor="user_id" className="mb-2.5 block text-sm font-medium text-gray-700 dark:text-white">
                                User ID {initialUserId && <span className="text-xs text-gray-500">(Asignado automáticamente)</span>}
                            </label>
                            <Field 
                                type="number" 
                                name="user_id" 
                                readOnly={!!initialUserId}
                                className={`w-full rounded border-[1.5px] border-stroke px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:text-white dark:focus:border-primary ${
                                    initialUserId ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-transparent dark:bg-form-input'
                                }`}
                            />
                            <ErrorMessage name="user_id" component="p" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* Token */}
                        <div>
                            <label htmlFor="token" className="mb-2.5 block text-sm font-medium text-gray-700 dark:text-white">
                                Token
                            </label>
                            <Field 
                                type="text" 
                                name="token" 
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary font-mono text-sm" 
                                placeholder="Ingrese el token de sesión"
                            />
                            <ErrorMessage name="token" component="p" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* Expiration */}
                        <div>
                            <label htmlFor="expiration" className="mb-2.5 block text-sm font-medium text-gray-700 dark:text-white">
                                Expiration Date
                            </label>
                            <Field 
                                type="datetime-local" 
                                name="expiration" 
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" 
                            />
                            <ErrorMessage name="expiration" component="p" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* FACode */}
                        <div>
                            <label htmlFor="FACode" className="mb-2.5 block text-sm font-medium text-gray-700 dark:text-white">
                                2FA Code (Optional)
                            </label>
                            <Field 
                                type="text" 
                                name="FACode" 
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" 
                                placeholder="123456"
                                maxLength={6}
                            />
                            <ErrorMessage name="FACode" component="p" className="text-red-500 text-sm mt-1" />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Código de autenticación de dos factores (6 dígitos)
                            </p>
                        </div>

                    {/* State */}
                    <div>
                        <label htmlFor="state" className="mb-2.5 block text-sm font-medium text-gray-700 dark:text-white">
                            State
                        </label>
                        <Field 
                            as="select" 
                            name="state" 
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="expired">Expired</option>
                        </Field>
                        <ErrorMessage name="state" component="p" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-4 mt-4">
                        <button
                            type="submit"
                            style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                            className="py-2 px-6 font-semibold rounded-md hover:opacity-90"
                        >
                            {mode === 1 ? "Crear Sesión" : "Guardar Cambios"}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            style={{ backgroundColor: '#6b7280', color: '#ffffff' }}
                            className="py-2 px-6 font-semibold rounded-md hover:opacity-90"
                        >
                            Descartar
                        </button>
                    </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default SessionFormValidator;
