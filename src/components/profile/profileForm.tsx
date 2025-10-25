import { Profile } from "../../models/Profile";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";


// Definimos la interfaz para los props
interface MyFormProps {
    mode: number; // Puede ser 1 (crear) o 2 (actualizar)
    handleCreate?: (values: Profile) => void;
    handleUpdate?: (values: Profile) => void;
    profile?: Profile | null;
}



const ProfileFormValidator: React.FC<MyFormProps> = ({ mode, handleCreate, handleUpdate, profile }) => {

    const handleSubmit = (formattedValues: Profile) => {
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
            initialValues={profile ? profile : {
                user_id: 0,
                phone: "",
                photo: "",
            }}
            validationSchema={Yup.object({
                user_id: Yup.number()
                    .typeError("Debe ser un número")
                    .positive("Debe ser un número positivo")
                    .integer("Debe ser un número entero")
                    .required("El ID de usuario es obligatorio"),
                phone: Yup.string()
                    .matches(/^\d{10}$/, "El teléfono debe tener 10 dígitos")
                    .nullable(),
                photo: Yup.string()
                    .url("Debe ser una URL válida")
                    .nullable(),
            })}
            onSubmit={(values) => {
                const formattedValues = { 
                    ...values, 
                    user_id: Number(values.user_id),
                    phone: values.phone || null,
                    photo: values.photo || null
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

                    {/* Phone */}
                    <div>
                        <label htmlFor="phone" className="block text-lg font-medium text-gray-700">Phone (Optional)</label>
                        <Field type="text" name="phone" className="w-full border rounded-md p-2" placeholder="1234567890" />
                        <ErrorMessage name="phone" component="p" className="text-red-500 text-sm" />
                    </div>

                    {/* Photo URL */}
                    <div>
                        <label htmlFor="photo" className="block text-lg font-medium text-gray-700">Photo URL (Optional)</label>
                        <Field type="text" name="photo" className="w-full border rounded-md p-2" placeholder="https://example.com/photo.jpg" />
                        <ErrorMessage name="photo" component="p" className="text-red-500 text-sm" />
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

export default ProfileFormValidator;
