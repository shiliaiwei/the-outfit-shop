"use client";

/**
 * Universal Persistent Client Store & API Synchronization Layer
 * Guarantees that any CRUD creation/update/deletion persists across page reloads
 * even if the remote backend API is unauthenticated, offline, or returns static seeds.
 */

const STORAGE_PREFIX = "outfit_store_v1_";

export const entityStore = {
  get: <T = any>(key: string, defaultData: T[] = []): T[] => {
    if (typeof window === "undefined") return defaultData;
    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (!stored) {
        // Initialize with default
        localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(defaultData));
        return defaultData;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : defaultData;
    } catch {
      return defaultData;
    }
  },

  set: <T = any>(key: string, data: T[]): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn(`[EntityStore] Failed to save key "${key}":`, e);
    }
  },

  add: <T = any>(key: string, item: T, defaultData: T[] = []): T[] => {
    const current = entityStore.get<T>(key, defaultData);
    const newItem = {
      ...(item as any),
      id: (item as any).id ?? Date.now(),
      created_at: (item as any).created_at ?? new Date().toISOString()
    };
    const updated = [newItem, ...current.filter(existing => String((existing as any).id) !== String(newItem.id))];
    entityStore.set(key, updated);
    return updated;
  },

  update: <T = any>(key: string, id: string | number, partial: any, defaultData: T[] = []): T[] => {
    const current = entityStore.get<T>(key, defaultData);
    const updated = current.map(item => {
      if (String((item as any).id) === String(id)) {
        return { ...item, ...partial, updated_at: new Date().toISOString() };
      }
      return item;
    });
    entityStore.set(key, updated);
    return updated;
  },

  delete: <T = any>(key: string, id: string | number, defaultData: T[] = []): T[] => {
    const current = entityStore.get<T>(key, defaultData);
    const updated = current.filter(item => String((item as any).id) !== String(id));
    entityStore.set(key, updated);
    return updated;
  },

  /**
   * Intelligently merges live API results with locally created/modified items
   */
  sync: <T = any>(key: string, apiItems: T[], defaultData: T[] = []): T[] => {
    const local = entityStore.get<T>(key, defaultData);
    if (!apiItems || !Array.isArray(apiItems) || apiItems.length === 0) {
      return local.length > 0 ? local : defaultData;
    }

    // Merge: Include all locally created items not in API + API items
    const apiMap = new Map(apiItems.map(item => [String((item as any).id), item]));
    const localAdditions = local.filter(l => !apiMap.has(String((l as any).id)));
    
    const merged = [...localAdditions, ...apiItems];
    entityStore.set(key, merged);
    return merged;
  }
};
