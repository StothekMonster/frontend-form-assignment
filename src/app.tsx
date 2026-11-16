import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { AddressFields } from './address-fields';
import { Button } from './components/button';
import { steps } from './form-config';
import { formResolver } from './form-validation';
import { type FormValues, initialFormValues } from './form-values';
import { PersonalFields } from './personal-fields';
import { ProfileFields } from './profile-fields';
import { Progress } from './progress';

function FormContent() {
  const [step, setStep] = useState(0);
  const form = useForm<FormValues>({
    defaultValues: initialFormValues,
    resolver: formResolver,
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  async function advance() {
    if (await form.trigger(steps[step].fields)) setStep(step + 1);
  }

  const submit = form.handleSubmit((values) => console.log(values));

  return (
    <FormProvider {...form}>
      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-center w-full p-8">
        <div className="w-2xl">
          <Progress currentStep={step} />
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              if (step === steps.length - 1) void submit();
              else void advance();
            }}
            className="bg-white mt-8 w-full shadow-xs outline outline-gray-900/5 sm:rounded-xl md:col-span-2 dark:bg-gray-800/50 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
          >
            <div className="px-4 py-6 sm:p-8">
              {step === 0 && <ProfileFields />}
              {step === 1 && <PersonalFields />}
              {step === steps.length - 1 && <AddressFields />}
            </div>
            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8 dark:border-white/10">
              {step > 0 && (
                <Button type="button" outline onClick={() => setStep(step - 1)}>
                  Previous
                </Button>
              )}
              <Button type="submit" color="indigo">
                {step === steps.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
}

function App() {
  return <FormContent />;
}

export default App;
