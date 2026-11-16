import { Description } from './components/fieldset';
import { Input } from './components/input';
import { Textarea } from './components/textarea';
import { FormField } from './form-fields';

const grid = 'grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6';

export function ProfileFields() {
  return (
    <div className={grid}>
      <div className="sm:col-span-4">
        <FormField name="username">
          {(control) => (
            <Input
              id="username"
              type="text"
              placeholder="janesmith"
              {...control}
            />
          )}
        </FormField>
      </div>
      <div className="col-span-full">
        <FormField name="about">
          {(control) => (
            <>
              <Textarea id="about" rows={3} {...control} />
              <Description>Write a few sentences about yourself.</Description>
            </>
          )}
        </FormField>
      </div>
    </div>
  );
}
