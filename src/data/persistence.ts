import Storage from 'expo-sqlite/kv-store';
import { AppData } from '../domain/types';
import { seedData } from './seed';
import { assertAppData, decodeAndMigrate, encodeAppData } from './schema';

// This key is permanent. Schema versions belong inside the stored document so
// every app release can find and migrate data written by older releases.
const STORAGE_KEY = 'yakipaki.data';
const LEGACY_V1_KEY = 'yakipaki.data.v1';
export async function loadAppData(): Promise<AppData> {
  const stored = await Storage.getItem(STORAGE_KEY);
  if (stored) return decodeAndMigrate(stored);

  // Import builds created before the permanent versioned envelope existed.
  const legacy = await Storage.getItem(LEGACY_V1_KEY);
  if (legacy) {
    const data = assertAppData(JSON.parse(legacy));
    await saveAppData(data);
    return data;
  }

  return seedData;
}

export async function saveAppData(data: AppData): Promise<void> {
  await Storage.setItem(STORAGE_KEY, encodeAppData(data));
}
