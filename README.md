# Pakipaki

Android-first packing-list MVP built with Expo, React Native, TypeScript, and local SQLite storage.

## Run it

```powershell
npm install
npm run android
```

With an Android device, enable USB debugging and accept the debugging prompt. Alternatively, start an Android emulator before running the command. You can also run `npm start` and scan the QR code with Expo Go.

## Included in the MVP

- Create, edit, delete, pack, and persist packing items locally
- Mark items as owned and use the generated shopping list
- User-managed categories, travel phases, and travel groups
- Category, phase, group, short-use, and single-phase filters
- German and English UI, switched from the Plan screen
- Automatic light and dark themes following the device setting
- Seed itinerary and items so the first launch is immediately playable

Data is stored only on the device through `expo-sqlite/kv-store`. The current schema is intentionally versioned so it can later migrate to relational SQLite tables without changing the screens.
