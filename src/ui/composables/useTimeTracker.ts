// src/ui/composables/useTimeTracker.ts
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { LocalStorageAdapter } from '../../core/storage/LocalStorageAdapter';
import { TaskService } from '../../core/services/TaskService';
import { TimeTrackerService } from '../../core/services/TimeTrackerService';
import { Task } from '../../core/domain/types';

const storageAdapter = new LocalStorageAdapter();
const taskService = new TaskService(storageAdapter);
const trackerService = new TimeTrackerService(storageAdapter);

export function useTimeTracker() {
  const selectedDate = ref<string>(trackerService.getTodayStr());
  const tasksList = ref<Task[]>(taskService.getTasks());
  const datesWithRecords = ref<string[]>(trackerService.getDatesWithRecords());

  const isRunning = ref<boolean>(trackerService.isRunning(trackerService.getTodayStr()));
  const activeTaskId = ref<string | null>(null);
  const currentSeconds = ref<number>(0);
  let timerInterval: any = null;

  const calculatedTimes = ref<Record<string, number>>({});

  const refreshTimes = () => {
    calculatedTimes.value = trackerService.getCalculatedTimePerTask(selectedDate.value);
    datesWithRecords.value = trackerService.getDatesWithRecords();
    
    isRunning.value = trackerService.isRunning(selectedDate.value);
    
    const currentlyRunning = trackerService.getActiveTaskRef(selectedDate.value);
    if (currentlyRunning) {
      activeTaskId.value = currentlyRunning;
    } else if (!activeTaskId.value || selectedDate.value !== trackerService.getTodayStr()) {
      const lastActive = trackerService.getLastActiveTaskRef(selectedDate.value);
      activeTaskId.value = lastActive;
    }
  };

  const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    
    const todayRecord = trackerService.getDailyRecord(trackerService.getTodayStr());
    const trackingEvents = todayRecord.events.filter(e => e.type === 'start' || e.type === 'switch' || e.type === 'stop');
    const lastEvent = trackingEvents[trackingEvents.length - 1];
    const startTimestamp = lastEvent ? lastEvent.timestamp : Math.floor(Date.now() / 1000);

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      currentSeconds.value = Math.max(0, now - startTimestamp);
      refreshTimes();
    };

    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    currentSeconds.value = 0;
  };

  const selectTask = (id: string) => {
    if (selectedDate.value !== trackerService.getTodayStr()) return;

    activeTaskId.value = id;
    trackerService.startTracking(id);
    isRunning.value = true;
    startTimer();
    refreshTimes();
  };

  const toggleTracking = () => {
    if (selectedDate.value !== trackerService.getTodayStr() || !activeTaskId.value) return;

    if (isRunning.value) {
      trackerService.stopTracking();
      isRunning.value = false;
      stopTimer();
    } else {
      trackerService.startTracking(activeTaskId.value);
      isRunning.value = true;
      startTimer();
    }
    refreshTimes();
  };

  const associateTask = (ticketId: string, description: string) => {
    const task = taskService.createTask(ticketId, description);
    tasksList.value = taskService.getTasks();

    trackerService.associateTaskToDay(selectedDate.value, task.id);
    
    // Auto-select the newly added task as active (without starting the clock yet)
    activeTaskId.value = task.id;

    refreshTimes();
    return task;
  };

  const addCorrection = (taskId: string, minutes: number) => {
    const seconds = minutes * 60;
    trackerService.addTimeCorrection(selectedDate.value, taskId, seconds);
    refreshTimes();
  };

  const handleUnload = () => {
    if (isRunning.value) {
      trackerService.stopTracking();
    }
  };

  watch(selectedDate, (newDate, oldDate) => {
    // Reset activeTaskId when switching dates so it loads the new day's last active task correctly
    if (newDate !== oldDate) {
      activeTaskId.value = null;
    }
    refreshTimes();
  });

  onMounted(() => {
    refreshTimes();
    if (isRunning.value) {
      startTimer();
    }
    window.addEventListener('beforeunload', handleUnload);
  });

  onUnmounted(() => {
    stopTimer();
    window.removeEventListener('beforeunload', handleUnload);
  });

  const activeTask = computed(() => {
    if (!activeTaskId.value) return null;
    return taskService.getTaskById(activeTaskId.value);
  });

  const getTaskInfo = (id: string) => {
    return taskService.getTaskById(id);
  };

  return {
    selectedDate,
    tasksList,
    datesWithRecords,
    isRunning,
    activeTaskId,
    activeTask,
    currentSeconds,
    calculatedTimes,
    selectTask,
    toggleTracking,
    associateTask,
    addCorrection,
    getTaskInfo,
    todayStr: trackerService.getTodayStr()
  };
}
