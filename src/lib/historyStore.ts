import { ContentHistoryEntry } from "../types";

export function getHistoryFromStore(userId: string): ContentHistoryEntry[] {
  const key = `creo-history-${userId}`;
  const saved = localStorage.getItem(key);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch (err) {
    console.error("Failed to parse history logs:", err);
    return [];
  }
}

export function saveHistoryToStore(userId: string, entry: Omit<ContentHistoryEntry, "id">): ContentHistoryEntry {
  const key = `creo-history-${userId}`;
  const entries = getHistoryFromStore(userId);
  const newEntry: ContentHistoryEntry = {
    ...entry,
    id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
  };
  entries.unshift(newEntry);
  localStorage.setItem(key, JSON.stringify(entries));
  return newEntry;
}

export function deleteHistoryFromStore(userId: string, entryId: string): void {
  const key = `creo-history-${userId}`;
  const entries = getHistoryFromStore(userId);
  const filtered = entries.filter((item) => item.id !== entryId);
  localStorage.setItem(key, JSON.stringify(filtered));
}
