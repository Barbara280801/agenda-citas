# Research: Agenda de citas para pequeños negocios

## Build and runtime

**Decision**: Use Vite with its React JavaScript starter and produce a static browser application.

**Rationale**: The app has no server-side requirements. Vite supplies a development server and a static production build while keeping the project setup small. Browser storage remains local to the served origin; development and deployed origins do not share appointments.

**Alternatives considered**: Parcel is also a viable lightweight bundler. React frameworks such as React Router or Next.js are unnecessary unless routing, server rendering, or server features enter scope. Create React App is deprecated for new projects.

Sources: [Vite guide](https://vite.dev/guide/), [Vite static deployment](https://vite.dev/guide/static-deploy), [React: Build an app from scratch](https://react.dev/learn/build-a-react-app-from-scratch), [React: Sunsetting Create React App](https://react.dev/blog/2025/02/14/sunsetting-create-react-app).

## Appointment persistence

**Decision**: Store a versioned JSON envelope under one stable localStorage key. On read, catch storage access and JSON parsing errors, then validate the version, record shape, required text, date/time, and allowed status. Show an empty usable agenda with a Spanish recovery message for invalid stored data. Do not silently overwrite malformed data. Catch write failures and tell the user that the current session remains usable but changes may not survive reload.

**Rationale**: Web Storage holds strings; parsing alone does not ensure stored values match the application model. Storage access and writes can fail as well as parsing. An explicit schema version provides a migration signal without requiring a migration system in this first version.

**Alternatives considered**: A bare array is simpler but has no explicit schema-version signal. A versioned key is another option but complicates discovering previous data. Silently replacing invalid data with an empty list risks discarding recoverable appointments.

Sources: [WHATWG Web Storage](https://html.spec.whatwg.org/multipage/webstorage.html), [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), [MDN Storage.setItem()](https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem).

## Test approach

**Decision**: Use Vitest, React Testing Library, `@testing-library/user-event`, and jsdom for domain and component tests. Use Playwright for at least one real-browser workflow that reloads the page and verifies persisted appointment data and state.

**Rationale**: Vitest integrates with the recommended Vite toolchain. Testing Library exercises user-visible behavior and interactions. A real browser reload verifies persistence beyond a component remount and covers actual browser storage behavior.

**Alternatives considered**: Jest with Testing Library is viable but adds a separate test-runner choice. Playwright alone is heavier for fast domain/component checks. `happy-dom` is a possible lighter component environment, with different browser API coverage from jsdom.

Sources: [Vitest guide](https://vitest.dev/guide/), [Vitest environments](https://vitest.dev/guide/environment), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/), [user-event](https://testing-library.com/docs/user-event/intro/), [Playwright page.reload()](https://playwright.dev/docs/api/class-page#page-reload).

## Local date and ordering behavior

**Decision**: Interpret the date and time selected in the form as local browser time. Classify an appointment as past only when its combined local date/time is earlier than the current local time. Sort future appointments ascending and past appointments descending; use stable sorting so ties preserve registration order.

**Rationale**: The specification permits past appointments and requires same-date ordering by time, with stable order for exact ties. Local date/time avoids implying time-zone selection or remote calendar synchronization that is outside scope.

**Alternatives considered**: UTC normalization or explicit time-zone selection would add behavior and UI not required for a single-browser agenda.