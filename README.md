# Yakipaki

Android-first packing-list MVP built with Expo, React Native, TypeScript, and local SQLite storage.

Current preview release: **0.2.1** (`preview-0.2.1`). See [`CHANGELOG.md`](CHANGELOG.md) for release notes.

The launcher icon is stored at [`assets/app-icon.png`](assets/app-icon.png) and configured through `app.json` for standard and Android adaptive icons.

## Run it

```powershell
npm install
npm run android
```

With an Android device, enable USB debugging and accept the debugging prompt. Alternatively, start an Android emulator before running the command. You can also run `npm start` and scan the QR code with Expo Go.

## Build an installable Android APK

### Recommended: signed APK with EAS Build

This route builds in Expo's build environment, so it does not require a local JDK or complete Android SDK. It requires an Expo account and internet access.

```powershell
npx eas-cli@latest login
npx eas-cli@latest build --platform android --profile preview
```

The `preview` profile in [`eas.json`](eas.json) explicitly produces an APK. When the build finishes, download the APK from the URL printed by EAS, connect an authorized Android device, and install it:

```powershell
adb devices
adb install -r "C:\path\to\yakipaki.apk"
```

The `-r` option replaces an existing installation while retaining its application data. If `adb devices` reports `unauthorized`, unlock the phone and accept its USB-debugging prompt.

### Local debug APK on Windows

Local builds require:

- JDK 17, selected through `JAVA_HOME`;
- `ANDROID_HOME` pointing to the Android SDK;
- Android SDK Platform 37 and a compatible build-tools version;
- an authorized device only if the APK should be installed immediately.

In PowerShell, select JDK 17 for the current terminal, generate the ignored native Android project, and run Gradle:

```powershell
$env:JAVA_HOME = "C:\path\to\jdk-17"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
$env:ANDROID_HOME = "C:\path\to\AndroidSdk"

npm install
npx expo prebuild --platform android
Set-Location android
.\gradlew.bat :app:assembleDebug
Set-Location ..
```

The resulting file is:

```text
android\app\build\outputs\apk\debug\app-debug.apk
```

Install it with:

```powershell
adb install -r ".\android\app\build\outputs\apk\debug\app-debug.apk"
```

The local debug APK is intended for development and testing. For Google Play, use the `production` EAS profile to create the default signed Android App Bundle (`.aab`):

```powershell
npx eas-cli@latest build --platform android --profile production
```

See Expo's documentation for [installable APK builds](https://docs.expo.dev/build-reference/apk/) and [signed local release builds](https://docs.expo.dev/guides/local-app-production/) when configuring production signing or store submission.

### Updating tester installations without losing data

Distribute tester APKs using the EAS `preview` profile consistently:

```powershell
npx eas-cli@latest build --platform android --profile preview
```

The configuration uses EAS-managed remote version codes and increments them for every preview build. Android will retain the app's local data when testers install the newer APK over the previous version, provided that all of the following remain true:

- the Android package stays `ch.yakipaki.app`;
- builds use the same EAS-managed signing key;
- the new build has a higher Android version code;
- persisted-data changes remain compatible or include a schema migration.

Do not alternate between locally signed APKs and EAS-signed APKs for the same tester installation. Keep a secure backup of the EAS Android credentials using `eas credentials`; never commit downloaded credentials or keystores.

Yakipaki stores a versioned document under the permanent local key `yakipaki.data`. The current schema version is tested automatically. See [`doc/data-migrations.md`](doc/data-migrations.md) before changing domain or persistence types.

### GitHub Actions preview APK

The [`Build preview APK`](.github/workflows/preview-apk.yml) workflow validates the project, creates a signed EAS preview build, downloads the APK, and attaches it to the GitHub Actions run for 30 days. It runs:

- manually through **Actions → Build preview APK → Run workflow**; or
- when pushing a tag whose name starts with `preview-`, for example `preview-0.2.1`.

Complete this one-time setup before the first CI build:

1. Link the repository to an Expo project and commit the resulting `extra.eas.projectId` in `app.json`:

   ```powershell
   npx eas-cli@latest login
   npx eas-cli@latest init
   ```

2. Run one interactive preview build locally. This lets EAS create or confirm the Android signing credentials required by later non-interactive builds:

   ```powershell
   npx eas-cli@latest build --platform android --profile preview
   ```

3. Create an Expo access token and add it to the GitHub repository under **Settings → Secrets and variables → Actions** as a repository secret named `EXPO_TOKEN`. Never commit the token.

After a successful run, download `yakipaki-preview-<run number>` from the run's **Artifacts** section. The archive contains `yakipaki-preview.apk` and EAS build metadata. Every CI build uses the same package ID, EAS signing credentials, and auto-incremented version code so it can update earlier EAS preview installations without clearing their local data.

Commit the prepared release state, then create and push the preview 0.2.1 tag with:

```powershell
git commit -m "Prepare Yakipaki preview 0.2.1"
git tag -a preview-0.2.1 -m "Yakipaki preview 0.2.1"
git push origin HEAD preview-0.2.1
```

## Included in the MVP

- Create, edit, delete, pack, and persist packing items locally
- Mark items as owned and use the generated shopping list
- Separate category and travel planning screens for user-managed categories, travel phases, and travel groups; phases support either a date range or a duration in days
- Balanced category color presets with an extended palette and exact custom hex colors
- Collapsible category groups plus phase, travel-group, short-use, and single-phase filters
- German and English UI, switched from the Categories screen
- Automatic light and dark themes following the device setting
- Safe-area-aware bottom navigation that remains above Android system controls
- Seed itinerary and items so the first launch is immediately playable

Data is stored only on the device through `expo-sqlite/kv-store`. The current schema is intentionally versioned so it can later migrate to relational SQLite tables without changing the screens.
