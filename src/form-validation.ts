import type { RegisterOptions } from 'react-hook-form';
import type { FormValues } from './form-store';

type Rules = {
  [Name in keyof FormValues]: RegisterOptions<FormValues, Name>;
};

function required(label: string) {
  return (value: string) => value.trim().length > 0 || `${label} is required`;
}

export const validationRules: Rules = {
  username: {
    validate: {
      required: required('Username'),
      minLength: (value) =>
        value.trim().length >= 3 || 'Username must be at least 3 characters',
    },
  },
  about: { validate: required('About') },
  'first-name': { validate: required('First name') },
  'last-name': { validate: required('Last name') },
  email: {
    validate: {
      required: required('Email address'),
      format: (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ||
        'Enter a valid email address',
    },
  },
  country: { validate: required('Country') },
  'street-address': { validate: required('Street address') },
  city: { validate: required('City') },
  region: { validate: required('State / Province') },
  'postal-code': { validate: required('ZIP / Postal code') },
};

export function validationError(name: keyof FormValues, value: string) {
  const validate = validationRules[name].validate;
  if (typeof validate === 'function') {
    const result = validate(value, {} as FormValues);
    return typeof result === 'string' ? result : undefined;
  }
  if (validate && typeof validate === 'object') {
    for (const check of Object.values(validate)) {
      const result = check(value, {} as FormValues);
      if (typeof result === 'string') return result;
    }
  }
  return undefined;
}
