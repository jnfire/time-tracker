<!-- src/App.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppHeader from './ui/components/AppHeader.vue';
import AppFooter from './ui/components/AppFooter.vue';
import DateSelector from './ui/components/DateSelector.vue';
import ActiveTracker from './ui/components/ActiveTracker.vue';
import ExportActions from './ui/components/ExportActions.vue';
import TaskModal from './ui/components/TaskModal.vue';
import EditTimeModal from './ui/components/EditTimeModal.vue';
import { useTimeTracker } from './ui/composables/useTimeTracker';

const { t, locale } = useI18n();

const {
  selectedDate,
  tasksList,
  isRunning,
  activeTaskId,
  calculatedTimes,
  selectTask,
  toggleTracking,
  associateTask,
  addCorrection,
  todayStr
} = useTimeTracker();

const isToday = computed(() => selectedDate.value === todayStr);

// Modal states
const showAddTaskModal = ref(false);
const showEditTimeModal = ref(false);
const editTaskId = ref<string | null>(null);

const taskToEdit = computed(() => {
  if (!editTaskId.value) return null;
  return tasksList.value.find(t => t.id === editTaskId.value) || null;
});

// Languages supported
const languages = [
  { code: 'es', label: '🇪🇸 ES' },
  { code: 'en', label: '🇬🇧 EN' }
];

// Header translations
const headerTitle = computed(() => t('header.title'));
const headerSubtitle = computed(() => t('header.subtitle'));
const headerBadges = computed(() => [
  t('header.badges.opensource'),
  t('header.badges.privacy'),
  t('header.badges.serverless')
]);

const handleAddTask = (data: { ticketId: string; description: string }) => {
  associateTask(data.ticketId, data.description);
  showAddTaskModal.value = false;
};

const handleOpenEditModal = (taskId: string) => {
  editTaskId.value = taskId;
  showEditTimeModal.value = true;
};

const handleSaveCorrection = (minutes: number) => {
  if (editTaskId.value) {
    addCorrection(editTaskId.value, minutes);
    showEditTimeModal.value = false;
    editTaskId.value = null;
  }
};
</script>

<template>
  <div class="app-layout">
    <AppHeader
      :title="headerTitle"
      :subtitle="headerSubtitle"
      :badges="headerBadges"
      v-model:locale="locale"
      :languages="languages"
    />

    <main class="main-content">
      <DateSelector
        v-model="selectedDate"
        :label="t('date.label')"
        :maxDate="todayStr"
      />

      <ActiveTracker
        :isRunning="isRunning"
        :activeTaskId="activeTaskId"
        :calculatedTimes="calculatedTimes"
        :tasks="tasksList"
        :isToday="isToday"
        @toggleTracking="toggleTracking"
        @selectTask="selectTask"
        @openAddTaskModal="showAddTaskModal = true"
        @openEditTimeModal="handleOpenEditModal"
      />

      <ExportActions
        :dateStr="selectedDate"
      />
    </main>

    <!-- Modals -->
    <TaskModal
      :show="showAddTaskModal"
      :existingTasks="tasksList"
      @close="showAddTaskModal = false"
      @save="handleAddTask"
    />

    <EditTimeModal
      :show="showEditTimeModal"
      :task="taskToEdit"
      @close="showEditTimeModal = false"
      @save="handleSaveCorrection"
    />

    <AppFooter />
  </div>
</template>

<style>
@import './style.css';
</style>
