import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/app';
import { steps } from '../src/form-config';
import { initialFormValues } from '../src/form-values';

test('the form defines all ten fields across three steps', () => {
  expect(steps.flatMap((step) => step.fields)).toEqual(
    Object.keys(initialFormValues),
  );
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
