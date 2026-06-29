// src/core/storage/LocalStorageAdapter.ts
import { StorageAdapter } from '../domain/types';

export class LocalStorageAdapter implements StorageAdapter {
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  getAllKeys(): string[] {
    return Object.keys(localStorage);
  }
}
