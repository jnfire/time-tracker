<!-- src/ui/components/DateSelector.vue -->
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: string;
  datesWithRecords: string[];
  label: string;
  maxDate: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const selectedDate = computed({
  get: () => props.modelValue,
  set: (val) => {
    if (val <= props.maxDate) {
      emit('update:modelValue', val);
    }
  }
});

const hasRecords = computed(() => {
  return props.datesWithRecords.includes(props.modelValue);
});

const isMaxDate = computed(() => {
  return props.modelValue >= props.maxDate;
});

const changeDay = (offset: number) => {
  const current = new Date(props.modelValue + 'T00:00:00');
  current.setDate(current.getDate() + offset);
  
  const year = current.getFullYear();
  const month = String(current.getMonth() + 1).padStart(2, '0');
  const day = String(current.getDate()).padStart(2, '0');
  
  const targetDate = `${year}-${month}-${day}`;
  if (targetDate <= props.maxDate) {
    selectedDate.value = targetDate;
  }
};
</script>

<template>
  <div class="date-selector-container">
    <span class="form-label">{{ label }}</span>
    <div class="date-selector">
      <button type="button" class="btn-secondary nav-btn" @click="changeDay(-1)">
        &larr;
      </button>
      <div class="date-input-wrapper">
        <input 
          type="date" 
          v-model="selectedDate" 
          class="input-element date-input"
          :class="{ 'has-records': hasRecords }"
          :max="maxDate"
        />
        <div v-if="hasRecords" class="records-dot" title="Has logs"></div>
      </div>
      <button type="button" class="btn-secondary nav-btn" @click="changeDay(1)" :disabled="isMaxDate">
        &rarr;
      </button>
    </div>
  </div>
</template>

<style scoped>
.date-selector-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  align-items: center;
}

.date-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 320px;
}

.nav-btn {
  padding: 0.75rem 1rem;
  font-size: 1.1rem;
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.date-input-wrapper {
  position: relative;
  flex: 1;
}

.date-input {
  text-align: center;
  font-weight: 500;
}

.date-input.has-records {
  border-color: var(--success-color);
}

.records-dot {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: var(--success-color);
}
</style>
