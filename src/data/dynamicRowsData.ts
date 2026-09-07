import { DynamicRow } from '../types';

// Updated storage key to ensure a completely clean, empty starting state
const STORAGE_KEY = 'clasty_shelves_dynamic_v5';

// Purely empty starting state as requested - no test or dummy data
export const initialDynamicRows: DynamicRow[] = [];

export function loadDynamicRows(): DynamicRow[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load shelves from storage:', err);
  }
  return initialDynamicRows;
}

export function saveDynamicRows(rows: DynamicRow[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  } catch (err) {
    console.error('Failed to save shelves to storage:', err);
  }
}
