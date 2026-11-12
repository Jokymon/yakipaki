# Changelog

All notable changes to Yakipaki preview releases are documented here.

## 0.2.1 — 2026-11-12

### Changed

- Updated the supported development and build runtime to Node.js 26.
- Pinned Node.js 26.13.0 consistently for local version managers, GitHub Actions validation, and EAS preview and production builds.

### Fixed

- Fixed preview APK validation failing before the EAS build because Node.js 22.13 could not execute the TypeScript schema tests without an experimental flag.

## 0.2.0 — 2026-11-11

### Added

- Automatic light and dark themes following the Android system setting.
- Editing for categories, travel phases, and travel groups.
- Travel phases defined either by a date range or a duration in days.
- Collapsible category sections in packing and shopping lists.
- Extended category color palette with exact custom hex colors.
- Yak-and-backpack launcher icon.
- Safe-area-aware bottom navigation for gesture and three-button Android navigation.
- GitHub Actions workflow for signed EAS preview APKs.

### Changed

- Renamed the application to Yakipaki with Android package `ch.yakipaki.app`.
- Items now have at most one category, and categories organize list sections instead of acting as filters.
- Local data now uses a permanent key with an explicitly versioned schema envelope.

### Data migration

- Schema 1 data migrates to schema 2 without clearing user data.
- Items previously assigned to multiple categories retain their first assigned category.
- The earlier raw `yakipaki.data.v1` development format is imported into the permanent store.

## 0.1.0 — 2026-11-06

- Initial packing-list MVP with local persistence, item management, categories, travel planning, filters, shopping list, and German/English UI.
