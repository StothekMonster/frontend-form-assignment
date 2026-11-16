import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/app';
import {
  createAppStore,
  type FormFieldName,
  type FormValues,
  initialFormValues,
  setField,
} from '../src/form-store';

const completedValues: FormValues = {
  username: 'janesmith',
  about: 'I enjoy building accessible interfaces.',
  'first-name': 'Jane',
  'last-name': 'Smith',
  email: 'jane@example.com',
  country: 'Canada',
  'street-address': '123 Main Street',
  city: 'Toronto',
  region: 'Ontario',
  'postal-code': 'M5V 2T6',
};

test('Redux initializes and stores all ten form fields', () => {
  const store = createAppStore();
  expect(store.getState().form.values).toEqual(initialFormValues);

  for (const [name, value] of Object.entries(completedValues)) {
    store.dispatch(setField({ name: name as FormFieldName, value }));
  }

  expect(store.getState().form.values).toEqual(completedValues);
});

test('typing in Profile updates the Redux form values', async () => {
  const store = createAppStore();
  const user = userEvent.setup();
  render(<App store={store} />);

  await user.type(screen.getByLabelText('Username'), completedValues.username);
  await user.type(screen.getByLabelText('About'), completedValues.about);

  expect(store.getState().form.values).toMatchObject({
    username: completedValues.username,
    about: completedValues.about,
  });
});

test('React Hook Form reports Profile errors on blur', async () => {
  const user = userEvent.setup();
  render(<App />);

  const username = screen.getByLabelText('Username');
  await user.type(username, 'ab');
  await user.tab();

  const usernameField = username.closest(
    '[data-slot="control"]',
  )?.parentElement;
  expect(usernameField).toBeTruthy();
  expect(
    within(usernameField as HTMLElement).getByText(/at least 3 characters/i),
  ).toBeVisible();
  expect(username).toHaveAttribute('data-invalid');

  const about = screen.getByLabelText('About');
  await user.type(about, '   ');
  await user.tab();

  const aboutField = about.closest('[data-slot="control"]')?.parentElement;
  expect(aboutField).toBeTruthy();
  expect(
    within(aboutField as HTMLElement).getByText(/about is required/i),
  ).toBeVisible();
  expect(about).toHaveAttribute('data-invalid');
});
