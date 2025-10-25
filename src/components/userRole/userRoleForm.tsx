import { UserRole } from "../../models/UserRole";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";


// Definimos la interfaz para los props
interface MyFormProps {
    mode: number; // Puede ser 1 (crear) o 2 (actualizar)
    handleCreate?: (values: UserRole) => void;
    handleUpdate?: (values: UserRole) => void;
    userRole?: UserRole | null;
}



const UserFormValidator: React.FC<MyFormProps> = ({ mode, handleCreate, handleUpdate,userRole }) => {

    const handleSubmit = (formattedValues: UserRole) => {
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
            initialValues={userRole ? userRole : {
                user_id: 0,
                role_id: 0,
                startAt: "",
                endAt: null,
            }}
            validationSchema={Yup.object({
                user_id: Yup.number()
                    .typeError("Debe ser un número")
                    .positive("Debe ser un número positivo")
                    .integer("Debe ser un número entero")
                    .required("El ID de usuario es obligatorio"),
                role_id: Yup.number()
                    .typeError("Debe ser un número")
                    .positive("Debe ser un número positivo")
                    .integer("Debe ser un número entero")
                    .required("El ID de rol es obligatorio"),
                startAt: Yup.string()
                    .required("La fecha de inicio es obligatoria"),
                endAt: Yup.string()
                    .nullable(),
            })}
            onSubmit={(values) => {
                const formattedValues = { 
                    ...values, 
                    user_id: Number(values.user_id),
                    role_id: Number(values.role_id)
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

                    {/* Role ID */}
                    <div>
                        <label htmlFor="role_id" className="block text-lg font-medium text-gray-700">Role ID</label>
                        <Field type="number" name="role_id" className="w-full border rounded-md p-2" />
                        <ErrorMessage name="role_id" component="p" className="text-red-500 text-sm" />
                    </div>

                    {/* Start At */}
                    <div>
                        <label htmlFor="startAt" className="block text-lg font-medium text-gray-700">Start Date</label>
                        <Field type="datetime-local" name="startAt" className="w-full border rounded-md p-2" />
                        <ErrorMessage name="startAt" component="p" className="text-red-500 text-sm" />
                    </div>

                    {/* End At */}
                    <div>
                        <label htmlFor="endAt" className="block text-lg font-medium text-gray-700">End Date (Optional)</label>
                        <Field type="datetime-local" name="endAt" className="w-full border rounded-md p-2" />
                        <ErrorMessage name="endAt" component="p" className="text-red-500 text-sm" />
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

export default UserFormValidator;
