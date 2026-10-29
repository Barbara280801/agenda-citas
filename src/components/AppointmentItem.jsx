function formatDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("es", {
    dateStyle: "long",
  }).format(new Date(year, month - 1, day));
}

export default function AppointmentItem({ appointment, onToggleStatus }) {
  const isPending = appointment.estado === "pendiente";

  return (
    <article className="appointment-card">
      <div className="appointment-card-heading">
        <h3>{appointment.cliente}</h3>
        <span className={`status status-${appointment.estado}`}>
          <span aria-hidden="true" className="status-dot" />
          {isPending ? "Pendiente" : "Completada"}
        </span>
      </div>

      <dl className="appointment-details">
        <div>
          <dt>Fecha</dt>
          <dd>
            <time dateTime={appointment.fecha}>{formatDate(appointment.fecha)}</time>
          </dd>
        </div>
        <div>
          <dt>Hora</dt>
          <dd>
            <time dateTime={`${appointment.fecha}T${appointment.hora}`}>
              {appointment.hora}
            </time>
          </dd>
        </div>
        <div className="appointment-reason">
          <dt>Motivo</dt>
          <dd>{appointment.motivo}</dd>
        </div>
      </dl>

      <button
        className="button button-status"
        onClick={() => onToggleStatus(appointment.id)}
        type="button"
      >
        Marcar como {isPending ? "completada" : "pendiente"}
      </button>
    </article>
  );
}
