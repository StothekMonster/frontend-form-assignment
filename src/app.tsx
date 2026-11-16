import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Provider, useSelector } from 'react-redux';
import { AddressFields } from './address-fields';
import { Button } from './components/button';
import {
  type AppStore,
  createAppStore,
  type FormFieldName,
  type FormValues,
  type RootState,
} from './form-store';
import { validationError } from './form-validation';
import { PersonalFields } from './personal-fields';
import { ProfileFields } from './profile-fields';
import { Progress } from './progress';

const stepFields: FormFieldName[][] = [
  ['username', 'about'],
  ['first-name', 'last-name', 'email'],
  ['country', 'street-address', 'city', 'region', 'postal-code'],
];

function FormContent() {
  const [step, setStep] = useState(0);
  const values = useSelector((state: RootState) => state.form.values);
  const form = useForm<FormValues>({
    defaultValues: values,
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  async function advance() {
    if (await form.trigger(stepFields[step])) setStep(step + 1);
  }

  async function submit() {
    if (!(await form.trigger(stepFields[step]))) return;
    for (const [index, fields] of stepFields.entries()) {
      for (const name of fields) {
        const message = validationError(name, values[name]);
        if (message) {
          setStep(index);
          form.setError(name, { message });
          return;
        }
      }
    }
    console.log(values);
  }

  return (
    <FormProvider {...form}>
      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-center w-full p-8">
        <div className="w-2xl">
          <Progress currentStep={step} />
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              if (step === 2) void submit();
              else void advance();
            }}
            className="bg-white mt-8 w-full shadow-xs outline outline-gray-900/5 sm:rounded-xl md:col-span-2 dark:bg-gray-800/50 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
          >
            <div className="px-4 py-6 sm:p-8">
              {step === 0 && <ProfileFields />}
              {step === 1 && <PersonalFields />}
              {step === 2 && <AddressFields />}
            </div>
            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8 dark:border-white/10">
              {step > 0 && (
                <Button type="button" outline onClick={() => setStep(step - 1)}>
                  Previous
                </Button>
              )}
              <Button type="submit" color="indigo">
                {step === 2 ? 'Submit' : 'Next'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
}

function App({ store }: { store?: AppStore }) {
  const [localStore] = useState(createAppStore);
  return (
    <Provider store={store ?? localStore}>
      <FormContent />
    </Provider>
  );
}

export default App;
