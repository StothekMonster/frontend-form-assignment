import {
  configureStore,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

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

const formSlice = createSlice({
  name: 'form',
  initialState: { values: initialFormValues },
  reducers: {
    setField(
      state,
      action: PayloadAction<{ name: FormFieldName; value: string }>,
    ) {
      state.values[action.payload.name] = action.payload.value;
    },
  },
});

export const { setField } = formSlice.actions;

export function createAppStore() {
  return configureStore({ reducer: { form: formSlice.reducer } });
}

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
