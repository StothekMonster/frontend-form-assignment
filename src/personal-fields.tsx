import { Input } from './components/input';
import { FormField } from './form-fields';

const grid = 'grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6';

export function PersonalFields() {
  return (
    <div className={grid}>
      <div className="sm:col-span-3">
        <FormField name="first-name" label="First name">
          {(control) => (
            <Input
              id="first-name"
              type="text"
              autoComplete="given-name"
              {...control}
            />
          )}
        </FormField>
      </div>
      <div className="sm:col-span-3">
        <FormField name="last-name" label="Last name">
          {(control) => (
            <Input
              id="last-name"
              type="text"
              autoComplete="family-name"
              {...control}
            />
          )}
        </FormField>
      </div>
      <div className="sm:col-span-4">
        <FormField name="email" label="Email address">
          {(control) => (
            <Input id="email" type="email" autoComplete="email" {...control} />
          )}
        </FormField>
      </div>
    </div>
  );
}
