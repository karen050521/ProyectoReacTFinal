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
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            {mode === 1 ? "Crear Perfil" : "Actualizar Perfil"}
                        </h3>
                    </div>
                    <Form onSubmit={handleSubmit} className="p-6.5">
                        {/* User ID */}
                        <div className="mb-4.5">
                            <label htmlFor="user_id" className="mb-2.5 block text-black dark:text-white">
                                User ID <span className="text-meta-1">*</span>
                            </label>
                            <Field 
                                type="number" 
                                name="user_id" 
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                placeholder="Ingrese el ID del usuario"
                            />
                            <ErrorMessage name="user_id" component="p" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* Phone */}
                        <div className="mb-4.5">
                            <label htmlFor="phone" className="mb-2.5 block text-black dark:text-white">
                                Teléfono (Opcional)
                            </label>
                            <Field 
                                type="text" 
                                name="phone" 
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                placeholder="1234567890" 
                            />
                            <ErrorMessage name="phone" component="p" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* Photo URL */}
                        <div className="mb-6">
                            <label htmlFor="photo" className="mb-2.5 block text-black dark:text-white">
                                URL de Foto (Opcional)
                            </label>
                            <Field 
                                type="text" 
                                name="photo" 
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                placeholder="https://example.com/photo.jpg" 
                            />
                            <ErrorMessage name="photo" component="p" className="text-red-500 text-sm mt-1" />
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
                            {mode === 1 ? "Crear Perfil" : "Actualizar Perfil"}
                        </button>
                    </Form>
                </div>
            )}
        </Formik>
    );
};

export default ProfileFormValidator;
