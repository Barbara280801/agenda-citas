import { describe, expect, it } from "vitest";
import {
  createAppointment,
  getMissingFields,
  splitAppointments,
  toggleAppointmentStatus,
} from "./appointments.js";

const validInput = {
  cliente: "  Ana Pérez ",
  fecha: "2030-05-12",
  hora: "09:30",
  motivo: "  Consulta inicial ",
};

describe("createAppointment", () => {
  it("trims text, assigns a stable id, and starts pending", () => {
    const appointment = createAppointment(validInput, "appointment-1");

    expect(appointment).toEqual({
      id: "appointment-1",
      cliente: "Ana Pérez",
      fecha: "2030-05-12",
      hora: "09:30",
      motivo: "Consulta inicial",
      estado: "pendiente",
    });
  });

  it("rejects invalid calendar dates and 24-hour times", () => {
    expect(
      getMissingFields({
        ...validInput,
        fecha: "2030-02-30",
        hora: "25:61",
      }),
    ).toEqual(["fecha", "hora"]);
  });
});

describe("getMissingFields", () => {
  it("reports all missing and whitespace-only fields", () => {
    expect(
      getMissingFields({
        cliente: "   ",
        fecha: "",
        hora: "",
        motivo: " ",
      }),
    ).toEqual(["nombre del cliente", "fecha", "hora", "motivo"]);
  });
});

describe("splitAppointments", () => {
  const now = new Date(2030, 0, 10, 12, 0);
  const appointment = (id, fecha, hora) => ({
    id,
    cliente: id,
    fecha,
    hora,
    motivo: "Cita",
    estado: "pendiente",
  });

  it("classifies local appointments and sorts each section stably", () => {
    const appointments = [
      appointment("future-late", "2030-01-11", "15:00"),
      appointment("past-early", "2030-01-10", "09:00"),
      appointment("future-first", "2030-01-10", "13:00"),
      appointment("past-late", "2030-01-10", "11:00"),
      appointment("future-tie-a", "2030-01-12", "10:00"),
      appointment("future-tie-b", "2030-01-12", "10:00"),
      appointment("now", "2030-01-10", "12:00"),
    ];

    const result = splitAppointments(appointments, now);

    expect(result.upcoming.map(({ id }) => id)).toEqual([
      "now",
      "future-first",
      "future-late",
      "future-tie-a",
      "future-tie-b",
    ]);
    expect(result.past.map(({ id }) => id)).toEqual([
      "past-late",
      "past-early",
    ]);
    expect(appointments[0].id).toBe("future-late");
  });
});

describe("toggleAppointmentStatus", () => {
  it("changes only the appointment status", () => {
    const appointment = createAppointment(validInput, "appointment-1");

    expect(toggleAppointmentStatus(appointment)).toEqual({
      ...appointment,
      estado: "completada",
    });
    expect(toggleAppointmentStatus({ ...appointment, estado: "completada" })).toEqual(
      appointment,
    );
  });
});
