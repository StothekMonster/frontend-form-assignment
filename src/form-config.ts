import type { FormFieldName } from './form-values';

export const fieldLabels: Record<FormFieldName, string> = {
  username: 'Username',
  about: 'About',
  'first-name': 'First name',
  'last-name': 'Last name',
  email: 'Email address',
  country: 'Country',
  'street-address': 'Street address',
  city: 'City',
  region: 'State / Province',
  'postal-code': 'ZIP / Postal code',
};

export const steps: { name: string; fields: FormFieldName[] }[] = [
  { name: 'Profile', fields: ['username', 'about'] },
  {
    name: 'Personal information',
    fields: ['first-name', 'last-name', 'email'],
  },
  {
    name: 'Address',
    fields: ['country', 'street-address', 'city', 'region', 'postal-code'],
  },
];

export const countries = ['United States', 'Canada', 'Mexico'];
export const minimumUsernameLength = 3;
