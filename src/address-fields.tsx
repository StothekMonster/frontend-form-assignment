import { Input } from './components/input';
import { Select } from './components/select';
import { countries } from './form-config';
import { FormField } from './form-fields';

const grid = 'grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6';

export function AddressFields() {
  return (
    <div className={grid}>
      <div className="sm:col-span-3">
        <FormField name="country">
          {(control) => (
            <Select id="country" autoComplete="country-name" {...control}>
              <option value="">Choose a country</option>
              {countries.map((country) => (
                <option key={country}>{country}</option>
              ))}
            </Select>
          )}
        </FormField>
      </div>
      <div className="col-span-full">
        <FormField name="street-address">
          {(control) => (
            <Input
              id="street-address"
              type="text"
              autoComplete="street-address"
              {...control}
            />
          )}
        </FormField>
      </div>
      <div className="sm:col-span-2 sm:col-start-1">
        <FormField name="city">
          {(control) => (
            <Input
              id="city"
              type="text"
              autoComplete="address-level2"
              {...control}
            />
          )}
        </FormField>
      </div>
      <div className="sm:col-span-2">
        <FormField name="region">
          {(control) => (
            <Input
              id="region"
              type="text"
              autoComplete="address-level1"
              {...control}
            />
          )}
        </FormField>
      </div>
      <div className="sm:col-span-2">
        <FormField name="postal-code">
          {(control) => (
            <Input
              id="postal-code"
              type="text"
              autoComplete="postal-code"
              {...control}
            />
          )}
        </FormField>
      </div>
    </div>
  );
}
