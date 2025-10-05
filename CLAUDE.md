## Architecture

<!-- - **Website:** Expo Router website with Tailwind. -->
- **Native app:** Expo Router app with CNG.
<!-- - **Backend:** Expo API routes WinterTC-compliant. Routes are in `src/app/api/` directory. API routes use `+api.ts` suffix (`chat+api.ts`). -->
- **Secrets:** Use .env files and API routes for secret management. Never use `EXPO_PUBLIC_` prefix for sensitive data.

## Code Style

- Use TypeScript whenever possible. Avoid non-null assertion operator (`!`).
- Use kebab-case for route file names. Avoid capital letters. Use camelCase for everything else.
- Use `@/` path aliases for imports.
- Use root src directory.
- This app uses React Compiler and does not need `useCallback`, `useMemo`, or `React.memo` for performance optimizations. Avoid using these hooks and components unless absolutely necessary.

### Best Practices

- Follow patterns from
  - <https://github.com/ryanmcdermott/clean-code-javascript>
  - <https://github.com/kettanaito/naming-cheatsheet>
  - <https://github.com/alan2207/bulletproof-react>

## CLI

- Install packages: npx expo install
- Ensure the rules of React are enforced: npx expo lint
- Create native modules: npx create-expo-module --local
- Deploy iOS: npx testflight
- Deploy Android: eas build -p android -s
- Deploy web and server: npx expo export -p web && eas deploy
