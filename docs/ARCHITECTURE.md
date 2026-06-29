# Project Architecture

*Read this in [Español](ARCHITECTURE-es.md).*

The `time-tracker` project follows a decoupled and modular architecture separating business logic from the presentation framework (Vue 3).

## Directory Structure

### 1. `src/core/` (Business Logic & Domain Layer)
This folder contains pure TypeScript logic and is completely independent of the frontend framework.
- **`domain/types.ts`**: Defines the basic domain models such as `Task`, `TimeEvent`, `DayRecord` and the `StorageAdapter` interface.
- **`storage/LocalStorageAdapter.ts`**: Concrete implementation of the persistence contract using the browser's native `localStorage` API.
- **`services/TaskService.ts`**: Manages the global tasks dictionary to reuse them across multiple days without duplicating descriptions or ticket IDs.
- **`services/TimeTrackerService.ts`**: Service controlling tracking logic (starting, pausing, and manual adjustments by adding/subtracting seconds).

### 2. `src/ui/` (Presentation Layer)
- **`composables/useTimeTracker.ts`**: Reactive bridge connecting the Core to Vue. Handles the ticking timer and the `beforeunload` listener for safe auto-pausing.
- **`components/`**: Decoupled, presentational (dumb) components to easily export them to our shared library:
  - **`AppHeader.vue`**: Bilingual header with language selector.
  - **`DateSelector.vue`**: Date navigator with navigation limits (prevents future dates) and record dot indicator.
  - **`ActiveTracker.vue`**: Main control block. Houses the workday totalizer, the play/pause button, and the daily tasks list (clickable to start tracking instantly).
  - **`TaskModal.vue`**: Autocomplete modal to search, retrieve, and associate tasks.
  - **`EditTimeModal.vue`**: Modal to add or subtract hours and minutes.
  - **`ExportActions.vue`**: Local JSON database backup exporter.

### 3. `src/i18n/` (Internationalization)
Houses the dictionaries (`en.json`, `es.json`) and the internationalization plugin setup.

### 4. `src/__tests__/` (Testing)
Contains Vitest automated unit tests ensuring the stability of Core duration and time math calculations.
