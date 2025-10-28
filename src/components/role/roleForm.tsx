import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import type { Role } from '../../models/Role';

interface RoleFormProps {
  initialValues: Partial<Role>;
  mode: number;
  onSubmit: (values: Partial<Role>) => void;
}

const RoleFormValidator: React.FC<RoleFormProps> = ({
  initialValues,
  mode,
  onSubmit,
}) => {
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('El nombre es obligatorio')
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(100, 'El nombre no puede exceder 100 caracteres'),
    description: Yup.string()
      .nullable()
      .max(500, 'La descripción no puede exceder 500 caracteres'),
  });

  const defaultValues: Partial<Role> = {
    name: '',
    description: '',
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
            <label htmlFor="name" className="mb-2.5 block text-black dark:text-white">
              Nombre <span className="text-meta-1">*</span>
            </label>
            <Field
              type="text"
              name="name"
              id="name"
              placeholder="Ingrese el nombre del rol"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="mt-1 text-sm text-meta-1"
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-2.5 block text-black dark:text-white">
              Descripción
            </label>
            <Field
              as="textarea"
              name="description"
              id="description"
              rows={4}
              placeholder="Ingrese una descripción del rol (opcional)"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            <ErrorMessage
              name="description"
              component="div"
              className="mt-1 text-sm text-meta-1"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
          >
            {mode === 1 ? 'Crear Rol' : 'Actualizar Rol'}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default RoleFormValidator;
