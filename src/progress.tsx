import { CheckIcon } from '@heroicons/react/24/solid';

import { steps } from './form-config';

export function Progress({ currentStep }: { currentStep: number }) {
  return (
    <nav aria-label="Progress">
      <ol className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0 dark:divide-white/15 dark:border-white/15">
        {steps.map(({ name }, index) => {
          const complete = index < currentStep;
          const current = index === currentStep;
          return (
            <li key={name} className="relative md:flex md:flex-1">
              <div
                aria-current={current ? 'step' : undefined}
                className="flex w-full items-center px-6 py-4 text-sm font-medium"
              >
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full ${complete ? 'bg-indigo-600 dark:bg-indigo-500' : current ? 'border-2 border-indigo-600 dark:border-indigo-400' : 'border-2 border-gray-300 dark:border-white/15'}`}
                >
                  {complete ? (
                    <CheckIcon
                      aria-hidden="true"
                      className="size-6 text-white"
                    />
                  ) : (
                    <span
                      className={
                        current
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  )}
                </span>
                <span
                  className={`ml-4 text-sm font-medium ${current ? 'text-indigo-600 dark:text-indigo-400' : complete ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  {name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="absolute top-0 right-0 hidden h-full w-5 md:block"
                >
                  <svg
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 22 80"
                    preserveAspectRatio="none"
                    className="size-full text-gray-300 dark:text-white/15"
                  >
                    <path
                      d="M0 -2L20 40L0 82"
                      stroke="currentcolor"
                      vectorEffect="non-scaling-stroke"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
