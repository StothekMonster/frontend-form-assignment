export type FormValues = {
  username: string;
  about: string;
  'first-name': string;
  'last-name': string;
  email: string;
  country: string;
  'street-address': string;
  city: string;
  region: string;
  'postal-code': string;
};

export type FormFieldName = keyof FormValues;

export const initialFormValues: FormValues = {
  username: '',
  about: '',
  'first-name': '',
  'last-name': '',
  email: '',
  country: '',
  'street-address': '',
  city: '',
  region: '',
  'postal-code': '',
};
