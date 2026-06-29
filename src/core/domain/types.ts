// src/core/domain/types.ts

export interface Task {
  id: string; // UUID
  ticketId: string;
  description: string;
  createdAt: number; // epoch in seconds
}

export type EventType = 'start' | 'stop' | 'switch' | 'creation' | 'correction';

export interface TimeEvent {
  timestamp: number; // epoch in seconds
  type: EventType;
  taskRef?: string; // reference to Task.id
  isManualEdit?: boolean;
  correctionSeconds?: number; // duration offset in seconds (for 'correction' event)
}

export interface DayRecord {
  events: TimeEvent[];
}

export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  getAllKeys(): string[];
}
