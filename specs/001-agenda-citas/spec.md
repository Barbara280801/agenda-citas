# Feature Specification: Agenda de citas para pequeños negocios

**Feature Branch**: `001-agenda-citas`

**Created**: 2026-10-28

**Status**: Draft

**Input**: User description: "Agenda de citas para pequeños negocios. Permite registrar una cita con nombre del cliente, fecha, hora y motivo; si algún campo está vacío no debe guardarse y debe mostrar un mensaje indicando qué falta. Muestra la lista de próximas citas ordenadas por fecha y hora. Cada cita puede marcarse como pendiente o completada. Las citas se guardan en el navegador y no se pierden al recargar la página."

## Clarifications

### Session 2026-10-28

- Q: ¿La agenda debe permitir registrar citas con fecha y hora pasadas? → A: Permitirlas, pero separarlas.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar una cita válida (Priority: P1)

Como persona responsable de un pequeño negocio, quiero registrar una cita con los datos del cliente y del servicio para mantener mi agenda organizada.

**Why this priority**: Sin una cita registrada no existe la agenda; es el flujo principal que entrega valor desde el primer uso.

**Independent Test**: Se puede probar completando todos los datos obligatorios y comprobando que la nueva cita aparece en la lista de próximas citas.

**Acceptance Scenarios**:

1. **Given** que la agenda está abierta y el formulario está vacío, **When** la persona introduce nombre del cliente, fecha, hora y motivo válidos y confirma el registro, **Then** la cita se guarda y aparece en la lista con estado pendiente.
2. **Given** que existen citas registradas, **When** la persona registra otra cita válida, **Then** la nueva cita aparece sin modificar ni eliminar las anteriores.

---

### User Story 2 - Validar datos obligatorios (Priority: P1)

Como persona responsable del negocio, quiero saber qué información falta para corregir rápidamente una cita incompleta.

**Why this priority**: Evita registros inutilizables y mantiene la agenda confiable.

**Independent Test**: Se puede probar enviando el formulario con uno o varios campos vacíos y verificando que no se crea ninguna cita y que se indican los campos faltantes.

**Acceptance Scenarios**:

1. **Given** que uno o más campos obligatorios están vacíos, **When** la persona intenta guardar la cita, **Then** la cita no se guarda y se muestra un mensaje identificando cada dato faltante.
2. **Given** que todos los campos obligatorios tienen un valor, **When** la persona confirma el registro, **Then** no se muestra un error de campo obligatorio y la cita queda registrada.

---

### User Story 3 - Consultar y completar próximas citas (Priority: P1)

Como persona responsable del negocio, quiero ver mis próximas citas en orden y marcar las atendidas para conocer el estado de la agenda.

**Why this priority**: Permite usar la agenda durante el trabajo diario y distinguir las citas pendientes de las ya completadas.

**Independent Test**: Se puede probar con varias citas de fechas y horas diferentes, comprobando el orden y cambiando el estado de una de ellas.

**Acceptance Scenarios**:

1. **Given** que existen citas futuras y citas pasadas con fechas y horas diferentes, **When** la persona consulta la agenda, **Then** las citas futuras aparecen en la lista de próximas citas ordenadas de la más próxima a la más lejana, y las pasadas aparecen en una sección distinguible ordenada de la más reciente a la más antigua.
2. **Given** que una cita está pendiente, **When** la persona la marca como completada, **Then** su estado cambia a completada y se conserva el resto de sus datos.
3. **Given** que una cita está completada, **When** la persona consulta su estado, **Then** se muestra como completada y no como pendiente.

---

### User Story 4 - Conservar la agenda (Priority: P1)

Como persona responsable del negocio, quiero que mis citas sigan disponibles al volver a cargar la página para no perder la información de trabajo.

**Why this priority**: La continuidad de los datos es esencial para que una agenda digital sea confiable.

**Independent Test**: Se puede registrar una cita, recargar la página y comprobar que la cita y su estado siguen disponibles.

**Acceptance Scenarios**:

