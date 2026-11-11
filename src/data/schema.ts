import type { AppData, Category, PackingItem, TravelCollection, TravelPhase } from '../domain/types';

export const CURRENT_SCHEMA_VERSION = 2;

type StoredDocument = { schemaVersion: number; data: unknown };
type Migration = (data: unknown) => unknown;

const migrations: Partial<Record<number, Migration>> = {
  1: migrateV1ToV2
};

function migrateV1ToV2(data: unknown): unknown {
  if (!isRecord(data) || !Array.isArray(data.items)) throw new Error('Invalid schema 1 data');
  return {
    ...data,
    items: data.items.map((value) => {
      if (!isRecord(value) || !Array.isArray(value.categoryIds) || !value.categoryIds.every((entry) => typeof entry === 'string')) {
        throw new Error('Invalid schema 1 packing item');
      }
      const { categoryIds, ...item } = value;
      const categoryId = categoryIds[0];
      return categoryId === undefined ? item : { ...item, categoryId };
    })
  };
}

export function encodeAppData(data: AppData): string {
  const document: StoredDocument = { schemaVersion: CURRENT_SCHEMA_VERSION, data };
  return JSON.stringify(document);
}

export function decodeAndMigrate(serialized: string): AppData {
  const parsed: unknown = JSON.parse(serialized);
  if (!isRecord(parsed) || !Number.isInteger(parsed.schemaVersion) || !('data' in parsed)) throw new Error('Invalid Yakipaki data envelope');

  let version = parsed.schemaVersion as number;
  let data: unknown = parsed.data;
  if (version > CURRENT_SCHEMA_VERSION) throw new Error('Data was written by a newer Yakipaki version');

  while (version < CURRENT_SCHEMA_VERSION) {
    const migration = migrations[version];
    if (!migration) throw new Error(`Missing data migration from schema ${version}`);
    data = migration(data);
    version += 1;
  }
  return assertAppData(data);
}

export function assertAppData(value: unknown): AppData {
  if (!isRecord(value) || (value.language !== 'de' && value.language !== 'en')) throw new Error('Invalid app settings');
  if (!Array.isArray(value.items) || !value.items.every(isPackingItem)) throw new Error('Invalid packing items');
  if (!Array.isArray(value.categories) || !value.categories.every(isCategory)) throw new Error('Invalid categories');
  if (!Array.isArray(value.phases) || !value.phases.every(isTravelPhase)) throw new Error('Invalid travel phases');
  if (!Array.isArray(value.collections) || !value.collections.every(isTravelCollection)) throw new Error('Invalid travel groups');
  return value as AppData;
}

function isPackingItem(value: unknown): value is PackingItem {
  return isRecord(value) && typeof value.id === 'string' && typeof value.name === 'string'
    && typeof value.quantity === 'number' && typeof value.packed === 'boolean' && typeof value.owned === 'boolean'
    && (value.categoryId === undefined || typeof value.categoryId === 'string')
    && value.categoryIds === undefined
    && isStringArray(value.phaseIds) && typeof value.notes === 'string';
}

function isCategory(value: unknown): value is Category {
  return isRecord(value) && typeof value.id === 'string' && typeof value.name === 'string' && typeof value.color === 'string';
}

function isTravelPhase(value: unknown): value is TravelPhase {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.name !== 'string') return false;
  if (value.collectionId !== undefined && typeof value.collectionId !== 'string') return false;
  const hasDates = typeof value.startDate === 'string' && typeof value.endDate === 'string';
  const hasDuration = Number.isInteger(value.durationDays) && (value.durationDays as number) > 0;
  return hasDates !== hasDuration;
}

function isTravelCollection(value: unknown): value is TravelCollection {
  return isRecord(value) && typeof value.id === 'string' && typeof value.name === 'string';
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
