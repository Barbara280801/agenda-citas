import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AppointmentList from "./AppointmentList.jsx";

const now = new Date(2030, 0, 10, 12, 0);

function appointment(id, fecha, hora, estado = "pendiente") {
  return {
    id,
    cliente: `Cliente ${id}`,
    fecha,
    hora,
    motivo: `Motivo ${id}`,
    estado,
  };
}

describe("AppointmentList", () => {
  it("renders distinct upcoming and past sections in the right order", () => {
    render(
      <AppointmentList
        now={now}
        appointments={[
          appointment("tarde", "2030-01-11", "15:00"),
          appointment("ayer", "2030-01-09", "09:00"),
          appointment("temprano", "2030-01-11", "09:00"),
        ]}
        onToggleStatus={vi.fn()}
      />,
    );

    const upcoming = screen.getByRole("region", { name: "Próximas citas" });
    const past = screen.getByRole("region", { name: "Citas pasadas" });

    expect(within(upcoming).getAllByText(/Cliente/).map((item) => item.textContent)).toEqual([
      "Cliente temprano",
      "Cliente tarde",
    ]);
    expect(within(past).getByText("Cliente ayer")).toBeInTheDocument();
  });

  it("shows status and calls the explicit status action", () => {
    const onToggleStatus = vi.fn();
    render(
      <AppointmentList
        now={now}
        appointments={[appointment("uno", "2030-01-11", "09:00")]}
        onToggleStatus={onToggleStatus}
      />,
    );

    expect(screen.getByText("Pendiente")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Marcar como completada" }));

    expect(onToggleStatus).toHaveBeenCalledWith("uno");
  });
});
