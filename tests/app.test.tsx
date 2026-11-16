import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/app';
import { createAppStore, setField } from '../src/form-store';

const formData = {
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

function setup() {
  const user = userEvent.setup();
  render(<App />);
  return user;
}

function expectProgress(
  statuses: [
    'current' | 'complete' | 'upcoming',
    'current' | 'complete' | 'upcoming',
    'current' | 'complete' | 'upcoming',
  ],
) {
  const steps = within(
    screen.getByRole('navigation', { name: 'Progress' }),
  ).getAllByRole('listitem');

  expect(steps).toHaveLength(3);
  const names = ['Profile', 'Personal information', 'Address'];
  const numbers = ['01', '02', '03'];

  for (const [index, step] of steps.entries()) {
    expect(step).toHaveTextContent(names[index]);
    const currentMarker = step.querySelector('[aria-current="step"]');
    const checkIcon = step.querySelector('svg[viewBox="0 0 24 24"]');

    if (statuses[index] === 'current') {
      expect(currentMarker).not.toBeNull();
      expect(within(step).getByText(numbers[index])).toBeVisible();
    } else if (statuses[index] === 'complete') {
      expect(currentMarker).toBeNull();
      expect(checkIcon).not.toBeNull();
      expect(within(step).queryByText(numbers[index])).not.toBeInTheDocument();
    } else {
      expect(currentMarker).toBeNull();
      expect(checkIcon).toBeNull();
      expect(within(step).getByText(numbers[index])).toBeVisible();
    }
  }
}

function expectInlineError(label: string, message: RegExp) {
  const control = screen.getByLabelText(label);
  const field = control.closest('[data-slot="control"]')?.parentElement;

  expect(field).toBeTruthy();
  const error = field?.querySelector('[data-slot="error"]');
  expect(error).toBeVisible();
  expect(error).toHaveTextContent(message);
  expect(control).toHaveAttribute('data-invalid');
}

async function fillProfile(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Username'), formData.username);
  await user.type(screen.getByLabelText('About'), formData.about);
}

async function fillPersonal(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('First name'), formData['first-name']);
  await user.type(screen.getByLabelText('Last name'), formData['last-name']);
  await user.type(screen.getByLabelText('Email address'), formData.email);
}

async function fillAddress(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(screen.getByLabelText('Country'), formData.country);
  await user.type(
    screen.getByLabelText('Street address'),
    formData['street-address'],
  );
  await user.type(screen.getByLabelText('City'), formData.city);
  await user.type(screen.getByLabelText('State / Province'), formData.region);
  await user.type(
    screen.getByLabelText('ZIP / Postal code'),
    formData['postal-code'],
  );
}

async function goToPersonal(user: ReturnType<typeof userEvent.setup>) {
  await fillProfile(user);
  await user.click(screen.getByRole('button', { name: 'Next' }));
}

async function goToAddress(user: ReturnType<typeof userEvent.setup>) {
  await goToPersonal(user);
  await fillPersonal(user);
  await user.click(screen.getByRole('button', { name: 'Next' }));
}

