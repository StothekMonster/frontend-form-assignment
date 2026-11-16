import type { Resolver } from 'react-hook-form';
import { fieldLabels, minimumUsernameLength, steps } from './form-config';
import type { FormFieldName, FormValues } from './form-values';

function validationError(name: FormFieldName, value: string) {
  const trimmed = value.trim();
  if (!trimmed) return `${fieldLabels[name]} is required`;
  if (name === 'username' && trimmed.length < minimumUsernameLength) {
    return `${fieldLabels[name]} must be at least ${minimumUsernameLength} characters`;
  }
  if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return 'Enter a valid email address';
  }
  return undefined;
}

export const formResolver: Resolver<FormValues> = async (values) => {
  const errors: Record<string, { type: string; message: string }> = {};
  for (const { fields } of steps) {
    for (const name of fields) {
      const message = validationError(name, values[name]);
      if (message) errors[name] = { type: 'validate', message };
    }
  }
  return { values: Object.keys(errors).length ? {} : values, errors };
};
