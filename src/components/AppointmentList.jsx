import { splitAppointments } from "../domain/appointments.js";
import AppointmentItem from "./AppointmentItem.jsx";

function AppointmentSection({ appointments, emptyMessage, onToggleStatus, title }) {
  return (
    <section aria-label={title} className="agenda-section">
      <div className="section-heading">
        <h2>{title}</h2>
        <span className="section-count">{appointments.length}</span>
      </div>

      {appointments.length > 0 ? (
        <div className="appointment-list">
          {appointments.map((appointment) => (
            <AppointmentItem
              appointment={appointment}
              key={appointment.id}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </div>
      ) : (
        <p className="empty-section">{emptyMessage}</p>
      )}
    </section>
  );
}

export default function AppointmentList({
  appointments,
  onToggleStatus,
  now = new Date(),
}) {
  const { upcoming, past } = splitAppointments(appointments, now);

  return (
    <div className="agenda-sections">
      <AppointmentSection
        appointments={upcoming}
        emptyMessage="No tienes citas próximas."
        onToggleStatus={onToggleStatus}
        title="Próximas citas"
      />
      <AppointmentSection
        appointments={past}
        emptyMessage="Todavía no tienes citas pasadas."
        onToggleStatus={onToggleStatus}
        title="Citas pasadas"
      />
    </div>
  );
}
