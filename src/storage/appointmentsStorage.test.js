import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadAppointments, saveAppointments } from "./appointmentsStorage.js";

const appointment = {
  id: "appointment-1",
  cliente: "Ana Pérez",
  fecha: "2030-05-12",
  hora: "09:30",
  motivo: "Consulta inicial",
  estado: "pendiente",
};

function createStorage(initialValue = null) {
  let value = initialValue;
  return {
    getItem: vi.fn(() => value),
    setItem: vi.fn((_key, nextValue) => {
      value = nextValue;
    }),
    read: () => value,
  };
}

describe("appointments storage", () => {
  let storage;

  beforeEach(() => {
    storage = createStorage();
  });

  it("serializes and restores the versioned envelope", () => {
    expect(saveAppointments([appointment], storage)).toEqual({
      ok: true,
      notice: null,
    });
    expect(storage.setItem).toHaveBeenCalledWith(
      "agenda-citas:v1",
      JSON.stringify({ schemaVersion: 1, appointments: [appointment] }),
    );
    expect(loadAppointments(storage)).toEqual({
      appointments: [appointment],
      notice: null,
    });
  });

  it("returns an empty agenda without a notice when no value exists", () => {
    expect(loadAppointments(storage)).toEqual({
      appointments: [],
      notice: null,
    });
  });

  it.each([
    ["invalid JSON", "{"],
    ["unsupported schema", JSON.stringify({ schemaVersion: 2, appointments: [] })],
    ["invalid record", JSON.stringify({ schemaVersion: 1, appointments: [{ ...appointment, estado: "otro" }] })],
  ])("rejects %s without exposing invalid data", (_description, raw) => {
    storage.getItem.mockReturnValue(raw);

    const result = loadAppointments(storage);

    expect(result.appointments).toEqual([]);
    expect(result.notice).toMatch(/no se pudieron recuperar/i);
  });

  it("keeps the page usable when reading or writing throws", () => {
    storage.getItem.mockImplementation(() => {
      throw new Error("storage unavailable");
    });
    expect(loadAppointments(storage)).toEqual({
      appointments: [],
      notice: expect.stringMatching(/no se pudo acceder/i),
    });

    storage.setItem.mockImplementation(() => {
      throw new Error("storage unavailable");
    });
    expect(saveAppointments([appointment], storage)).toEqual({
      ok: false,
      notice: expect.stringMatching(/no se pudieron guardar/i),
    });
  });
});
