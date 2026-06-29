// src/__tests__/services.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { StorageAdapter } from '../core/domain/types';
import { TaskService } from '../core/services/TaskService';
import { TimeTrackerService } from '../core/services/TimeTrackerService';

class MockStorageAdapter implements StorageAdapter {
  private data: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.data[key] || null;
  }

  setItem(key: string, value: string): void {
    this.data[key] = value;
  }

  removeItem(key: string): void {
    delete this.data[key];
  }

  getAllKeys(): string[] {
    return Object.keys(this.data);
  }
}

describe('TaskService', () => {
  let storage: StorageAdapter;
  let service: TaskService;

  beforeEach(() => {
    storage = new MockStorageAdapter();
    service = new TaskService(storage);
  });

  it('should create and retrieve tasks with auto-incrementing numeric string IDs', () => {
    const task1 = service.createTask('PROJ-1', 'Implement tests');
    expect(task1.id).toBe('1');
    expect(task1.ticketId).toBe('PROJ-1');
    expect(task1.description).toBe('Implement tests');

    const task2 = service.createTask('PROJ-2', 'Refactor UI');
    expect(task2.id).toBe('2');

    const list = service.getTasks();
    expect(list.length).toBe(2);
    const ids = list.map(t => t.id);
    expect(ids).toContain('1');
    expect(ids).toContain('2');
  });

  it('should prevent duplicate task creation and return the existing one', () => {
    const task1 = service.createTask('PROJ-1', 'Same task');
    const task2 = service.createTask('PROJ-1', 'same task '); // whitespace and case check
    expect(task1.id).toBe(task2.id);
    expect(task1.id).toBe('1');
    expect(service.getTasks().length).toBe(1);
  });
});

describe('TimeTrackerService', () => {
  let storage: StorageAdapter;
  let service: TimeTrackerService;

  beforeEach(() => {
    storage = new MockStorageAdapter();
    service = new TimeTrackerService(storage);
  });

  it('should calculate task times correctly', () => {
    const today = service.getTodayStr();
    // Simulate timeline:
    // t=0: Start Task A
    // t=100: Switch to Task B
    // t=250: Stop
    // t=300: Add +100s time correction to Task A
    
    service.startTracking('task-A', 1000);
    service.startTracking('task-B', 1100); // switch
    service.stopTracking(1250); // stop
    service.addTimeCorrection(today, 'task-A', 100, 1300);

    const totals = service.getCalculatedTimePerTask(today, 1500);

    expect(totals['task-A']).toBe(100 + 100); // 100s active + 100s manual correction
    expect(totals['task-B']).toBe(150); // 250 - 100
  });

  it('should handle negative time corrections but enforce a 0 minimum', () => {
    const today = service.getTodayStr();
    service.startTracking('task-A', 1000);
    service.stopTracking(1100); // 100s
    service.addTimeCorrection(today, 'task-A', -50, 1200); // correction of -50s

    const totals1 = service.getCalculatedTimePerTask(today, 1300);
    expect(totals1['task-A']).toBe(50); // 100 - 50 = 50s

    service.addTimeCorrection(today, 'task-A', -200, 1400); // correction of -200s
    const totals2 = service.getCalculatedTimePerTask(today, 1500);
    expect(totals2['task-A']).toBe(0); // 50 - 200 = -150s, but floors to 0
  });

  it('should report correct running states', () => {
    const today = service.getTodayStr();
    expect(service.isRunning(today)).toBe(false);

    service.startTracking('task-A', 1000);
    expect(service.isRunning(today)).toBe(true);
    expect(service.getActiveTaskRef(today)).toBe('task-A');

    service.stopTracking(1100);
    expect(service.isRunning(today)).toBe(false);
    expect(service.getActiveTaskRef(today)).toBeNull();
  });

  it('should associate tasks to day without adding time (creation event)', () => {
    const today = service.getTodayStr();
    service.associateTaskToDay(today, 'task-A', 1000);
    
    // Check that it's listed in calculated times with 0 seconds
    const totals = service.getCalculatedTimePerTask(today, 1100);
    expect(totals['task-A']).toBe(0);

    // Verify duplication prevention
    service.associateTaskToDay(today, 'task-A', 1200);
    const record = service.getDailyRecord(today);
    const creationEvents = record.events.filter(e => e.taskRef === 'task-A' && e.type === 'creation');
    expect(creationEvents.length).toBe(1);
  });
});
