# Quickstart: Validation Guide

## Prerequisites

- Node.js 20.19+ or 22.12+ and npm, as required by the selected Vite release.
- A modern desktop or mobile browser.
- The implementation of this feature in the repository root.

## Run locally

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite. Browser storage is scoped to that origin, so data created on the development URL is separate from data on a deployed site.

## Automated checks

```powershell
npm run test
npx playwright install chromium
npm run test:e2e
npm run build
```

The unit/component suite must cover required-field feedback (including multiple missing fields and whitespace-only text), appointment ordering (future/past and stable ties), status changes without data mutation, and recovery from missing or invalid storage. The browser suite must create an appointment, change its status, reload the page, and verify that the appointment and status are restored. Confirm the main workflows remain usable at a narrow mobile viewport without horizontal scrolling.

Expected result: all 16 unit/component tests and both Chromium browser tests pass, `npm run build` completes, and the user-visible appointment and status survive a browser reload on the same origin. The narrow-screen check confirms the form and status action remain visible without horizontal overflow. No external service is needed to register, view, update, or persist appointments.

See [data-model.md](data-model.md) and [UI and Storage Contract](contracts/ui-and-storage.md) for the precise rules.