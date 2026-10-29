---

description: "Implementation tasks for the appointment agenda feature"
---

# Tasks: Agenda de citas para pequeños negocios

**Input**: Design documents from `/specs/001-agenda-citas/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)

**Tests**: Included because the project constitution requires tests for each feature and explicitly names validation, ordering, status changes, and reload persistence.

**Organization**: Tasks are grouped by user story so each story can be implemented and verified as an increment.

## Phase 1: Setup

**Purpose**: Initialize the client-side React project and test tooling.

- [X] T001 Initialize the Vite React JavaScript app, add React/Vite/Vitest/Testing Library/jsdom/Playwright dependencies and `dev`, `build`, `test`, and `test:e2e` scripts in `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, and `src/test/setup.js`.
- [X] T002 [P] Configure Playwright browser-test discovery and the local Vite web server in `playwright.config.js`.

---

## Phase 2: Foundational

**Purpose**: Establish the shared page shell and responsive base before story behavior is added.

- [X] T003 [P] Create the Spanish-language semantic application shell and shared content regions in `src/App.jsx`.
- [X] T004 [P] Add responsive global layout, typography, form, section, and focus styles in `src/styles.css`.

**Checkpoint**: The app starts and builds with the shared shell; story-level interactions can now be implemented.

---

## Phase 3: User Story 1 - Registrar una cita válida (Priority: P1)

**Goal**: Register a complete appointment as pending and show it without replacing existing appointments.

**Independent Test**: Enter all four values, submit, and confirm the new appointment appears with pending status; submit another and confirm the first remains.

### Tests for User Story 1

- [X] T005 [P] [US1] Test appointment creation, stable identifiers, and initial `pendiente` status in `src/domain/appointments.test.js`.
- [X] T006 [P] [US1] Test valid form submission, callback payload, and form reset in `src/components/AppointmentForm.test.jsx`.

### Implementation for User Story 1

- [X] T007 [US1] Define appointment creation and defaults in `src/domain/appointments.js` with these field rules: `id`: "Unique and stable for the lifetime of the appointment; used to target state changes."; `cliente`: "Trim leading/trailing whitespace; must not be empty afterward."; `fecha`: "Valid calendar date in YYYY-MM-DD form from a date input. Past dates are permitted."; `hora`: "Valid 24-hour time in HH:mm form from a time input."; `motivo`: "Trim leading/trailing whitespace; must not be empty afterward."; `estado`: "Exactly `pendiente` or `completada`; newly created appointments start as `pendiente`."
- [X] T008 [US1] Implement the required client/date/time/reason form inputs and valid-submit callback in `src/components/AppointmentForm.jsx`.
- [X] T009 [US1] Render registered appointments with their pending status and connect form submission to app state in `src/components/AppointmentList.jsx` and `src/App.jsx`.

**Checkpoint**: A valid appointment can be registered and remains visible alongside prior appointments.

---

## Phase 4: User Story 2 - Validar datos obligatorios (Priority: P1)

**Goal**: Reject incomplete appointments and identify all missing required values in Spanish.

**Independent Test**: Submit with each field empty, multiple fields empty, and whitespace-only text; verify no appointment is created and every missing field is named. Then submit valid values and verify no required-field error remains.

### Tests for User Story 2

- [X] T010 [US2] Test missing-field combinations, whitespace-only client/reason, no creation on invalid input, and Spanish field-specific feedback in `src/components/AppointmentForm.test.jsx`.

### Implementation for User Story 2

- [X] T011 [US2] Implement reusable required-field and trimmed-text validation for client name, date, time, and reason in `src/domain/appointments.js`.
- [X] T012 [US2] Block invalid submission and display all missing field names in an accessible Spanish error message in `src/components/AppointmentForm.jsx`.

**Checkpoint**: All required fields are enforced, including whitespace-only text, without creating invalid appointments.

---

## Phase 5: User Story 3 - Consultar y completar próximas citas (Priority: P1)

**Goal**: Separate future and past appointments, order each section correctly, and allow explicit status changes without altering appointment details.

**Independent Test**: Use appointments with future and past dates/times, including equal timestamps; verify section membership and ordering, then toggle an appointment and confirm only its status changes.

### Tests for User Story 3

- [X] T013 [P] [US3] Test local-time classification, ascending future order, descending past order, and stable ties in `src/domain/appointments.test.js`.
- [X] T014 [P] [US3] Test distinct future/past sections, visible status, and the explicit status action in `src/components/AppointmentList.test.jsx`.

### Implementation for User Story 3

