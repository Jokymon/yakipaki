import assert from 'node:assert/strict';
import test from 'node:test';
import { CURRENT_SCHEMA_VERSION, decodeAndMigrate, encodeAppData } from '../src/data/schema.ts';
import type { AppData } from '../src/domain/types.ts';

const fixture: AppData = {
  language: 'de',
  items: [{ id: 'item', name: 'Jacke', quantity: 1, packed: false, owned: true, categoryId: 'clothes', phaseIds: ['phase'], notes: '' }],
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

test('migrates schema 1 category arrays to one deterministic category', () => {
  const v1 = {
    ...fixture,
    items: [
      { id: 'many', name: 'Jacke', quantity: 1, packed: false, owned: true, categoryIds: ['clothes', 'outdoors'], phaseIds: [], notes: '' },
      { id: 'none', name: 'Pass', quantity: 1, packed: false, owned: true, categoryIds: [], phaseIds: [], notes: '' }
    ]
  };
  const migrated = decodeAndMigrate(JSON.stringify({ schemaVersion: 1, data: v1 }));
  assert.equal(migrated.items[0]?.categoryId, 'clothes');
  assert.equal(migrated.items[1]?.categoryId, undefined);
  assert.equal('categoryIds' in (migrated.items[0] ?? {}), false);
});

test('rejects data from a newer schema instead of overwriting it', () => {
  const newer = JSON.stringify({ schemaVersion: CURRENT_SCHEMA_VERSION + 1, data: fixture });
  assert.throws(() => decodeAndMigrate(newer), /newer Yakipaki version/);
});

test('rejects malformed domain data', () => {
  const malformed = JSON.stringify({ schemaVersion: CURRENT_SCHEMA_VERSION, data: { ...fixture, items: [{ id: 'broken' }] } });
  assert.throws(() => decodeAndMigrate(malformed), /Invalid packing items/);
});

test('rejects obsolete multi-category fields in schema 2 data', () => {
  const obsolete = JSON.stringify({ schemaVersion: CURRENT_SCHEMA_VERSION, data: { ...fixture, items: [{ ...fixture.items[0], categoryIds: ['outdoors'] }] } });
  assert.throws(() => decodeAndMigrate(obsolete), /Invalid packing items/);
});
