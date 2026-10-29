import { useState } from "react";
import AppointmentForm from "./components/AppointmentForm.jsx";
import AppointmentList from "./components/AppointmentList.jsx";
import {
  toggleAppointmentStatus,
} from "./domain/appointments.js";
import { loadAppointments, saveAppointments } from "./storage/appointmentsStorage.js";

export default function App() {
  const [initialStorage] = useState(() => loadAppointments());
  const [appointments, setAppointments] = useState(initialStorage.appointments);
  const [notice, setNotice] = useState(initialStorage.notice);

  function updateAppointments(nextAppointments) {
    setAppointments(nextAppointments);
    const result = saveAppointments(nextAppointments);
    setNotice(result.notice);
  }

  function handleCreate(appointment) {
    updateAppointments([...appointments, appointment]);
  }

  function handleToggleStatus(id) {
    updateAppointments(
      appointments.map((appointment) =>
        appointment.id === id
          ? toggleAppointmentStatus(appointment)
          : appointment,
      ),
    );
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <div className="brand-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="eyebrow">Tu negocio, en orden</p>
        <h1>Agenda de citas</h1>
        <p className="page-intro">
          Organiza tus próximas atenciones y lleva el ritmo de tu día.
        </p>
      </header>

      {notice && (
        <p className="storage-notice" role="status">
          {notice}
        </p>
      )}

      <div className="workspace">
        <section aria-labelledby="new-appointment-title" className="form-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Nuevo registro</p>
              <h2 id="new-appointment-title">Agendar una cita</h2>
            </div>
            <span aria-hidden="true" className="panel-icon">
              +
            </span>
          </div>
          <p className="panel-description">
            Completa los datos para añadir una atención a tu agenda.
          </p>
          <AppointmentForm onCreate={handleCreate} />
        </section>

        <section aria-labelledby="agenda-title" className="agenda-panel">
          <div className="panel-heading agenda-title">
            <div>
              <p className="eyebrow">Vista general</p>
              <h2 id="agenda-title">Tu agenda</h2>
            </div>
            <span className="total-count">
              {appointments.length} {appointments.length === 1 ? "cita" : "citas"}
            </span>
          </div>
          <AppointmentList
            appointments={appointments}
            onToggleStatus={handleToggleStatus}
          />
        </section>
      </div>

      <footer className="page-footer">
        Tus citas se guardan en este navegador.
      </footer>
    </main>
  );
}
