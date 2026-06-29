<!-- src/ui/components/ActiveTracker.vue -->
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  isRunning: boolean;
  activeTaskId: string | null;
  calculatedTimes: Record<string, number>;
  tasks: Array<{ id: string; ticketId: string; description: string }>;
  isToday: boolean;
}>();

defineEmits<{
  (e: 'toggleTracking'): void;
  (e: 'selectTask', id: string): void;
  (e: 'openAddTaskModal'): void;
  (e: 'openEditTimeModal', id: string): void;
}>();

// Formats duration in seconds into HH:MM:SS
const formatTimeHMS = (totalSeconds: number): string => {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return [
    String(hrs).padStart(2, '0'),
    String(mins).padStart(2, '0'),
    String(secs).padStart(2, '0')
  ].join(':');
};

// Formats duration into a readable "Xh Ym Zs" format for table list
const formatTimeFriendly = (totalSeconds: number): string => {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return `${hrs}h ${mins}m ${secs}s`;
};

// Total day time is the sum of calculatedTimes
const totalDayTime = computed(() => {
  return Object.values(props.calculatedTimes).reduce((acc, curr) => acc + curr, 0);
});

const getTaskDetails = (id: string) => {
  return props.tasks.find(t => t.id === id) || { ticketId: '???', description: 'Unknown Task' };
};

</script>

<template>
  <div class="active-tracker card">
    <!-- Total Workday Timer Section -->
    <div class="timer-section">
      <span class="form-label">{{ $t('summary.totalTime') }}</span>
      <div class="timer-display">{{ formatTimeHMS(totalDayTime) }}</div>
      
      <!-- Control Buttons -->
      <div class="controls-wrapper">
        <button 
          class="btn-primary play-btn" 
          :class="{ 'running': isRunning }"
          :disabled="!activeTaskId || !isToday"
          @click="$emit('toggleTracking')"
        >
          <span v-if="isRunning">{{ $t('tracker.btnStop') }}</span>
          <span v-else>{{ $t('tracker.btnStart') }}</span>
        </button>

        <button class="btn-secondary add-task-btn" @click="$emit('openAddTaskModal')">
          {{ $t('tracker.new') }}
        </button>
      </div>
    </div>

    <hr class="separator" />

    <!-- Tasks List Section -->
    <div class="tasks-list-section">
      <h3 class="list-title">{{ $t('summary.title') }}</h3>
      
      <div v-if="Object.keys(calculatedTimes).length > 0" class="task-rows">
        <div 
          v-for="(time, taskId) in calculatedTimes" 
          :key="taskId" 
          class="task-row"
          :class="{ 
            'is-active': activeTaskId === taskId && isRunning,
            'is-selected': activeTaskId === taskId,
            'readonly': !isToday
          }"
          @click="isToday && $emit('selectTask', taskId)"
        >
          <div class="task-meta">
            <span class="active-dot" v-if="activeTaskId === taskId && isRunning"></span>
            <strong class="ticket-badge">{{ getTaskDetails(taskId).ticketId }}</strong>
            <span class="task-desc">{{ getTaskDetails(taskId).description }}</span>
          </div>

          <div class="task-actions" @click.stop>
            <span class="task-duration">{{ formatTimeFriendly(time) }}</span>
            <button 
              class="btn-secondary edit-time-btn" 
              @click="$emit('openEditTimeModal', taskId)"
            >
              Editar
            </button>
          </div>
        </div>
      </div>

      <div v-else class="no-records-view">
        <p>{{ $t('summary.noRecords') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.active-tracker {
  display: flex;
  flex-direction: column;
  padding: 2.5rem;
}

.timer-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
}

.timer-display {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 4rem;
  font-weight: 800;
  color: var(--text-main);
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
  letter-spacing: -0.05em;
}

.controls-wrapper {
  display: flex;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
  margin-bottom: 1.25rem;
}

.play-btn {
  flex: 2;
  font-size: 1.1rem;
  padding: 0.9rem;
}

.play-btn.running {
  background-color: var(--error-color);
  color: #ffffff;
}

.add-task-btn {
  flex: 1.2;
  font-size: 1.05rem;
  padding: 0.9rem;
}

.separator {
  margin: 2rem 0;
  border: none;
  border-top: 1px solid var(--border-color);
  width: 100%;
}

/* Tasks List */
.tasks-list-section {
  width: 100%;
}

.list-title {
  font-size: 1.1rem;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.task-rows {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.task-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--bg-body);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.task-row:not(.readonly):hover {
  border-color: var(--text-muted);
  background-color: var(--bg-surface-hover);
}

.task-row.is-selected {
  border-color: var(--text-main);
  background-color: var(--bg-surface-hover);
}

.task-row.is-active {
  border-color: var(--success-color);
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.15);
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.active-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--success-color);
  display: inline-block;
  animation: blink 1.5s infinite;
}

.ticket-badge {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.85rem;
  white-space: nowrap;
}

.task-desc {
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: 1rem;
}

.task-duration {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-weight: 600;
  font-size: 0.9rem;
}

.edit-time-btn {
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
}

.no-records-view {
  text-align: center;
  color: var(--text-muted);
  padding: 2rem 0;
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}

@media (max-width: 600px) {
  .active-tracker {
    padding: 1.5rem;
  }
  
  .timer-display {
    font-size: 3rem;
  }

  .controls-wrapper {
    flex-direction: column;
    gap: 0.5rem;
  }

  .task-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .task-actions {
    width: 100%;
    justify-content: space-between;
    margin-left: 0;
  }
}
</style>
