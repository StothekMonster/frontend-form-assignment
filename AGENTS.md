# Agent instructions

- Prefer the simplest solution that meets the requirement. Avoid unnecessary abstractions, dependencies, and speculative features.
- Prioritize speed: make focused changes, reuse existing patterns, and avoid unrelated refactoring.
- Before saying a code task is finished, run the unit tests with `pnpm test`. Fix failures caused by your changes. If tests cannot run, say why and do not claim they passed.