- [X] T015 [US3] Implement local date/time classification, stable future/past sorting, and status-toggle helpers in `src/domain/appointments.js`.
- [X] T016 [US3] Render Próximas citas and Citas pasadas with their required sort order in `src/components/AppointmentList.jsx`.
- [X] T017 [US3] Add an explicit pending/completed action that updates only `estado` in `src/components/AppointmentItem.jsx` and connect it to app state in `src/App.jsx`.

**Checkpoint**: Future and past sections are distinguishable and correctly ordered; status changes preserve appointment details.

---

## Phase 6: User Story 4 - Conservar la agenda (Priority: P1)

**Goal**: Restore appointments and status from browser storage after reload, and remain usable when stored data or storage access is invalid.

**Independent Test**: Register and complete an appointment, reload the same origin, and verify all fields and status remain. Also verify malformed or unavailable storage results in a usable empty agenda and a Spanish notice.

### Tests for User Story 4

- [X] T018 [P] [US4] Test versioned-envelope serialization, record validation, missing/corrupt data, and read/write failures in `src/storage/appointmentsStorage.test.js`.
- [X] T019 [P] [US4] Test creating and completing an appointment, reloading, and verifying restored data and status in `tests/e2e/appointments.spec.js`.

### Implementation for User Story 4

- [X] T020 [US4] Implement `agenda-citas:v1` localStorage read/write helpers for the `{ schemaVersion: 1, appointments: [] }` envelope, validating restored records and handling storage exceptions in `src/storage/appointmentsStorage.js`.
- [X] T021 [US4] Restore appointments on startup, persist create/status updates, and show Spanish recovery/save-failure notices without blocking the current session in `src/App.jsx`.

**Checkpoint**: Valid appointments and status survive reload; missing, malformed, or inaccessible storage does not prevent new registrations.

---

## Phase 7: Polish and Cross-Cutting Validation

**Purpose**: Verify responsive usability and the complete documented validation workflow.

- [X] T022 Add a narrow-viewport Playwright check for primary actions and horizontal overflow, then adjust responsive rules in `tests/e2e/appointments.spec.js` and `src/styles.css`.
- [X] T023 Run the complete unit/component suite, Playwright suite, and production build; update expected commands and outcomes in `specs/001-agenda-citas/quickstart.md`.

---

## Dependencies and Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; T002 follows T001 because the Playwright configuration uses the installed project tooling.
- **Foundational (Phase 2)**: Starts after T001; T003 and T004 can run in parallel because they edit separate files.
- **User Story 1 (Phase 3)**: Starts after the foundation; establishes appointment creation and the visible list.
- **User Story 2 (Phase 4)**: Depends on US1 because it extends the working appointment form.
- **User Story 3 (Phase 5)**: Depends on US1 because it organizes and changes the appointments already being created.
- **User Story 4 (Phase 6)**: Depends on US1 and US3 so both appointment data and changed status can be restored.
- **Polish (Phase 7)**: Depends on all four stories.

### User Story Dependencies

- **US1 (P1)**: Depends only on Setup and Foundational; no other story dependency.
- **US2 (P1)**: Depends on US1's form and app state; can be developed alongside US3 after US1 if changes to shared files are coordinated.
- **US3 (P1)**: Depends on US1's appointment list; independent of US2's validation behavior.
- **US4 (P1)**: Depends on US1 and US3 because reload verification includes a changed appointment status.

### Parallel Opportunities

- T003 and T004 can run in parallel after T001.
- T005 and T006 can run in parallel because they cover separate domain and component test files.
- T013 and T014 can run in parallel because they cover separate domain and component test files.
- T018 and T019 can run in parallel because unit storage tests and browser reload tests use separate files.
- US2 and US3 can be staffed in parallel after US1 if changes to `src/domain/appointments.js` are partitioned or serialized; otherwise complete US2 before US3.

### Parallel Example: User Story 1

After Setup and Foundational are complete, run T005 and T006 concurrently. Once both tests are in place, complete T007, then T008 and T009 in dependency order.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundational phases.
2. Complete US1 to register and display a pending appointment.
3. Run US1 tests and validate the create/list flow independently.
4. Demo the usable registration increment before adding validation feedback, sorting/status controls, and persistence.

### Incremental Delivery

1. Setup and shared shell.
2. US1: create and show pending appointments.
3. US2: required-field validation and actionable Spanish feedback.
4. US3: future/past ordering and status changes.
5. US4: browser persistence and recovery behavior.
6. Polish: responsive browser check and complete quickstart validation.
