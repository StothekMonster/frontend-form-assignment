import type { ChangeEvent, ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorMessage, Field, Label } from './components/fieldset';
import {
  type AppDispatch,
  type FormFieldName,
  type FormValues,
  type RootState,
  setField,
} from './form-store';
import { validationRules } from './form-validation';

export function useFormField(name: FormFieldName) {
  const dispatch = useDispatch<AppDispatch>();
  const value = useSelector((state: RootState) => state.form.values[name]);
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();
  const registered = register(name, validationRules[name]);
  const error = errors[name];

  return {
    error,
    control: {
      ...registered,
      value,
      'aria-invalid': error ? true : undefined,
      'data-invalid': error ? true : undefined,
      onChange: (
        event: ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => {
        void registered.onChange(event);
        dispatch(setField({ name, value: event.target.value }));
      },
    },
  };
}

export function FormField({
  name,
  label,
  children,
}: {
  name: FormFieldName;
  label: string;
  children: (control: ReturnType<typeof useFormField>['control']) => ReactNode;
}) {
  const { control, error } = useFormField(name);
  return (
    <Field>
      <Label htmlFor={name}>{label}</Label>
      {children(control)}
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </Field>
  );
}
