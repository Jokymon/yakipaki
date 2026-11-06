# Pakipaki

Android-first packing-list MVP built with Expo, React Native, TypeScript, and local SQLite storage.

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
adb install -r "C:\path\to\pakipaki.apk"
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

## Included in the MVP

- Create, edit, delete, pack, and persist packing items locally
- Mark items as owned and use the generated shopping list
- Separate category and travel planning screens for user-managed categories, travel phases, and travel groups; phases support either a date range or a duration in days
- Category, phase, group, short-use, and single-phase filters
- German and English UI, switched from the Categories screen
- Automatic light and dark themes following the device setting
- Seed itinerary and items so the first launch is immediately playable

Data is stored only on the device through `expo-sqlite/kv-store`. The current schema is intentionally versioned so it can later migrate to relational SQLite tables without changing the screens.
