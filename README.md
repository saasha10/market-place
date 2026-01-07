# MarketPlace (Expo + TypeScript)

A fresh Expo React Native app scaffolded with the Blank TypeScript template.

## Requirements

## Setup

```bash
npm install
```

## Run

```bash
npm run android
```

```bash
npm run ios
```

```bash
npm run web
```

## Project Structure

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

```bash
git add -A
git commit -m "Initialize Expo + TypeScript app"
git push origin <branch>
```

This repository is ready to be pushed. Let me know if you want routing (Expo Router), Firebase/Stripe integration, or EAS configured next.

Proyecto Expo React Native con TypeScript, ESLint (Flat Config) y Prettier configurados profesionalmente. Incluye aliases, estructura escalable y scripts DX.

## Requisitos

- Node.js 18+ (LTS recomendado)
- npm 9+ (o pnpm/yarn classic; aquí usamos npm)
- macOS: Xcode para iOS; Android Studio (SDK/AVD) para Android

## Instalación

```bash
npm install
cp .env.example .env # y rellena credenciales Firebase
```

## Ejecutar

- Android (emulador o dispositivo):

```bash
npm run android
```

- iOS (requiere Xcode/Simulator):

```bash
npm run ios
```

- Web:

```bash
npm run web
```

## Estructura de proyecto

```
src/
  components/
  screens/
  hooks/
  services/
  utils/
  constants/
  types/
```

- `App.tsx`: componente de entrada
- `app.json`: configuración de Expo
- `tsconfig.json`: configuración TS (extiende base Expo, JSX habilitado, aliases)
- `metro.config.js`: aliases de runtime para Metro
- `eslint.config.js`: ESLint Flat Config basado en `eslint-config-expo`
- `.prettierrc`: reglas de formateo
- `.editorconfig`: convenciones de editor

## TypeScript

- `strict: true` y JSX para React Native
- Aliases configurados (TS + Metro):
  - `@/*` → `src/*`
  - `@/components/*`, `@/screens/*`, `@/hooks/*`, `@/services/*`, `@/utils/*`, `@/types/*`

## ESLint

- Base: `eslint-config-expo/flat` (React, React Native, Hooks, TS)
- Integración Prettier: `eslint-plugin-prettier/recommended` + `eslint-config-prettier`
- Reglas añadidas:
  - `@typescript-eslint/no-unused-vars` (ignora `_`)
  - `unused-imports/no-unused-imports`
  - `simple-import-sort/imports`, `simple-import-sort/exports`
  - `import/first`, `import/newline-after-import`, `import/no-duplicates`
- Ignorados: `.expo`, `node_modules`, `android`, `ios`, `dist`, `build`, `coverage`

## Prettier

- Estilo consistente (anchura 100, comillas simples, `trailingComma: all`, `semi: true`)
- Formatea JS, TS, TSX, JSON y Markdown

## Scripts disponibles

```bash
npm run lint       # Linter
npm run lint:fix   # Linter con autofix
npm run format     # Formateo Prettier
npm run typecheck  # TypeScript sin emitir
```

## Verificación

```bash
npm run lint
npm run typecheck
npm run format
```

Para arrancar la app en Expo:

```bash
npx expo start
```

### Variables de entorno (Firebase)
Expo inyecta variables `EXPO_PUBLIC_` en tiempo de build:
```
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```
Crea y completa `.env` (o usa `.env.local`) y reinicia Metro.
## Solución de problemas

- Android: abre Android Studio, instala SDKs, crea/arranca un AVD
- iOS: abre Xcode una vez para aceptar licencias e instalar componentes
- Salud del proyecto:

```bash
npx expo-doctor
```

## Prebuild (opcional)

Si necesitas `android/` y `ios/` nativos (por módulos nativos), ejecuta:

```bash
npx expo prebuild
```

Continúa con flujo Expo o EAS Build según convenga.

---

Listo para push/CI. Dime si quieres añadir Expo Router, Firebase/Stripe o EAS.
