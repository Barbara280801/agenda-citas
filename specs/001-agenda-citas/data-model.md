# Data Model: Agenda de citas para pequeños negocios

## Cita

Represents one appointment in the local agenda.

| Field | Type | Required | Rules |
|---|---|---:|---|
| `id` | string | Yes | Unique and stable for the lifetime of the appointment; used to target state changes. |
| `cliente` | string | Yes | Trim leading/trailing whitespace; must not be empty afterward. |
| `fecha` | string | Yes | Valid calendar date in `YYYY-MM-DD` form from a date input. Past dates are permitted. |
| `hora` | string | Yes | Valid 24-hour time in `HH:mm` form from a time input. |
| `motivo` | string | Yes | Trim leading/trailing whitespace; must not be empty afterward. |
| `estado` | enum | Yes | Exactly `pendiente` or `completada`; newly created appointments start as `pendiente`. |

Appointments are stored in registration order. Their display order is derived without mutating that stored order, preserving a stable tie order when date and time are equal.

## Relationships and behavior

- The agenda contains zero or more appointments; appointments are independent and are not linked to accounts or external customers.
- Appointment state changes do not modify `cliente`, `fecha`, `hora`, or `motivo`.
- A local date/time pair is compared in the browser's local time zone to decide whether it belongs in Próximas citas or Citas pasadas.
- Future appointments sort by ascending date then ascending time. Past appointments sort by descending date then descending time.

## Persistence envelope

Store one JSON value with an explicit schema version:

```json
{
  "schemaVersion": 1,
  "appointments": []
}
```

On restoration, validate the envelope and each appointment before exposing the records to the UI. Missing, malformed, unsupported, or inaccessible data must not prevent use of an empty agenda. See [UI and Storage Contract](contracts/ui-and-storage.md) for user-visible recovery behavior.