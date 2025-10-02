## Architecture

<!-- - **Website:** Expo Router website with Tailwind. -->
- **Native app:** Expo Router app with CNG.
<!-- - **Backend:** Expo API routes WinterTC-compliant. Routes are in `src/app/api/` directory. API routes use `+api.ts` suffix (`chat+api.ts`). -->
- **Secrets:** Use .env files and API routes for secret management. Never use `EXPO_PUBLIC_` prefix for sensitive data.

## Code Style

- Use TypeScript whenever possible.
- Use kebab-case for all file names. Avoid capital letters.
- Use `@/` path aliases for imports.
- Use root src directory.
- Follow patterns from <https://github.com/ryanmcdermott/clean-code-javascript> and <https://github.com/kettanaito/naming-cheatsheet>.
- This app uses React Compiler and does not need `useCallback`, `useMemo`, or `React.memo` for performance optimizations. Avoid using these hooks and components unless absolutely necessary.

## CLI

- Install packages: npx expo install
- Ensure the rules of React are enforced: npx expo lint
- Create native modules: npx create-expo-module --local
- Deploy iOS: npx testflight
- Deploy Android: eas build -p android -s
- Deploy web and server: npx expo export -p web && eas deploy
