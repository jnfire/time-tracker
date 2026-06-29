<!-- src/ui/components/EditTimeModal.vue -->
<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  show: boolean;
  task: { id: string; ticketId: string; description: string } | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', minutes: number): void;
}>();

const hoursAmount = ref<number>(0);
const minutesAmount = ref<number>(15);
const editType = ref<'add' | 'subtract'>('add');

const handleSave = () => {
  if (!props.task) return;
  
  const totalMinutes = (hoursAmount.value * 60) + minutesAmount.value;
  if (totalMinutes <= 0) return;

  const factor = editType.value === 'add' ? 1 : -1;
  emit('save', totalMinutes * factor);
  
  // Reset
  hoursAmount.value = 0;
  minutesAmount.value = 15;
};
</script>

<template>
  <div v-if="show && task" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content card">
      <div class="modal-header">
        <h3>Ajustar Tiempo: [{{ task.ticketId }}]</h3>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <div class="modal-body">
        <p class="task-desc-text">{{ task.description }}</p>

        <div class="mode-selector">
          <button 
            type="button"
            :class="{ active: editType === 'add' }" 
            @click="editType = 'add'"
          >
            Añadir
          </button>
          <button 
            type="button"
            :class="{ active: editType === 'subtract' }" 
            @click="editType = 'subtract'"
          >
            Restar
          </button>
        </div>

        <div class="time-inputs-grid">
          <div class="form-group">
            <label class="form-label">Horas</label>
            <input 
              type="number" 
              class="input-element" 
              v-model.number="hoursAmount" 
              min="0" 
              required
            />
          </div>
          <div class="form-group">
            <label class="form-label">Minutos</label>
            <input 
              type="number" 
              class="input-element" 
              v-model.number="minutesAmount" 
              min="0" 
              max="59"
              required
            />
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" @click="$emit('close')">{{ $t('summary.btnCancel') }}</button>
        <button class="btn-primary" @click="handleSave" :disabled="(hoursAmount * 60 + minutesAmount) <= 0">
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
  max-width: 400px;
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

.task-desc-text {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

.mode-selector {
  display: flex;
  background-color: var(--bg-body);
  padding: 0.25rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  margin-bottom: 1.5rem;
}

.mode-selector button {
  flex: 1;
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.mode-selector button.active {
  background-color: var(--bg-surface);
  color: var(--text-main);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.time-inputs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
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
</style>
