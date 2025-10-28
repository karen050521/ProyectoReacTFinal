import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import type { Permission } from '../../models/Permission';

interface PermissionFormProps {
  initialValues: Partial<Permission>;
  mode: number;
  onSubmit: (values: Partial<Permission>) => void;
}

const PermissionFormValidator: React.FC<PermissionFormProps> = ({
  initialValues,
  mode,
  onSubmit,
}) => {
  const validationSchema = Yup.object({
    url: Yup.string()
      .required('La URL es obligatoria')
      .min(1, 'La URL debe tener al menos 1 carácter')
      .max(255, 'La URL no puede exceder 255 caracteres'),
    method: Yup.string()
      .required('El método es obligatorio')
      .oneOf(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 'Método HTTP inválido'),
  });

  const defaultValues: Partial<Permission> = {
    url: '',
    method: 'GET',
    ...initialValues,
  };

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          <div>
            <label htmlFor="url" className="mb-2.5 block text-black dark:text-white">
              URL <span className="text-meta-1">*</span>
            </label>
            <Field
              type="text"
              name="url"
              id="url"
              placeholder="Ingrese la URL del endpoint"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            <ErrorMessage
              name="url"
              component="div"
              className="mt-1 text-sm text-meta-1"
            />
          </div>

          <div>
            <label htmlFor="method" className="mb-2.5 block text-black dark:text-white">
              Método HTTP <span className="text-meta-1">*</span>
            </label>
            <Field
              as="select"
              name="method"
              id="method"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </Field>
            <ErrorMessage
              name="method"
              component="div"
              className="mt-1 text-sm text-meta-1"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
          >
            {mode === 1 ? 'Crear Permiso' : 'Actualizar Permiso'}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default PermissionFormValidator;
