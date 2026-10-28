# UI and Storage Contract

This client-only application exposes no HTTP API. Its externally observable contract is the Spanish user interface and the browser-local persistence behavior.

## Appointment form

- Inputs: nombre del cliente, fecha, hora, motivo.
- Submitting with missing values creates no appointment and reports every missing field in one message.
- Text values are trimmed before validation; whitespace-only client or reason values are missing.
- A valid submission creates one appointment with `estado: "pendiente"`, clears the form, and makes the appointment visible in the correct date section.

## Agenda view and actions

- Show future appointments under a visually distinct Próximas citas section, ascending by local date and time.
- Show past appointments under a visually distinct Citas pasadas section, descending by local date and time.
- Preserve registration order for ties with equal date and time.
- Expose one explicit action to change each appointment between `pendiente` and `completada`; changing status preserves all other fields.
- Keep the form, appointment information, and status action usable on narrow screens without horizontal page scrolling.

## Browser storage

- Origin-scoped key: `agenda-citas:v1`.
- Value: JSON envelope with `schemaVersion: 1` and an `appointments` array matching [data-model.md](../data-model.md).
- Restore valid records on page load. Treat missing or invalid values as an empty agenda; do not silently replace invalid raw data.
- If storage cannot be read, keep the page usable with an empty agenda and show a Spanish recovery notice.
- If storage cannot be written, preserve current in-memory interaction and show a Spanish notice that changes may not persist after reload.
- No network request, account, cross-device synchronization, or external calendar integration is part of this contract.