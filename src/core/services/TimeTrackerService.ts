// src/core/services/TimeTrackerService.ts
import { TimeEvent, StorageAdapter, DayRecord } from '../domain/types';

export class TimeTrackerService {
  private readonly appPrefix = 'mini_tools_time_';
  private storage: StorageAdapter;

  constructor(storage: StorageAdapter) {
    this.storage = storage;
  }

  private getStorageKey(dateStr: string): string {
    return `${this.appPrefix}${dateStr}`;
  }

  public getDailyRecord(dateStr: string): DayRecord {
    const raw = this.storage.getItem(this.getStorageKey(dateStr));
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (error) {
        return { events: [] };
      }
    }
    return { events: [] };
  }

  private saveDailyRecord(dateStr: string, record: DayRecord): void {
    this.storage.setItem(this.getStorageKey(dateStr), JSON.stringify(record));
  }

  public getTodayStr(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  public getDatesWithRecords(): string[] {
    const keys = this.storage.getAllKeys();
    return keys
      .filter(k => k.startsWith(this.appPrefix) && k !== `${this.appPrefix}tasks`)
      .map(k => k.replace(this.appPrefix, ''))
      .sort();
  }

  public isRunning(dateStr: string): boolean {
    const record = this.getDailyRecord(dateStr);
    if (record.events.length === 0) return false;
    
    const trackingEvents = record.events.filter(e => e.type === 'start' || e.type === 'switch' || e.type === 'stop');
    if (trackingEvents.length === 0) return false;

    const lastEvent = trackingEvents[trackingEvents.length - 1];
    return lastEvent.type === 'start' || lastEvent.type === 'switch';
  }

  public getActiveTaskRef(dateStr: string): string | null {
    const record = this.getDailyRecord(dateStr);
    if (record.events.length === 0) return null;
    
    const trackingEvents = record.events.filter(e => e.type === 'start' || e.type === 'switch' || e.type === 'stop');
    if (trackingEvents.length === 0) return null;

    const lastEvent = trackingEvents[trackingEvents.length - 1];
    if (lastEvent.type === 'start' || lastEvent.type === 'switch') {
      return lastEvent.taskRef || null;
    }
    return null;
  }

  public getLastActiveTaskRef(dateStr: string): string | null {
    const record = this.getDailyRecord(dateStr);
    if (record.events.length === 0) return null;

    // Search backward for the most recent event referencing a task
    for (let i = record.events.length - 1; i >= 0; i--) {
      const event = record.events[i];
      if (event.taskRef) {
        return event.taskRef;
      }
    }
    return null;
  }

  public associateTaskToDay(dateStr: string, taskRefId: string, timestamp: number = Math.floor(Date.now() / 1000)): void {
    const record = this.getDailyRecord(dateStr);
    
    const exists = record.events.some(e => e.taskRef === taskRefId);
    if (exists) return;

    const newEvent: TimeEvent = {
      timestamp,
      type: 'creation',
      taskRef: taskRefId
    };

    record.events.push(newEvent);
    record.events.sort((a, b) => a.timestamp - b.timestamp);
    this.saveDailyRecord(dateStr, record);
  }

  public addTimeCorrection(
    dateStr: string,
    taskRefId: string,
    correctionSeconds: number,
    timestamp: number = Math.floor(Date.now() / 1000)
  ): void {
    const record = this.getDailyRecord(dateStr);
    
    const newEvent: TimeEvent = {
      timestamp,
      type: 'correction',
      taskRef: taskRefId,
      correctionSeconds,
      isManualEdit: true
    };

    record.events.push(newEvent);
    record.events.sort((a, b) => a.timestamp - b.timestamp);
    this.saveDailyRecord(dateStr, record);
  }

  public startTracking(taskRefId: string, timestamp: number = Math.floor(Date.now() / 1000)): void {
    const today = this.getTodayStr();
    const record = this.getDailyRecord(today);

    if (this.isRunning(today) && this.getActiveTaskRef(today) === taskRefId) {
      return;
    }

    const newEvent: TimeEvent = {
      timestamp,
      type: this.isRunning(today) ? 'switch' : 'start',
      taskRef: taskRefId,
      isManualEdit: false
    };

    record.events.push(newEvent);
    record.events.sort((a, b) => a.timestamp - b.timestamp);
    this.saveDailyRecord(today, record);
  }

  public stopTracking(timestamp: number = Math.floor(Date.now() / 1000)): void {
    const today = this.getTodayStr();
    if (!this.isRunning(today)) return;

    const record = this.getDailyRecord(today);
    const newEvent: TimeEvent = {
      timestamp,
      type: 'stop',
      isManualEdit: false
    };

    record.events.push(newEvent);
    record.events.sort((a, b) => a.timestamp - b.timestamp);
    this.saveDailyRecord(today, record);
  }

  public getCalculatedTimePerTask(dateStr: string, currentTimestamp: number = Math.floor(Date.now() / 1000)): Record<string, number> {
    const record = this.getDailyRecord(dateStr);
    const totals: Record<string, number> = {};

    for (const event of record.events) {
      if (event.taskRef) {
        totals[event.taskRef] = 0;
      }
    }

    let activeTask: string | null = null;
    let startTime: number | null = null;

    for (const event of record.events) {
      if (event.type === 'start' || event.type === 'switch') {
        if (activeTask && startTime !== null) {
          const duration = event.timestamp - startTime;
          totals[activeTask] = (totals[activeTask] || 0) + (duration > 0 ? duration : 0);
        }
        activeTask = event.taskRef || null;
        startTime = event.timestamp;
      } else if (event.type === 'stop') {
        if (activeTask && startTime !== null) {
          const duration = event.timestamp - startTime;
          totals[activeTask] = (totals[activeTask] || 0) + (duration > 0 ? duration : 0);
        }
        activeTask = null;
        startTime = null;
      } else if (event.type === 'correction') {
        if (event.taskRef && event.correctionSeconds !== undefined) {
          totals[event.taskRef] = (totals[event.taskRef] || 0) + event.correctionSeconds;
        }
      }
    }

    if (activeTask && startTime !== null) {
      const activeDuration = currentTimestamp - startTime;
      totals[activeTask] = (totals[activeTask] || 0) + (activeDuration > 0 ? activeDuration : 0);
    }

    for (const taskRef in totals) {
      if (totals[taskRef] < 0) {
        totals[taskRef] = 0;
      }
    }

    return totals;
  }
}
