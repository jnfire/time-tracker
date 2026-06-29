// src/core/services/TaskService.ts
import { Task, StorageAdapter } from '../domain/types';

export class TaskService {
  private readonly storageKey = 'mini_tools_time_tasks';
  private storage: StorageAdapter;
  private tasks: Record<string, Task> = {};

  constructor(storage: StorageAdapter) {
    this.storage = storage;
    this.loadTasks();
  }

  private loadTasks(): void {
    const raw = this.storage.getItem(this.storageKey);
    if (raw) {
      try {
        this.tasks = JSON.parse(raw);
      } catch (error) {
        this.tasks = {};
      }
    } else {
      this.tasks = {};
    }
  }

  private saveTasks(): void {
    this.storage.setItem(this.storageKey, JSON.stringify(this.tasks));
  }

  public getTasks(): Task[] {
    return Object.values(this.tasks).sort((a, b) => b.createdAt - a.createdAt);
  }

  public getTaskById(id: string): Task | null {
    return this.tasks[id] || null;
  }

  public findTaskByTicketAndDescription(ticketId: string, description: string): Task | null {
    return Object.values(this.tasks).find(
      t => t.ticketId.trim().toUpperCase() === ticketId.trim().toUpperCase() &&
           t.description.trim().toLowerCase() === description.trim().toLowerCase()
    ) || null;
  }

  public createTask(ticketId: string, description: string): Task {
    const cleanedTicket = ticketId.trim();
    const cleanedDescription = description.trim();

    // Check if it already exists
    const existing = this.findTaskByTicketAndDescription(cleanedTicket, cleanedDescription);
    if (existing) {
      return existing;
    }

    // Auto-increment numeric ID
    const ids = Object.keys(this.tasks).map(id => parseInt(id, 10)).filter(id => !isNaN(id));
    const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;

    const newTask: Task = {
      id: String(nextId),
      ticketId: cleanedTicket,
      description: cleanedDescription,
      createdAt: Math.floor(Date.now() / 1000)
    };

    this.tasks[newTask.id] = newTask;
    this.saveTasks();
    return newTask;
  }
}
