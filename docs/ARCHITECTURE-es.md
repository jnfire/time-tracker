# Arquitectura del Proyecto

*Leer esto en [Inglés](ARCHITECTURE.md).*

El proyecto `time-tracker` sigue una arquitectura modular y desacoplada que separa la lógica de negocio pura del framework de interfaz de usuario (Vue 3).

## Estructura de Directorios

### 1. `src/core/` (Capa de Lógica de Negocio y Dominio)
Esta carpeta contiene código puro en TypeScript y es completamente independiente del framework de frontend.
- **`domain/types.ts`**: Define las entidades básicas como `Task`, `TimeEvent`, `DayRecord` y el contrato `StorageAdapter`.
- **`storage/LocalStorageAdapter.ts`**: Implementación concreta de la persistencia usando la API nativa de `localStorage` del navegador.
- **`services/TaskService.ts`**: Servicio encargado del diccionario global de tareas para su reutilización interdiaria (evitando duplicar IDs, tickets y descripciones).
- **`services/TimeTrackerService.ts`**: Servicio que controla la lógica de tiempo (arranque, pausa, registro de correcciones manuales sumando/restando segundos).

### 2. `src/ui/` (Capa de Presentación)
- **`composables/useTimeTracker.ts`**: Adaptador reactivo que sirve de puente entre el Core y la interfaz de Vue. Maneja el timer reactivo en tiempo real y el evento `beforeunload` para auto-pausar en caso de cierre accidental del navegador.
- **`components/`**: Componentes de Vue de responsabilidad única, diseñados como componentes "tontos" (presentacionales) para facilitar su futura exportación a nuestra librería común:
  - **`AppHeader.vue`**: Cabecera bilingüe con selector de idioma.
  - **`DateSelector.vue`**: Navegador de fecha con límites (impide ir al futuro) y marcador de días con registros.
  - **`ActiveTracker.vue`**: Bloque central de control. Contiene el totalizador en grande, el botón de Iniciar/Pausar (bloqueado si no hay tarea activa) y la lista de tareas del día (clicable para trackear de inmediato).
  - **`TaskModal.vue`**: Modal interactivo de búsqueda/asociación de tareas con autocompletado.
  - **`EditTimeModal.vue`**: Modal para sumar o restar horas y minutos a una tarea.
  - **`ExportActions.vue`**: Acción de exportación de base de datos a formato JSON.

### 3. `src/i18n/` (Internacionalización)
Contiene las traducciones (`en.json`, `es.json`) y la configuración del plugin de internacionalización.

### 4. `src/__tests__/` (Pruebas)
Contiene la suite de tests automatizados de Vitest para garantizar la estabilidad de la lógica matemática de cálculo e intervalos en el core.
