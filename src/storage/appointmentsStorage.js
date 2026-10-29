import { isValidAppointment } from "../domain/appointments.js";

const STORAGE_KEY = "agenda-citas:v1";
const RECOVERY_NOTICE =
  "No se pudieron recuperar las citas guardadas. Puedes seguir usando la agenda.";
const READ_FAILURE_NOTICE =
  "No se pudo acceder al almacenamiento del navegador. La agenda está disponible para esta sesión.";
const SAVE_FAILURE_NOTICE =
  "No se pudieron guardar los cambios. La agenda seguirá disponible durante esta sesión, pero podrías perderlos al recargar.";

function isValidEnvelope(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    value.schemaVersion === 1 &&
    Array.isArray(value.appointments) &&
    value.appointments.every(isValidAppointment) &&
    new Set(value.appointments.map(({ id }) => id)).size ===
      value.appointments.length
  );
}

function getStorage(storage) {
  return storage ?? globalThis.localStorage;
}

export function loadAppointments(storage) {
  try {
    const rawValue = getStorage(storage).getItem(STORAGE_KEY);
    if (rawValue === null) {
      return { appointments: [], notice: null };
    }

    let envelope;
    try {
      envelope = JSON.parse(rawValue);
    } catch {
      return { appointments: [], notice: RECOVERY_NOTICE };
    }

    if (!isValidEnvelope(envelope)) {
      return { appointments: [], notice: RECOVERY_NOTICE };
    }

    return { appointments: envelope.appointments, notice: null };
  } catch {
    return { appointments: [], notice: READ_FAILURE_NOTICE };
  }
}

export function saveAppointments(appointments, storage) {
  try {
    const envelope = { schemaVersion: 1, appointments };
    if (!isValidEnvelope(envelope)) {
      return { ok: false, notice: SAVE_FAILURE_NOTICE };
    }

    getStorage(storage).setItem(STORAGE_KEY, JSON.stringify(envelope));
    return { ok: true, notice: null };
  } catch {
    return { ok: false, notice: SAVE_FAILURE_NOTICE };
  }
}
