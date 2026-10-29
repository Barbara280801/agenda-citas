import { useState } from "react";
import { createAppointment, getMissingFields } from "../domain/appointments.js";

const emptyForm = {
  cliente: "",
  fecha: "",
  hora: "",
  motivo: "",
};

function joinSpanish(items) {
  if (items.length < 2) {
    return items[0] ?? "";
  }
  if (items.length === 2) {
    return `${items[0]} y ${items[1]}`;
  }
  return `${items.slice(0, -1).join(", ")} y ${items.at(-1)}`;
}

export default function AppointmentForm({ onCreate }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [invalidFields, setInvalidFields] = useState([]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const missingFields = getMissingFields(form);
    if (missingFields.length > 0) {
      setInvalidFields(missingFields);
      setError(`Faltan datos obligatorios: ${joinSpanish(missingFields)}.`);
      return;
    }

    onCreate(createAppointment(form));
    setForm(emptyForm);
    setInvalidFields([]);
    setError("");
  }

  return (
    <form className="appointment-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label className="field" htmlFor="cliente">
          Nombre del cliente
          <input
            autoComplete="name"
            id="cliente"
            name="cliente"
            onChange={updateField}
            placeholder="Ej. Ana Pérez"
            required
            aria-invalid={invalidFields.includes("nombre del cliente")}
            value={form.cliente}
          />
        </label>

        <label className="field" htmlFor="fecha">
          Fecha
          <input
            id="fecha"
            name="fecha"
            onChange={updateField}
            required
            type="date"
            aria-invalid={invalidFields.includes("fecha")}
            value={form.fecha}
          />
        </label>

        <label className="field" htmlFor="hora">
          Hora
          <input
            id="hora"
            name="hora"
            onChange={updateField}
            required
            type="time"
            aria-invalid={invalidFields.includes("hora")}
            value={form.hora}
          />
        </label>

        <label className="field" htmlFor="motivo">
          Motivo
          <input
            id="motivo"
            name="motivo"
            onChange={updateField}
            placeholder="Ej. Consulta inicial"
            required
            aria-invalid={invalidFields.includes("motivo")}
            value={form.motivo}
          />
        </label>
      </div>

      {error && (
        <p className="form-error" id="form-error" role="alert">
          {error}
        </p>
      )}

      <button className="button button-primary submit-button" type="submit">
        Guardar cita
      </button>
    </form>
  );
}
