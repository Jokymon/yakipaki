import assert from 'node:assert/strict';
import test from 'node:test';
import { CURRENT_SCHEMA_VERSION, decodeAndMigrate, encodeAppData } from '../src/data/schema.ts';
import type { AppData } from '../src/domain/types.ts';

const fixture: AppData = {
  language: 'de',
  items: [{ id: 'item', name: 'Jacke', quantity: 1, packed: false, owned: true, categoryIds: ['clothes'], phaseIds: ['phase'], notes: '' }],
  categories: [{ id: 'clothes', name: 'Kleidung', color: '#55866A' }],
  phases: [{ id: 'phase', name: 'Trekking', durationDays: 4, collectionId: 'trip' }],
  collections: [{ id: 'trip', name: 'Nepal' }]
};

test('round-trips the current data schema without loss', () => {
  const encoded = encodeAppData(fixture);
  assert.equal(JSON.parse(encoded).schemaVersion, CURRENT_SCHEMA_VERSION);
  assert.deepEqual(decodeAndMigrate(encoded), fixture);
});

test('accepts date-based travel phases', () => {
  const dated: AppData = { ...fixture, phases: [{ id: 'phase', name: 'Trekking', startDate: '2027-04-01', endDate: '2027-04-05' }] };
  assert.deepEqual(decodeAndMigrate(encodeAppData(dated)), dated);
});

test('rejects data from a newer schema instead of overwriting it', () => {
  const newer = JSON.stringify({ schemaVersion: CURRENT_SCHEMA_VERSION + 1, data: fixture });
  assert.throws(() => decodeAndMigrate(newer), /newer Yakipaki version/);
});

test('rejects malformed domain data', () => {
  const malformed = JSON.stringify({ schemaVersion: CURRENT_SCHEMA_VERSION, data: { ...fixture, items: [{ id: 'broken' }] } });
  assert.throws(() => decodeAndMigrate(malformed), /Invalid packing items/);
});
