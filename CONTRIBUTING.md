# Contributing to Penny Wise

Welcome to the Penny Wise project! This is a part of the freeCodeCamp Summer 2026 Cohort. This document covers how to claim an issue, which style guides to follow, and how to submit a Pull Request.

## Claiming an issue

1. Find an open issue that isn't already claimed,
2. Comment on the issue to claim it (e.g. "I'm claiming this one").

Please only work on one one issue at a time so everyone gets a fair chance to contribute to this project.

## Making changes

1. Fork the repository.
2. Create a branch with a name containing a short description of what you're working on.
3. Make your changes. Keep the Pull Request scoped to the claimed issue - if you spot something else in need of fixing, open a separate issue for it.
4. When naming commits, try to stick to the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) naming convention ([A freeCodeCamp guide about using Conventional Commits](https://www.freecodecamp.org/news/how-to-write-better-git-commit-messages/)).
5. If applicable, create and run tests for your changes before opening a Pull Request.
6. Open your PR against the `main` branch, and in its description, reference the issue it closes (e.g. `Closes #9`).

## Reviewing and Merging Pull Requests

- Each team member can (and is encouraged to) write reviews for the other team members Pull Requests.
- Only the Team Leader is allowed to merge the reviewed PRs to the `main` branch.

## Code Style Guide

1. Keep functions small and readable.
2. Use single quotation marks (`''`).
3. End files with a "Line Feed" (`LF`).

## File Names

File names should be planned to be used in a Linux System. This means, they are case sensitive.

- use lower case names written in kebab-case for all files, except for
- React classes or modules, which should use PascalCase.

## Tools for Linting and Styling

Before submitting your changes, you can run the following scripts from either `/frontend` or `/backend` directories to check for linting and styling errors:

- `npm run lint` to check for potential issues, like declared but unused variables,
- `npm run format:check` to make sure the style in your changes correspond to the guidelines,
- `npm run format` to automatically format your code according to the rules.

### Configuring Git Hook

You should configure the git hook to automatically run the linter or formatter.
`cd` to the root dir of this repo, run `npm install`, then run `npx lefthook install` from the root to register the git hooks.
Now, all changes are automatically linted and formatted before being committed.

To lint the entire repo manually, run `npm run lefthook -- run pre-commit`

Reference, [prettier lefthook](https://prettier.io/docs/precommit#option-5-lefthook).

---

If anything here is still unclear, please reach out to the team's Discord channel.
