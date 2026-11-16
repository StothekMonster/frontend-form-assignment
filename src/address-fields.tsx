import { Input } from './components/input';
import { Select } from './components/select';
import { FormField } from './form-fields';

const grid = 'grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6';

export function AddressFields() {
  return (
    <div className={grid}>
      <div className="sm:col-span-3">
        <FormField name="country" label="Country">
          {(control) => (
            <Select id="country" autoComplete="country-name" {...control}>
              <option value="">Choose a country</option>
              <option>United States</option>
              <option>Canada</option>
              <option>Mexico</option>
            </Select>
          )}
        </FormField>
      </div>
      <div className="col-span-full">
        <FormField name="street-address" label="Street address">
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
        <FormField name="city" label="City">
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
        <FormField name="region" label="State / Province">
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
        <FormField name="postal-code" label="ZIP / Postal code">
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
