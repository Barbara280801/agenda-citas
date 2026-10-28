# Implementation Plan: Agenda de citas para pequeños negocios

**Branch**: `001-agenda-citas` | **Date**: 2026-10-28 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-agenda-citas/spec.md`

## Summary

Deliver a Spanish-language appointment agenda for one small business user in one browser. Build a responsive React application with JavaScript and CSS, using Vite for development and static production builds. Validate appointments in reusable domain functions, keep them in browser `localStorage`, and separate future and past appointments with deterministic ordering. There is no backend, account system, synchronization, or external service.

## Technical Context

**Language/Version**: JavaScript (ES modules; modern browser support); Node.js 20.19+ or 22.12+ for Vite tooling

**Primary Dependencies**: React; Vite React JavaScript starter; Vitest, React Testing Library, `@testing-library/user-event`, jsdom; Playwright for browser reload coverage

**Storage**: Browser `localStorage`, using a versioned JSON envelope and runtime validation

**Testing**: Vitest for domain and component behavior; Playwright for reload persistence and responsive browser checks

**Target Platform**: Modern desktop and mobile browsers, served from a static host or Vite development server

**Project Type**: Client-side web application

**Performance Goals**: Immediate local form and status interactions for a personal agenda; no network-dependent workflow

**Constraints**: No backend or external persistence; data is scoped to the current browser and origin. Handle unavailable storage and malformed stored data without blocking a usable agenda. Keep primary workflows usable without horizontal scrolling on mobile.

**Scale/Scope**: One user, one browser origin, one agenda view, appointment create/list/status workflows

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle or gate | Plan decision | Status |
|---|---|---|
| I. Simplicity of scope | Limit the app to creating, viewing, and changing appointment status; no backend, accounts, or unrelated features. | PASS |
| II. Data validation | Require trimmed client name, date, time, and reason; constrain status to `pendiente` or `completada`; reject incomplete submissions with field-specific feedback. | PASS |
| III. Local persistence | Store and restore validated appointments from `localStorage`; recover from read, parse, validation, and write failures without making the interface unusable. | PASS |
| IV. Modularity and clarity | Use React, JavaScript, and CSS; keep validation, ordering, persistence, and status updates in reusable functions; keep visible UI copy in Spanish. | PASS |
| V. Verifiable quality | Test required fields, ordering, status changes, reload persistence, invalid storage recovery, and responsive use. | PASS |

No pre-design gate violations identified. Post-design review: PASS; the proposed data model and UI/storage contract preserve all principles without additional infrastructure.

## Project Structure

### Documentation (this feature)

```text
specs/001-agenda-citas/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-and-storage.md
└── tasks.md
```

### Source Code (repository root)

The repository currently has no application source tree or package manifest. This is the planned layout for implementation:

```text
src/
├── components/
│   ├── AppointmentForm.jsx
│   ├── AppointmentList.jsx
│   └── AppointmentItem.jsx
├── domain/
│   └── appointments.js
├── storage/
│   └── appointmentsStorage.js
├── App.jsx
├── main.jsx
└── styles.css

tests/
└── e2e/
    └── appointments.spec.js
```

Unit/component tests should live beside the modules they cover as `*.test.js` or `*.test.jsx`.

**Structure Decision**: One Vite-powered React application at the repository root. Domain operations and browser storage are kept separate from UI components; no backend project is needed for the specified local-only scope.

## Complexity Tracking

No constitution violations or additional project boundaries require justification.
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
