# SMS Automation Project

This repository contains Playwright-based automated tests for the SMS web application.

## Structure

- **tests/**: Contains Playwright test specifications organized by feature.
- **specs/**: Planning documents and test plans in markdown format.
- **pages/**: Page Object Model definitions for various application pages.
- **data/**: Test data files and configuration.
- **helpers/**: Utility scripts and common routines.
- **playwright.config.js**: Playwright configuration file.
- **package.json**: Node dependencies and scripts.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run tests:
   ```bash
   npx playwright test
   ```
3. View reports:
   - Playwright HTML report: `playwright-report/index.html`
   - Allure report: `allure-report/index.html`

## Adding Tests

- Add new page objects under `pages/`.
- Create test cases in `tests/` using existing patterns.
- Use fixtures and helpers from `helpers/` to streamline setup.

## Contributing

Follow the repository style and keep tests idempotent.

## License

Specify license if applicable.