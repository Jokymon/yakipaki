# Local data compatibility

Tester data is a compatibility contract. Once an APK has been distributed, every later release must either continue reading its stored schema or migrate it forward without losing information.

## Stable identities

Do not change these after the first tester build:

- Android application ID: `ch.yakipaki.app`
- Storage key: `yakipaki.data`
- Android signing key managed by EAS

Changing the application ID creates a separate Android app and therefore a separate data directory. Changing the signing key prevents Android from installing the APK as an update.

## Stored document

`src/data/schema.ts` owns the persisted format. Data is stored as a versioned envelope:

```json
{
  "schemaVersion": 1,
  "data": {
    "language": "de",
    "items": [],
    "categories": [],
    "phases": [],
    "collections": []
  }
}
```

The permanent storage key does not contain a version number. This lets every future release find the document and apply all required migrations.

## Changing persisted data

For an additive optional field with a safe default, the existing schema may remain compatible if validation accepts both old and new values. For any incompatible or required change:

1. Define the new domain shape.
2. Add a pure `migrateVnToVNext` function in `src/data/schema.ts`.
3. Register it in `migrations` under its source version.
4. Increment `CURRENT_SCHEMA_VERSION` by exactly one.
5. Add fixtures for the previous schema to `tests/schema.test.mts` and assert the complete migrated value.
6. Run `npm run test`, `npm run typecheck`, and `npm run bundle:android`.
7. Test an APK update over a device containing realistic data from the previous APK. Never validate migrations only with a fresh install.

Migrations must be deterministic and preserve IDs and relationships. Never catch a migration or validation failure by clearing storage or writing seed data. Yakipaki instead disables persistence and shows a warning so the original document remains available for a fixed release.

## Release discipline

- Fix migration failures forward; do not downgrade the schema or reuse a newer schema version for a different shape.
- Never remove an old migration after users may have that source version installed.
- Keep migration functions pure and free of UI, storage, network, date, or locale dependencies.
- Treat removal or reinterpretation of user-entered values as a product decision requiring explicit approval.
