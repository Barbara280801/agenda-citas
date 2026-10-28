# Agenda de Citas Constitution

## Core Principles

### I. Simplicidad de alcance
La aplicación se limita a registrar citas, mostrar las próximas citas y cambiar su estado entre `pendiente` y `completada`. No se incorporarán backend, autenticación, cuentas de usuario ni funcionalidades ajenas a la agenda sin una enmienda explícita de esta constitución.

### II. Validación de datos
Toda cita debe tener nombre del cliente, fecha, hora y motivo. Si falta cualquier campo, la cita no se guardará y la interfaz debe indicar claramente qué dato falta. El estado solo podrá ser `pendiente` o `completada`; cualquier otro valor será rechazado.

### III. Persistencia local
Las citas se almacenarán en `localStorage` del navegador y se restaurarán al cargar la aplicación. Una recarga no debe eliminar datos válidos previamente guardados; los errores de lectura o datos corruptos deben gestionarse sin bloquear el uso de la aplicación.

### IV. Modularidad y claridad
La implementación usará React, JavaScript y CSS, con componentes de React separados por responsabilidad y la lógica de validación, ordenación, persistencia y cambio de estado separada en funciones reutilizables. La interfaz y los mensajes visibles estarán en español.

### V. Calidad verificable
Cada requisito debe incluir criterios de aceptación observables y cada funcionalidad debe tener pruebas. Como mínimo, se comprobará el rechazo de campos vacíos, la indicación del dato faltante, la ordenación por fecha y hora, el cambio de estado y la persistencia tras recargar. No se considerará terminada una funcionalidad que no pueda verificarse mediante una prueba o comprobación reproducible.

## Restricciones de producto

La interfaz debe ser responsive y usable en pantallas pequeñas y grandes. Las próximas citas se mostrarán ordenadas cronológicamente por fecha y hora. La solución debe ejecutarse en el navegador sin depender de un servidor propio ni de servicios externos para guardar las citas.

## Puertas de calidad

Antes de considerar completada una especificación o implementación, se revisará que cada requisito tenga un criterio de aceptación verificable, que los estados y validaciones respeten esta constitución, que la persistencia sobreviva a una recarga y que la vista sea responsive. Las pruebas deben cubrir los flujos principales y los casos de error relevantes.

## Governance

Esta constitución prevalece sobre decisiones de implementación que entren en conflicto con sus principios. Toda modificación deberá actualizar este documento cuando cambie el alcance, las reglas de validación, la persistencia, el stack o los criterios de calidad. Las revisiones de código y los planes de trabajo deben verificar explícitamente el cumplimiento de los principios aplicables; cualquier complejidad adicional debe justificarse por un requisito concreto.

**Version**: 1.0.0 | **Ratified**: 2026-10-28 | **Last Amended**: 2026-10-28