1. **Given** que hay citas guardadas, **When** la persona recarga la página, **Then** las citas se restauran con todos sus datos y estados.
2. **Given** que no hay datos guardados o los datos almacenados no son válidos, **When** la persona abre la agenda, **Then** la aplicación muestra una lista vacía utilizable y permite registrar una nueva cita.

### Edge Cases

- Si faltan varios campos, el mensaje debe identificar todos los campos faltantes en un único intento.
- Los espacios en blanco al inicio o al final de un campo de texto no deben permitir guardar un valor que esté vacío después de limpiarlo.
- Las citas con la misma fecha deben ordenarse por hora; si también comparten hora, deben conservar un orden estable de registro.
- Las citas con fecha y hora pasadas deben conservarse y distinguirse visualmente de las próximas citas.
- Una cita no debe cambiar sus datos de cliente, fecha, hora o motivo al cambiar su estado.
- Una cita ya completada debe permanecer completada después de recargar la página.
- La agenda debe funcionar y seguir siendo legible en pantallas pequeñas y grandes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE permitir crear una cita con nombre del cliente, fecha, hora y motivo.
- **FR-002**: El sistema DEBE tratar nombre del cliente, fecha, hora y motivo como datos obligatorios.
- **FR-003**: El sistema DEBE impedir el guardado cuando falte uno o más datos obligatorios.
- **FR-004**: El sistema DEBE mostrar qué datos obligatorios faltan cuando se intenta guardar una cita incompleta.
- **FR-005**: El sistema DEBE mostrar las citas futuras como próximas citas ordenadas por fecha ascendente y, dentro de la misma fecha, por hora ascendente; las citas pasadas DEBEN aparecer en una sección distinguible ordenada de la más reciente a la más antigua.
- **FR-006**: Cada cita DEBE tener exactamente uno de estos estados: pendiente o completada.
- **FR-007**: Las nuevas citas DEBEN iniciar con estado pendiente.
- **FR-008**: El sistema DEBE permitir cambiar una cita entre pendiente y completada mediante una acción explícita.
- **FR-009**: Cambiar el estado de una cita NO DEBE modificar su nombre, fecha, hora ni motivo.
- **FR-010**: El sistema DEBE guardar las citas en el navegador para que permanezcan disponibles después de recargar la página.
- **FR-011**: El sistema DEBE gestionar la ausencia o invalidez de datos guardados mostrando una agenda vacía utilizable, sin impedir el registro de nuevas citas.
- **FR-012**: La interfaz DEBE estar disponible en español y adaptarse a pantallas pequeñas y grandes sin ocultar las acciones principales.

### Key Entities *(include if data involved)*

- **Cita**: Compromiso agendado para un cliente; contiene nombre del cliente, fecha, hora, motivo y estado.
- **Estado de cita**: Valor controlado que indica si una cita está pendiente o completada.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Una persona puede registrar una cita válida en menos de 60 segundos desde que abre la agenda.
- **SC-002**: El 100% de los intentos de guardar citas con campos obligatorios vacíos se rechaza y muestra los campos faltantes.
- **SC-003**: El 100% de las citas futuras se presenta en orden ascendente de fecha y hora, y el 100% de las citas pasadas en orden descendente de fecha y hora dentro de su sección.
- **SC-004**: El 100% de las citas registradas y sus estados permanece disponible después de recargar la página en el mismo navegador.
- **SC-005**: Una persona puede cambiar el estado de una cita en una sola acción y verificar visualmente el nuevo estado.
- **SC-006**: Las acciones de registrar, consultar y cambiar el estado siguen siendo utilizables en una pantalla móvil sin desplazamiento horizontal.

## Assumptions

- La agenda se utiliza en un único navegador y dispositivo; no se requiere sincronización entre dispositivos.
- Las citas se gestionan localmente y no requieren cuentas, autenticación ni conexión con un servicio externo.
- Las fechas y horas se introducen según los controles y formato definidos por la interfaz en español.
- La primera versión no incluye edición o eliminación de citas, notificaciones, recordatorios ni calendario externo.
- El estado inicial de toda nueva cita es pendiente.
