# MarketPlace (Expo + TypeScript)

A fresh Expo React Native app scaffolded with the Blank TypeScript template.

## Requirements
- Node.js 18+ (LTS recommended)
- npm 9+ (or pnpm/yarn classic; npm used here)
- macOS: Xcode for iOS runs; Android Studio (SDK/AVD) for Android runs

## Setup
```bash
npm install
```

## Run
- Android (requires an emulator or device):
```bash
npm run android
```
- iOS (requires Xcode/iOS Simulator):
```bash
npm run ios
```
- Web:
```bash
npm run web
```

## Project Structure
- `App.tsx`: App entry component
- `app.json`: Expo app config
- `tsconfig.json`: TypeScript config (extends Expo base, JSX enabled)
- `assets/`: Static assets

## TypeScript
TypeScript is configured to extend the Expo base configuration and explicitly enables JSX for React Native.

If you change configs, ensure JSX stays enabled:
```json
{
  "compilerOptions": {
    "jsx": "react-native"
  }
}
```

## Troubleshooting
- If `npm run android` fails, open Android Studio, install SDKs, and ensure an AVD is running.
- If `npm run ios` fails, open Xcode once to agree to licenses and install required components.
- Run health checks:
```bash
npx expo-doctor
```

## Prebuild (optional)
If you need native `android/` and `ios/` directories, run:
```bash
npx expo prebuild
```
Then continue using the Expo workflow or EAS Build.

## CI/CD and Releases
- Add EAS later for builds: https://docs.expo.dev/eas/
- Commit and push:
```bash
git add -A
git commit -m "Initialize Expo + TypeScript app"
git push origin <branch>
```

---

This repository is ready to be pushed. Let me know if you want routing (Expo Router), Firebase/Stripe integration, or EAS configured next.
