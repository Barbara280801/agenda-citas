const requiredFields = [
  ["cliente", "nombre del cliente"],
  ["fecha", "fecha"],
  ["hora", "hora"],
  ["motivo", "motivo"],
];

function isValidDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(0, 0, 0, 0);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function isValidTime(value) {
  return typeof value === "string" && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function getMissingFields(input) {
  return requiredFields
    .filter(([field]) => {
      const value = input?.[field];
      if (field === "fecha") {
        return !isValidDate(value);
      }
      if (field === "hora") {
        return !isValidTime(value);
      }
      return typeof value !== "string" || value.trim().length === 0;
    })
    .map(([, label]) => label);
}

export function createAppointment(input, id = globalThis.crypto.randomUUID()) {
  const missingFields = getMissingFields(input);
  if (missingFields.length > 0) {
    throw new TypeError(`Datos de cita no válidos: ${missingFields.join(", ")}`);
  }
  if (typeof id !== "string" || id.trim().length === 0) {
    throw new TypeError("El identificador de la cita debe ser una cadena no vacía.");
  }

  return {
    id,
    cliente: input.cliente.trim(),
    fecha: input.fecha,
    hora: input.hora,
    motivo: input.motivo.trim(),
    estado: "pendiente",
  };
}

export function isValidAppointment(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    typeof value.id === "string" &&
    value.id.trim().length > 0 &&
    typeof value.cliente === "string" &&
    value.cliente.trim().length > 0 &&
    value.cliente === value.cliente.trim() &&
    isValidDate(value.fecha) &&
    isValidTime(value.hora) &&
    typeof value.motivo === "string" &&
    value.motivo.trim().length > 0 &&
    value.motivo === value.motivo.trim() &&
    (value.estado === "pendiente" || value.estado === "completada")
  );
}

function getLocalDateTime(appointment) {
  const [year, month, day] = appointment.fecha.split("-").map(Number);
  const [hours, minutes] = appointment.hora.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes).getTime();
}

function compareAppointments(left, right) {
  return (
    left.appointment.fecha.localeCompare(right.appointment.fecha) ||
    left.appointment.hora.localeCompare(right.appointment.hora) ||
    left.index - right.index
  );
}

export function splitAppointments(appointments, now = new Date()) {
  const upcoming = [];
  const past = [];
  const currentTime = now.getTime();

  appointments.forEach((appointment, index) => {
    const entry = { appointment, index };
    if (getLocalDateTime(appointment) < currentTime) {
      past.push(entry);
    } else {
      upcoming.push(entry);
    }
  });

  upcoming.sort(compareAppointments);
  past.sort((left, right) => compareAppointments(right, left));

  return {
    upcoming: upcoming.map(({ appointment }) => appointment),
    past: past.map(({ appointment }) => appointment),
  };
}

export function toggleAppointmentStatus(appointment) {
  if (appointment.estado !== "pendiente" && appointment.estado !== "completada") {
    throw new TypeError("El estado de la cita no es válido.");
  }

  return {
    ...appointment,
    estado: appointment.estado === "pendiente" ? "completada" : "pendiente",
  };
}