describe('multi-step form', () => {
  test('starts on Profile with only its fields and Next available', () => {
    setup();

    expect(screen.getByLabelText('Username')).toBeVisible();
    expect(screen.getByLabelText('About')).toBeVisible();
    expect(
      screen.queryByRole('textbox', { name: 'First name' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('combobox', { name: 'Country' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Previous' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Submit' }),
    ).not.toBeInTheDocument();
    expectProgress(['current', 'upcoming', 'upcoming']);
  });

  test('shows inline required errors and blocks an empty Profile step', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'Next' }));

    expectInlineError('Username', /required|enter|provide/i);
    expectInlineError('About', /required|enter|provide/i);
    expect(screen.getByLabelText('Username')).toBeVisible();
    expectProgress(['current', 'upcoming', 'upcoming']);
  });

  test('validates the username minimum on blur and accepts exactly three characters', async () => {
    const user = setup();
    const username = screen.getByLabelText('Username');

    await user.type(username, 'ab');
    await user.tab();
    expectInlineError('Username', /3.*character|character.*3/i);

    await user.type(username, 'c');
    await user.type(screen.getByLabelText('About'), formData.about);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByLabelText('First name')).toBeVisible();
  });

  test('rejects whitespace-only required Profile values', async () => {
    const user = setup();
    await user.type(screen.getByLabelText('Username'), '   ');
    await user.type(screen.getByLabelText('About'), '   ');
    await user.click(screen.getByRole('button', { name: 'Next' }));

    expectInlineError('Username', /required|enter|provide|3.*character/i);
    expectInlineError('About', /required|enter|provide/i);
    expectProgress(['current', 'upcoming', 'upcoming']);
  });

  test('moves to Personal information only after Profile is valid', async () => {
    const user = setup();
    await goToPersonal(user);

    expect(screen.getByLabelText('First name')).toBeVisible();
    expect(screen.getByLabelText('Last name')).toBeVisible();
    expect(screen.getByLabelText('Email address')).toBeVisible();
    expect(
      screen.queryByRole('textbox', { name: 'Username' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('combobox', { name: 'Country' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Next' })).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Submit' }),
    ).not.toBeInTheDocument();
    expectProgress(['complete', 'current', 'upcoming']);
  });

  test('shows inline required errors and blocks an empty Personal information step', async () => {
    const user = setup();
    await goToPersonal(user);
    await user.click(screen.getByRole('button', { name: 'Next' }));

    expectInlineError('First name', /required|enter|provide/i);
    expectInlineError('Last name', /required|enter|provide/i);
    expectInlineError('Email address', /required|enter|provide/i);
    expect(screen.getByLabelText('First name')).toBeVisible();
    expectProgress(['complete', 'current', 'upcoming']);
  });

  test.each([
    'not-an-email',
    'jane@',
  ])('rejects invalid email %s on blur and blocks Next', async (invalidEmail) => {
    const user = setup();
    await goToPersonal(user);
    await user.type(
      screen.getByLabelText('First name'),
      formData['first-name'],
    );
    await user.type(screen.getByLabelText('Last name'), formData['last-name']);
    await user.type(screen.getByLabelText('Email address'), invalidEmail);
    await user.tab();

    expectInlineError(
      'Email address',
      /valid.*email|email.*valid|invalid.*email/i,
    );
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expectProgress(['complete', 'current', 'upcoming']);
    expect(screen.getByLabelText('Email address')).toBeVisible();
  });

  test('moves to Address with Previous and Submit after valid personal information', async () => {
    const user = setup();
    await goToAddress(user);

    for (const label of [
      'Country',
      'Street address',
      'City',
      'State / Province',
      'ZIP / Postal code',
    ]) {
      expect(screen.getByLabelText(label)).toBeVisible();
    }
    expect(
      screen.queryByRole('textbox', { name: 'Email address' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Next' }),
    ).not.toBeInTheDocument();
    expectProgress(['complete', 'complete', 'current']);
  });

  test('shows inline required errors for every Address field and prevents submission', async () => {
    const user = setup();
    await goToAddress(user);
    const log = jest.spyOn(console, 'log').mockImplementation(() => {});

    try {
      await user.click(screen.getByRole('button', { name: 'Submit' }));

      for (const label of [
        'Country',
        'Street address',
        'City',
        'State / Province',
        'ZIP / Postal code',
      ]) {
        expectInlineError(label, /required|enter|provide|select/i);
      }
      expect(log).not.toHaveBeenCalled();
      expectProgress(['complete', 'complete', 'current']);
    } finally {
      log.mockRestore();
    }
  });

  test('Previous works with incomplete fields and preserves all entered values', async () => {
    const user = setup();
    await goToPersonal(user);
    await user.type(
      screen.getByLabelText('First name'),
      formData['first-name'],
    );
    await user.click(screen.getByRole('button', { name: 'Previous' }));

    expect(screen.getByLabelText('Username')).toHaveValue(formData.username);
    expect(screen.getByLabelText('About')).toHaveValue(formData.about);
    expectProgress(['current', 'upcoming', 'upcoming']);

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByLabelText('First name')).toHaveValue(
      formData['first-name'],
    );
    await user.type(screen.getByLabelText('Last name'), formData['last-name']);
    await user.type(screen.getByLabelText('Email address'), formData.email);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await fillAddress(user);

    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByLabelText('First name')).toHaveValue(
      formData['first-name'],
    );
    expect(screen.getByLabelText('Last name')).toHaveValue(
      formData['last-name'],
    );
    expect(screen.getByLabelText('Email address')).toHaveValue(formData.email);
    expectProgress(['complete', 'current', 'upcoming']);

    await user.click(screen.getByRole('button', { name: 'Next' }));
    for (const [label, value] of [
      ['Country', formData.country],
      ['Street address', formData['street-address']],
      ['City', formData.city],
      ['State / Province', formData.region],
      ['ZIP / Postal code', formData['postal-code']],
    ]) {
      expect(screen.getByLabelText(label)).toHaveValue(value);
    }
    expectProgress(['complete', 'complete', 'current']);
  });

  test('submits one complete object with all fields when every step is valid', async () => {
    const user = setup();
    await goToAddress(user);
    await fillAddress(user);
    const log = jest.spyOn(console, 'log').mockImplementation(() => {});

    try {
      await user.click(screen.getByRole('button', { name: 'Submit' }));
      expect(log).toHaveBeenCalledTimes(1);
      expect(log).toHaveBeenCalledWith(formData);
    } finally {
      log.mockRestore();
    }
  });

  test('checks earlier step values again before final submission', async () => {
    const store = createAppStore();
    const user = userEvent.setup();
    render(<App store={store} />);
    await goToAddress(user);
    await fillAddress(user);
    act(() => store.dispatch(setField({ name: 'username', value: 'ab' })));
    const log = jest.spyOn(console, 'log').mockImplementation(() => {});

    try {
      await user.click(screen.getByRole('button', { name: 'Submit' }));
      expect(log).not.toHaveBeenCalled();
      expectInlineError('Username', /3.*character|character.*3/i);
      expectProgress(['current', 'upcoming', 'upcoming']);
    } finally {
      log.mockRestore();
    }
  });
});
