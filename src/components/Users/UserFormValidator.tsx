import { User } from "../../models/user";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";


// Definimos la interfaz para los props
interface MyFormProps {
mode: number; // Puede ser 1 (crear) o 2 (actualizar)
handleCreate?: (values: User) => void;
handleUpdate?: (values: User) => void;
user?: User | null;
}



const UserFormValidator: React.FC<MyFormProps> = ({ mode, handleCreate, handleUpdate,user }) => {

const navigate = useNavigate();

const handleSubmit = (formattedValues: User) => {
    if (mode === 1 && handleCreate) {
        handleCreate(formattedValues);  // Si `handleCreate` está definido, lo llamamos
    } else if (mode === 2 && handleUpdate) {
        handleUpdate(formattedValues);  // Si `handleUpdate` está definido, lo llamamos
    } else {
        console.error('No function provided for the current mode');
    }
};

const handleCancel = () => {
    navigate("/users");
};

return (
    <Formik
        initialValues={user ? user :{
            name: "",
            email: "",
        }}
        validationSchema={Yup.object({
            name: Yup.string().required("El nombre es obligatorio"),
            email: Yup.string().email("Email inválido").required("El email es obligatorio"),
        })}
        onSubmit={(values) => {
            handleSubmit(values);
        }}
        
    >
        {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 p-6 bg-white rounded-md shadow-md">
                {/* Nombre */}
                <div>
                    <label htmlFor="name" className="block text-lg font-medium text-gray-700">Name</label>
                    <Field type="text" name="name" className="w-full border rounded-md p-2" />
                    <ErrorMessage name="name" component="p" className="text-red-500 text-sm" />
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
                    <Field type="email" name="email" className="w-full border rounded-md p-2" />
                    <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
                </div>

                {/* Botones de acción */}
                <div className="flex gap-4 mt-4">
                    <button
                        type="submit"
                        style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                        className="py-2 px-6 font-semibold rounded-md hover:opacity-90"
                    >
                        {mode === 1 ? "Guardar" : "Guardar Cambios"}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
                        className="py-2 px-6 font-semibold rounded-md hover:opacity-90"
                    >
                        Descartar
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        style={{ backgroundColor: '#6b7280', color: '#ffffff' }}
                        className="py-2 px-6 font-semibold rounded-md hover:opacity-90"
                    >
                        Atrás
                    </button>
                </div>
            </Form>
        )}
    </Formik>
);
};

export default UserFormValidator;
