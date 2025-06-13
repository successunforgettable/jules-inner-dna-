## Client-Side Configuration Files

This document contains the content of key configuration files for the `packages/client/` application.

---
**File Path:** `packages/client/index.html`
---
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <!-- Link to a generic icon or a specific favicon if you have one -->
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Personality Mosaic</title>
    <!-- GDS Font: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---
**File Path:** `packages/client/package.json`
---
```json
{
  "name": "client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,json,md}\" --config ../../.prettierrc.json"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.15.0",
    "zustand": "^4.4.1",
    "framer-motion": "^10.16.0",
    "axios": "^1.5.0",
    "clsx": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@types/react-router-dom": "^5.3.3",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.3",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5",
    "vitest": "^0.34.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.2",
    "jsdom": "^22.1.0"
  }
}
```

---
**File Path:** `packages/client/vite.config.ts`
---
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // For potential alias setup

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Or 5173 if preferred
  },
  resolve: { // Example: if using aliases for cleaner imports
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@store': path.resolve(__dirname, './src/contexts/store'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@services': path.resolve(__dirname, './src/services'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@customTypes': path.resolve(__dirname, './src/types'), // If client-specific types exist
      // Ensure shared types are accessible, e.g., if symlinked or part of TS paths
      // '@sharedTypes': path.resolve(__dirname, '../../shared/types'),
    },
  },
  test: { // Vitest configuration
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
    css: true, // Important for CSS Modules and global CSS in tests
    coverage: { // Example coverage configuration
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage'
    }
  },
});
```

---
**File Path:** `packages/client/src/test-setup.ts`
---
```typescript
// src/test-setup.ts
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import { vi } from 'vitest';

// Mock Framer Motion for simpler tests where complex animations are not the focus
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion'); // Import actual to retain non-problematic exports
  return {
    ...actual,
    motion: {
      // Mock specific motion components by replacing them with a simple div/button
      // that passes through props. This helps avoid animation-related complexities
      // in tests not focused on the animation itself.
      div: React.forwardRef(({ children, ...props }, ref) => <div ref={ref} {...props}>{children}</div>),
      button: React.forwardRef(({ children, ...props }, ref) => <button ref={ref} {...props}>{children}</button>),
      // Add other motion components if used and problematic: span, h1, etc.
      // Example for path, if you use motion.path in SVGs:
      // path: (props) => <path {...props} />,
    },
    AnimatePresence: ({ children }) => <>{children}</>, // Simple passthrough for AnimatePresence
    // Mock specific hooks if they cause issues or need controlled return values in tests
    // useReducedMotion: () => false, // Example: always return false for tests unless overridden
  };
});

// Optional: Mock global browser APIs if needed for tests
// Example:
// global.matchMedia = global.matchMedia || function() {
//   return {
//     matches : false,
//     addListener : function() {},
//     removeListener: function() {}
//   };
// };

// Clean up after each test (Vitest does this automatically by default for RTL if using default config)
// import { cleanup } from '@testing-library/react';
// afterEach(() => {
//   cleanup();
// });

// If using MSW (Mock Service Worker) for API mocking, setup would be here:
// import { server } from './mocks/server'; // Example path
// beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());

// ForwardRef needed for some Framer motion component mocks
import React from 'react';
```

---
**File Path:** `packages/client/tsconfig.json`
---
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    // For path aliases in vite.config.ts
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@pages/*": ["src/pages/*"],
      "@store/*": ["src/contexts/store/*"],
      "@lib/*": ["src/lib/*"],
      "@assets/*": ["src/assets/*"],
      "@services/*": ["src/services/*"],
      "@styles/*": ["src/styles/*"],
      "@hooks/*": ["src/hooks/*"],
      "@customTypes/*": ["src/types/*"]
      // "@sharedTypes/*": ["../../shared/types/*"] // If shared types are used
    }
  },
  "include": ["src", "vite.config.ts", "vitest.config.ts", "src/test-setup.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---
**File Path:** `packages/client/tsconfig.node.json`
---
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts", "vitest.config.ts"]
}
```

---
**File Path:** `packages/client/.eslintrc.cjs`
---
```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended', // Added for accessibility linting
    // 'prettier' // Add this if you use eslint-config-prettier to disable ESLint rules that conflict with Prettier
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts', 'vitest.config.ts', 'coverage'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  settings: {
    react: {
      version: 'detect',
    },
    // For eslint-plugin-import if used
    // 'import/resolver': {
    //   typescript: {},
    //   node: {
    //     extensions: ['.js', '.jsx', '.ts', '.tsx'],
    //   },
    // },
  },
  plugins: [
    '@typescript-eslint',
    'react-refresh',
    'react',
    'jsx-a11y' // Added for accessibility linting
  ],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_' },
    ],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off', // Not needed with new JSX transform
    // Add any other project-specific rules
    // Example:
    // 'jsx-a11y/anchor-is-valid': [ // Example rule adjustment if using Link component extensively
    //   'warn',
    //   {
    //     components: ['Link'],
    //     specialLink: ['to'],
    //   },
    // ],
  },
};
```

---
**File Path:** `packages/client/.env.example`
---
```ini
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api

# Optional: For feature flags or other client-specific settings
# VITE_FEATURE_NEW_PROFILE_PAGE_ENABLED=true
```

This markdown contains the requested client-side configuration files.
```
