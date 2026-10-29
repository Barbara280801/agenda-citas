import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AppointmentForm from "./AppointmentForm.jsx";

async function fillValidForm(user) {
  await user.type(screen.getByLabelText("Nombre del cliente"), "Ana Pérez");
  await user.type(screen.getByLabelText("Fecha"), "2030-05-12");
  await user.type(screen.getByLabelText("Hora"), "09:30");
  await user.type(screen.getByLabelText("Motivo"), "Consulta inicial");
}

describe("AppointmentForm", () => {
  it("submits a valid appointment and resets the form", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<AppointmentForm onCreate={onCreate} />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Guardar cita" }));

    expect(onCreate).toHaveBeenCalledOnce();
    expect(onCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        cliente: "Ana Pérez",
        fecha: "2030-05-12",
        hora: "09:30",
        motivo: "Consulta inicial",
        estado: "pendiente",
      }),
    );
    expect(screen.getByLabelText("Nombre del cliente")).toHaveValue("");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("reports all missing fields and rejects whitespace-only text", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<AppointmentForm onCreate={onCreate} />);

    await user.type(screen.getByLabelText("Nombre del cliente"), "   ");
    await user.type(screen.getByLabelText("Motivo"), " ");
    await user.click(screen.getByRole("button", { name: "Guardar cita" }));

    expect(onCreate).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "nombre del cliente, fecha, hora y motivo",
    );
  });

  it("clears the required-field message after a valid submission", async () => {
    const user = userEvent.setup();
    render(<AppointmentForm onCreate={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Guardar cita" }));
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Guardar cita" }));

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
