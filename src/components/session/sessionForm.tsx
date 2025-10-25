import { Session } from "../../models/Session";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";


// Definimos la interfaz para los props
interface MyFormProps {
    mode: number; // Puede ser 1 (crear) o 2 (actualizar)
    handleCreate?: (values: Session) => void;
    handleUpdate?: (values: Session) => void;
    session?: Session | null;
}



const SessionFormValidator: React.FC<MyFormProps> = ({ mode, handleCreate, handleUpdate, session }) => {

    const handleSubmit = (formattedValues: Session) => {
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
            initialValues={session ? session : {
                user_id: 0,
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
                const formattedValues = {
                    ...values,
                    user_id: Number(values.user_id),
                    FACode: values.FACode || null
                };
                handleSubmit(formattedValues);
            }}

        >
            {({ handleSubmit }) => (
                <Form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 p-6 bg-white rounded-md shadow-md">
                    {/* User ID */}
                    <div>
                        <label htmlFor="user_id" className="block text-lg font-medium text-gray-700">User ID</label>
                        <Field type="number" name="user_id" className="w-full border rounded-md p-2" />
                        <ErrorMessage name="user_id" component="p" className="text-red-500 text-sm" />
                    </div>

                    {/* Token */}
                    <div>
                        <label htmlFor="token" className="block text-lg font-medium text-gray-700">Token</label>
                        <Field 
                            type="text" 
                            name="token" 
                            className="w-full border rounded-md p-2 font-mono text-sm" 
                            placeholder="Ingrese el token de sesión"
                        />
                        <ErrorMessage name="token" component="p" className="text-red-500 text-sm" />
                    </div>

                    {/* Expiration */}
                    <div>
                        <label htmlFor="expiration" className="block text-lg font-medium text-gray-700">Expiration Date</label>
                        <Field 
                            type="datetime-local" 
                            name="expiration" 
                            className="w-full border rounded-md p-2" 
                        />
                        <ErrorMessage name="expiration" component="p" className="text-red-500 text-sm" />
                    </div>

                    {/* FACode */}
                    <div>
                        <label htmlFor="FACode" className="block text-lg font-medium text-gray-700">2FA Code (Optional)</label>
                        <Field 
                            type="text" 
                            name="FACode" 
                            className="w-full border rounded-md p-2" 
                            placeholder="123456"
                            maxLength={6}
                        />
                        <ErrorMessage name="FACode" component="p" className="text-red-500 text-sm" />
                        <p className="text-xs text-gray-500 mt-1">
                            Código de autenticación de dos factores (6 dígitos)
                        </p>
                    </div>

                    {/* State */}
                    <div>
                        <label htmlFor="state" className="block text-lg font-medium text-gray-700">State</label>
                        <Field 
                            as="select" 
                            name="state" 
                            className="w-full border rounded-md p-2"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="expired">Expired</option>
                        </Field>
                        <ErrorMessage name="state" component="p" className="text-red-500 text-sm" />
                    </div>

                    {/* Botón de enviar */}
                    <button
                        type="submit"
                        className={`py-2 px-4 text-white rounded-md ${mode === 1 ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"}`}
                    >
                        {mode === 1 ? "Crear" : "Actualizar"}
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default SessionFormValidator;
