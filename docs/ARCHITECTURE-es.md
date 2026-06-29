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
Contiene los diccionarios (`en.json`, `es.json`) y la configuración de `vue-i18n` para soportar múltiples idiomas sin problemas.

### 4. `src/__tests__/` (Pruebas)
Contiene la suite de tests automatizados de Vitest para garantizar la estabilidad de la lógica matemática de cálculo e intervalos en el core.

## Estructura del Fichero de Backup (JSON)

El archivo generado durante la exportación y requerido para la importación consolida toda la base de datos de `localStorage` de la aplicación en un único objeto plano con el siguiente formato:

```json
{
  "mini_tools_time_tasks": {
    "1": {
      "id": "1",
      "ticketId": "WEB-123",
      "description": "Resolver bug de login",
      "createdAt": 1690000000
    },
    "2": {
      "id": "2",
      "ticketId": "WEB-124",
      "description": "Revisar Pull Requests",
      "createdAt": 1690003600
    }
  },
  "mini_tools_time_2026-06-29": {
    "events": [
      {
        "timestamp": 1690000000,
        "type": "creation",
        "taskRef": "1"
      },
      {
        "timestamp": 1690001000,
        "type": "start",
        "taskRef": "1",
        "isManualEdit": false
      },
      {
        "timestamp": 1690005000,
        "type": "correction",
        "taskRef": "1",
        "correctionSeconds": 900,
        "isManualEdit": true
      },
      {
        "timestamp": 1690007200,
        "type": "stop",
        "isManualEdit": false
      }
    ]
  }
}
```

*   **`mini_tools_time_tasks`**: Diccionario global de tareas indexadas por su identificador numérico de tipo string.
*   **`mini_tools_time_YYYY-MM-DD`**: Array de eventos para una fecha específica. Los eventos del flujo temporal hacen referencia a la tarea por su ID (`taskRef`). Los eventos `'correction'` pueden contener ajustes positivos o negativos mediante `correctionSeconds`.
