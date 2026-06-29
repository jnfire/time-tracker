<!-- src/ui/components/TaskModal.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  show: boolean;
  existingTasks: Array<{ id: string; ticketId: string; description: string }>;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', data: { ticketId: string; description: string }): void;
}>();

const ticketId = ref('');
const description = ref('');
const searchQuery = ref('');

const filteredSuggestions = computed(() => {
  if (!searchQuery.value.trim()) return [];
  const query = searchQuery.value.toLowerCase().trim();
  return props.existingTasks.filter(
    t => t.ticketId.toLowerCase().includes(query) || t.description.toLowerCase().includes(query)
  );
});

const selectSuggestion = (task: { ticketId: string; description: string }) => {
  ticketId.value = task.ticketId;
  description.value = task.description;
  searchQuery.value = ''; // Close suggestions
};

const handleSave = () => {
  if (!ticketId.value.trim() || !description.value.trim()) return;
  emit('save', {
    ticketId: ticketId.value.trim(),
    description: description.value.trim()
  });
  // Clear fields
  ticketId.value = '';
  description.value = '';
  searchQuery.value = '';
};
</script>

<template>
  <div v-if="show" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content card">
      <div class="modal-header">
        <h3>{{ $t('summary.editPast') }} / {{ $t('tracker.new') }}</h3>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>
      
      <div class="modal-body">
        <!-- Search bar for existing tasks -->
        <div class="form-group search-container">
          <label class="form-label">Buscar Tarea Existente</label>
          <input 
            type="text" 
            class="input-element" 
            v-model="searchQuery" 
            placeholder="Escribe ID o descripción para buscar..."
          />
          <ul v-if="filteredSuggestions.length > 0" class="suggestions-list">
            <li 
              v-for="task in filteredSuggestions" 
              :key="task.id" 
              @click="selectSuggestion(task)"
            >
              <strong>[{{ task.ticketId }}]</strong> {{ task.description }}
            </li>
          </ul>
        </div>

        <hr class="separator" />

        <div class="form-group">
          <label class="form-label">{{ $t('tracker.taskId') }}</label>
          <input 
            type="text" 
            class="input-element" 
            v-model="ticketId" 
            :placeholder="$t('tracker.taskIdPlaceholder')"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">{{ $t('tracker.description') }}</label>
          <input 
            type="text" 
            class="input-element" 
            v-model="description" 
            :placeholder="$t('tracker.descriptionPlaceholder')"
            required
          />
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" @click="$emit('close')">{{ $t('summary.btnCancel') }}</button>
        <button class="btn-primary" @click="handleSave" :disabled="!ticketId || !description">
          {{ $t('summary.btnSave') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  width: 100%;
  max-width: 500px;
  margin: 1.5rem;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: var(--text-muted);
  cursor: pointer;
}

.close-btn:hover {
  color: var(--text-main);
}

.modal-body {
  margin-bottom: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
}

.search-container {
  position: relative;
}

.suggestions-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: var(--bg-body);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-top: 0.25rem;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  list-style: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.suggestions-list li {
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.9rem;
}

.suggestions-list li:last-child {
  border-bottom: none;
}

.suggestions-list li:hover {
  background-color: var(--bg-surface-hover);
}

.separator {
  margin: 1.5rem 0;
  border: none;
  border-top: 1px solid var(--border-color);
}
</style>
