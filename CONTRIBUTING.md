# Contributing to Yakipaki

Start with [AGENTS.md](AGENTS.md); it is the canonical architecture and workflow guide for both humans and coding assistants.

## Local workflow

Requirements:

- Node.js 26.x (use the version pinned in `.nvmrc`)
- npm
- Android device with USB debugging and Expo Go, or an Android emulator
- JDK 17 and Android SDK Platform 37 when compiling native Android binaries locally

```powershell
npm install
npm run check
npm run android
```

For a bundle-level Android verification without a device:

```powershell
npm run bundle:android
```

Keep changes focused. Update both translations for visible copy, preserve the persisted schema, and include the validation commands you ran in the handoff or pull-request description.

## Commit guidance

Use short imperative commit subjects, for example `Add phase date validation`. Keep dependency updates separate from feature changes when practical. Do not commit generated output or device-specific configuration.
