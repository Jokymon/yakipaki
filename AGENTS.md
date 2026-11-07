# Yakipaki agent guide

This file is the authoritative project guide for coding agents. Tool-specific instruction files should point here instead of duplicating these rules.

## Product scope

Yakipaki is an Android-first, offline packing-list app. The MVP supports:

- one locally stored packing list per app installation;
- item creation, editing, deletion, quantities, notes, packed state, and owned state;
- user-managed categories, with many categories per item;
- dated travel phases, optional travel-group membership, and many phases per item;
- filters for categories, phases, travel groups, usage under five days, and single-phase items;
- a shopping view for items that are not yet owned;
- German and English UI, with German as the initial language.

Do not introduce accounts, cloud synchronization, analytics, advertising, or network-dependent product behavior unless the user explicitly expands the scope.

## Technology baseline

- Expo SDK 58, React Native 0.88, and React 19.
- TypeScript in strict mode; do not weaken compiler settings to hide errors.
- `expo-sqlite/kv-store` for on-device persistence. The permanent key `yakipaki.data` contains a versioned envelope managed by `src/data/schema.ts`.
- Plain React context and hooks for current state management.
- React Native `StyleSheet`, `ThemeProvider`, and the paired palettes in `src/theme.ts` for presentation. The app follows the device color scheme; UI code must use `useTheme()` rather than importing a fixed palette.
- No navigation framework in the MVP; `App.tsx` owns the four-tab shell for packing, shopping, categories, and travel.
- Minimum supported Node.js version: 22.13.

Use Expo-compatible package versions. Add native dependencies with `npx expo install <package>`, then run Expo Doctor. Avoid adding a library when a small, maintainable implementation using the current stack is sufficient.

## Repository map

```text
App.tsx                         Application shell and bottom navigation
src/components/                Reusable UI components and editors
src/data/                      Persistence context and first-run seed data
src/domain/                    Domain types and pure business rules
src/i18n/                      Typed German/English translations
src/screens/                   Screen-level UI
src/ThemeContext.tsx           Live system light/dark appearance selection
src/theme.ts                   Shared colors and visual tokens
doc/concepts.md                Original product concept
```

Keep business rules in `src/domain`, persistence mutations in `src/data`, and screen rendering in `src/screens`. Components should not read or write storage directly.

## Domain and persistence conventions

- Treat `AppData`, `PackingItem`, `Category`, `TravelPhase`, and `TravelCollection` as domain contracts.
- IDs are opaque strings. Never derive identity from a user-visible name.
- A travel phase uses either a local `YYYY-MM-DD` start/end date range or a positive integer `durationDays`, never both. A date range includes both its start and end day.
- Deleting a category or phase must remove its ID from every affected item.
- Deleting a travel group must preserve its phases and only clear their `collectionId`.
- Persist immutable state updates; do not mutate arrays or domain objects in place.
- Any incompatible persisted-data change requires incrementing `CURRENT_SCHEMA_VERSION`, an explicit sequential migration, and a previous-version fixture in `tests/schema.test.mts`. Never change the permanent storage key or silently discard existing user data.
- All product data stays local. Do not log item names, notes, itinerary details, or stored JSON.

The current `kv-store` document is appropriate for the MVP. Move to relational SQLite tables only when query volume or migrations justify it, and preserve a migration path from every released schema. See `doc/data-migrations.md`.

## UI and localization conventions

- Design for a narrow Android portrait screen first, while retaining normal React Native portability.
- Keep controls touch-friendly and provide accessibility roles/state for interactive semantic controls.
- Use shared colors from `src/theme.ts`; category colors may come from `categoryColors`.
- Every user-visible reusable string belongs in both language maps in `src/i18n/translations.ts`.
- Translation keys are semantic and typed. Do not put translated strings into domain logic or use them as IDs.
- German copy should be natural German, not a literal word-for-word translation.
- Empty states, destructive actions, invalid dates, and disabled actions must be visible and understandable.

## Working agreement

Before editing:

1. Read this file and the files directly involved in the change.
2. Preserve user changes and avoid broad mechanical rewrites.
3. Check whether a change affects persisted data or both translations.

While editing:

1. Prefer small, typed functions and immutable updates.
2. Keep the dependency set small and Expo-compatible.
3. Avoid platform-specific native code unless the requirement cannot be met through Expo.
4. Do not commit generated `dist`, `.expo`, `android`, `ios`, or `node_modules` content.

Before handing off:

1. Run `npm run test`.
2. Run `npm run typecheck`.
3. Run `npm run doctor` when dependencies or Expo configuration changed. It requires internet access.
4. Run `npm run bundle:android` for application or build-configuration changes.
5. When a device is available, run `npm run android` and exercise the changed flow in Expo Go.
6. For persistence changes, install the new APK over a populated previous APK and verify the migrated values.
7. Report which checks ran and any check that could not run.

Do not use `npm audit fix --force` or perform broad dependency upgrades as an incidental fix. Review security findings in the context of Expo's required dependency versions.

## Definition of done

A change is complete when it is typed, localized where applicable, preserves local data semantics, handles empty/error states, passes proportionate checks, and updates documentation when it changes product behavior or developer workflow.

## MVP boundaries and likely next steps

Good incremental additions include unit tests for `src/domain/packing.ts`, accessible labels, schema migrations, import/export, and a proper native date picker. Cloud services, authentication, social features, and multi-list support require an explicit product decision before implementation.
