import type { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import { ErrorMessage, Field, Label } from './components/fieldset';
import { fieldLabels } from './form-config';
import type { FormFieldName, FormValues } from './form-values';

export function FormField({
  name,
  children,
}: {
  name: FormFieldName;
  children: (
    control: ReturnType<
      ReturnType<typeof useFormContext<FormValues>>['register']
    >,
  ) => ReactNode;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();
  const error = errors[name];
  const control = {
    ...register(name),
    'aria-invalid': error ? true : undefined,
    'data-invalid': error ? true : undefined,
  };
  return (
    <Field>
      <Label htmlFor={name}>{fieldLabels[name]}</Label>
      {children(control)}
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </Field>
  );
}
