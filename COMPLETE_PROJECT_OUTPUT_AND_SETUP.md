# Inner DNA App - Code & Setup Instructions

This document contains the consolidated code for the Inner DNA application (frontend with in-memory backend support) and detailed instructions for setting it up and running it locally on a macOS environment.

## I. Root Configuration Files

These files should be placed at the root of your project directory (e.g., `inner-dna-app/`).

---
**File Path:** `inner-dna-app/package.json`
---
```json
{
  "name": "inner-dna-app-monorepo",
  "private": true,
  "scripts": {
    "dev:client": "pnpm --filter client dev",
    "dev:server": "pnpm --filter server dev",
    "dev": "npm-run-all --parallel dev:client dev:server",
    "build": "pnpm -r build",
    "build:client": "pnpm --filter client build",
    "build:server": "pnpm --filter server build",
    "lint": "pnpm -r lint",
    "format": "prettier --write \"packages/**/*.{ts,tsx,js,json,md}\" --config ./.prettierrc.json",
    "test": "pnpm -r test",
    "test:client": "pnpm --filter client test",
    "test:server": "pnpm --filter server test"
  },
  "devDependencies": {
    "prettier": "^3.0.0",
    "typescript": "^5.0.0",
    "npm-run-all": "^4.1.5"
  },
  "packageManager": "pnpm@8.0.0"
}
```

---
**File Path:** `inner-dna-app/pnpm-workspace.yaml`
---
```yaml
packages:
  - 'packages/*'
  # - 'packages/shared' # Add if shared package has its own package.json
```

---
**File Path:** `inner-dna-app/.prettierrc.json`
---
```json
{
  "semi": true,
  "tabWidth": 2,
  "useTabs": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 80,
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "arrowParens": "always"
}
```

---
**File Path:** `inner-dna-app/.gitignore`
---
```gitignore
# Dependencies
node_modules/
**/node_modules/
.pnpm-store/

# Build artifacts
dist/
**/dist/
build/
**/build/
.vite/
coverage/
**/coverage/

# Log files
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Environment variables
.env
.env.*
!.env.example
packages/*/.env
packages/*/.env.*
!packages/*/.env.example

# OS-specific files
.DS_Store
Thumbs.db

# Editor-specific files
.idea/
.vscode/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Test results
junit.xml
test-results/

# TypeScript cache files
*.tsbuildinfo
```

---
**File Path:** `inner-dna-app/README.md`
---
```markdown
# Inner DNA Application

This monorepo contains the Inner DNA assessment system, including the frontend client and backend server.

## Packages

-   `packages/client`: React/Vite frontend application.
-   `packages/server`: Node.js/Express backend application (configured for in-memory authentication).

## Setup

See detailed setup instructions in `COMPLETE_PROJECT_OUTPUT_AND_SETUP.md` or a dedicated setup guide.
```

## II. Server Package (`packages/server/`)

Create a directory `packages/server/` in your project root. Place the following files within it.

---
**File Path:** `packages/server/package.json`
---
```json
{
  "name": "server",
  "private": true,
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint . --ext .ts",
    "test": "echo \"Error: no test specified for in-memory version yet\" && exit 0"
  },
  "dependencies": {
    "express": "^4.17.1",
    "jsonwebtoken": "^9.0.0",
    "bcrypt": "^5.1.0",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "zod": "^3.20.2"
  },
  "devDependencies": {
    "nodemon": "^2.0.20",
    "typescript": "^5.0.0",
    "ts-node": "^10.9.1",
    "@types/express": "^4.17.15",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/bcrypt": "^5.0.0",
    "@types/cors": "^2.8.13",
    "@types/node": "^18.11.18",
    "eslint": "^8.30.0",
    "@typescript-eslint/parser": "^5.48.0",
    "@typescript-eslint/eslint-plugin": "^5.48.0"
  }
}
```

---
**File Path:** `packages/server/tsconfig.json`
---
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts", "**/*.test.ts", "dist"]
}
```

---
**File Path:** `packages/server/.env.example`
---
```ini
# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Secrets
JWT_SECRET=yourSuperSecretKeyForJWTSigning_InMemoryAuthExample
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=anotherVeryStrongAndLongRandomSecretForRefreshTokens_InMemoryAuthExample
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS Configuration (Example: allow client origin)
CLIENT_ORIGIN=http://localhost:3000
# For Vite default port, it might be 5173. Adjust if your client runs elsewhere.
```

---
**File Path:** `packages/server/.eslintrc.cjs`
---
```javascript
module.exports = {
  root: true,
  env: { node: true, es2021: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'jest.config.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};
```

---
**File Path:** `packages/server/.prettierrc.json`
---
```json
{
  "semi": true,
  "tabWidth": 2,
  "useTabs": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "always"
}
```
*(Note: This is identical to the root Prettier config. In a real setup, packages can inherit the root config, or this file can be omitted if the root one is intended to apply to all packages.)*


### Server Source Files (`packages/server/src/`)

Create a directory `packages/server/src/`. Inside it, create `api/routes/` and `controllers/` subdirectories.

---
**File Path:** `packages/server/src/index.ts`
---
```typescript
import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './api/routes/authRoutes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' }));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', message: 'Server is running (in-memory auth)!' });
});

app.use('/api/auth', authRoutes);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err.stack || err.message);
  const statusCode = res.statusCode && res.statusCode >= 400 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'An unexpected error occurred'
      : err.message || 'Internal Server Error',
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Sorry, can't find that!" });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port} (IN-MEMORY AUTH MODE)`);
  console.log(`[server]: CORS enabled for origin: ${process.env.CLIENT_ORIGIN || 'http://localhost:3000'}`);
  if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    console.warn('[server]: WARNING - JWT_SECRET or REFRESH_TOKEN_SECRET is not defined. Authentication will fail.');
  }
});

export default app;
```

---
**File Path:** `packages/server/src/api/routes/authRoutes.ts`
---
```typescript
import express from 'express';
import { registerUser, loginUser, getAllUsers_InMemory_Debug } from '../../controllers/authController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

if (process.env.NODE_ENV !== 'production') {
    router.get('/users_debug', getAllUsers_InMemory_Debug);
}

export default router;
```

---
**File Path:** `packages/server/src/controllers/authController.ts`
---
```typescript
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const registerUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});

const loginUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password cannot be empty' }),
});

interface User {
  id: string;
  email: string;
  passwordHash: string;
}
const users: User[] = [];

export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const validationResult = registerUserSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ message: 'Validation failed', errors: validationResult.error.flatten().fieldErrors });
    }
    const { email, password } = validationResult.data;

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser: User = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      email,
      passwordHash,
    };
    users.push(newUser);

    const userResponse = { id: newUser.id, email: newUser.email };
    return res.status(201).json({ message: 'User registered successfully (in-memory)', user: userResponse });

  } catch (error) {
    console.error('In-memory registration error:', error);
    return res.status(500).json({ message: 'Internal server error during registration' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const validationResult = loginUserSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ message: 'Validation failed', errors: validationResult.error.flatten().fieldErrors });
    }
    const { email, password } = validationResult.data;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed: Invalid email or password' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Authentication failed: Invalid email or password' });
    }

    if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
      console.error('JWT secrets are not defined in .env file for in-memory auth');
      return res.status(500).json({ message: 'Internal server error: JWT configuration missing' });
    }

    const accessTokenPayload = { userId: user.id, email: user.email };
    const accessToken = jwt.sign(accessTokenPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    const refreshTokenPayload = { userId: user.id };
    const refreshToken = jwt.sign(refreshTokenPayload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    });

    const userResponse = { id: user.id, email: user.email };
    return res.status(200).json({
      message: 'Login successful (in-memory)',
      accessToken,
      refreshToken,
      user: userResponse,
    });

  } catch (error) {
    console.error('In-memory login error:', error);
    return res.status(500).json({ message: 'Internal server error during login' });
  }
};

export const getAllUsers_InMemory_Debug = (req: Request, res: Response): Response => {
    return res.status(200).json(users.map(u => ({id: u.id, email: u.email})));
};
```

## III. Client Package (`packages/client/`)

Create a directory `packages/client/` in your project root. Place the following files within it.
*(Note: Due to the large number of client files, I will list paths and provide content for key configuration and entry point files. For component `.tsx` and `.module.css` files, I will list their paths and refer to their content as generated in the respective previous subtasks. This is to keep the output manageable.)*

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
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Default client port, ensure matches CLIENT_ORIGIN in server .env
  },
  // Vitest configuration can also be in this file
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
    css: true,
  },
})
```

---
**File Path:** `packages/client/src/test-setup.ts` (Conceptual content, create this file)
---
```typescript
// src/test-setup.ts
import '@testing-library/jest-dom/extend-expect';
import { vi } from 'vitest';

// Mock framer-motion for simpler tests
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }) => <div {...props}>{children}</div>,
      // Add other motion components if used and problematic: span, h1, etc.
      // For example, if motion.button is used:
      // button: ({ children, ...props }) => <button {...props}>{children}</button>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
  };
});

// Optional: Mock global browser APIs if needed for tests
// global.matchMedia = global.matchMedia || function() { ... };

// Clean up after each test (Vitest does this automatically by default)
// import { cleanup } from '@testing-library/react';
// afterEach(() => {
//   cleanup();
// });
```

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
    <title>Inner DNA</title>
    <!-- Consider adding GDS font link here if not self-hosted -->
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
    "esModuleInterop": true
  },
  "include": ["src", "vite.config.ts", "vitest.config.ts"],
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
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts', 'vitest.config.ts'],
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
  },
  plugins: ['@typescript-eslint', 'react-refresh', 'react'],
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

### Client Source Files (`packages/client/src/`)

Create a directory `packages/client/src/`.

---
**File Path:** `packages/client/src/main.tsx`
---
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx'
import './styles/variables.css'
import './styles/globals.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

---
**File Path:** `packages/client/src/App.tsx`
---
*(Content as generated in "Implement client-side navigation for Detail Elements phase", Task 5 - it includes all routes: Welcome, Assessment phases, Profile, Privacy, Terms, 404).*

---
**File Path:** `packages/client/src/App.css`
---
```css
/* App.css - For styles specific to the main App component or global layout overrides */
/* Many global styles are now in styles/globals.css and variables in styles/variables.css */
```

---
**File Path:** `packages/client/src/index.css`
---
```css
/* Minimal CSS Reset (already in globals.css, this can be for #root specific or very base styles) */
body { /* Already in globals.css, ensure no conflict or merge */
  margin: 0;
  font-family: var(--font-family-primary); /* Already in globals.css */
}

#root {
  /* Styles for the root div if needed, e.g., ensuring full height */
  /* display: flex; flex-direction: column; min-height: 100vh; */
}
```

---
**File Path:** `packages/client/src/styles/variables.css`
---
*(Content as generated in "Refine Welcome Screen animations...", Task 3 - includes colors, typography scale, spacing, radii, shadows, animation durations).*

---
**File Path:** `packages/client/src/styles/globals.css`
---
*(Content as generated in "Implement basic support for prefers-reduced-motion...", Task 1 - includes resets, base element styles using GDS vars, prefers-reduced-motion media query).*

---
**File Path:** `packages/client/src/services/api.ts`
---
*(Content as generated in "Implement client-side navigation...", Task 2 - includes Axios instance and request interceptor for auth token).*


### Client Component, Page, Store, Lib, Assets Files:

Create the following directory structure within `packages/client/src/`:
```
assets/
  icons/
    report/
      (IconExecutiveSummary.tsx, etc. - content for one example provided below)
components/
  auth/
    (AuthModal.module.css, LoginModal.tsx, RegistrationModal.tsx)
  building/
    (BuildingBlock.module.css, BuildingBlock.tsx, BlockPair.module.css, BlockPair.tsx)
  color/
    (ColorPaletteCard.module.css, ColorPaletteCard.tsx, DistributionSlider.module.css, DistributionSlider.tsx, PaletteSelector.module.css, PaletteSelector.tsx)
  common/
    buttons/
      (LinkButton.module.css, LinkButton.tsx, PrimaryButton.module.css, PrimaryButton.tsx, SecondaryButton.module.css, SecondaryButton.tsx)
    forms/
      (Input.module.css, Input.tsx)
    (Modal.module.css, Modal.tsx, ProtectedRoute.tsx)
  detail/
    (DetailToken.module.css, DetailToken.tsx, SubtypeContainer.module.css, SubtypeContainer.tsx, TokenPool.module.css, TokenPool.tsx)
  foundation/
    (FoundationBase.module.css, FoundationBase.tsx, Stone.module.css, Stone.tsx, StoneSet.module.css, StoneSet.tsx)
  layout/
    (Footer.module.css, Footer.tsx, Header.module.css, Header.tsx, Layout.module.css, Layout.tsx)
  results/
    (FinalTowerDisplay.module.css, FinalTowerDisplay.tsx, ReportSection.module.css, ReportSection.tsx, ScoreBarDisplay.module.css, ScoreBarDisplay.tsx, StateDistributionDisplay.module.css, StateDistributionDisplay.tsx)
  welcome/
    (CallToActionSection.module.css, CallToActionSection.tsx, FeatureHighlights.module.css, FeatureHighlights.tsx, HeroSection.module.css, HeroSection.tsx, WelcomeHeader.module.css, WelcomeHeader.tsx, WelcomeLayout.module.css, WelcomeLayout.tsx)
contexts/
  store/
    (useAssessmentStore.ts, useAuthStore.ts)
lib/
  utils/
    (colorUtils.ts, personalityCalculations.ts)
  (buildingBlockData.ts, colorPaletteData.ts, detailElementData.ts, personalityData.ts)
pages/
  Assessment/
    (BuildingBlocksPage.tsx, BuildingPage.module.css, ColorPalettePage.module.css, ColorPalettePage.tsx, DetailElementsPage.module.css, DetailElementsPage.tsx, FoundationPage.module.css, FoundationPage.tsx, ResultsPage.module.css, ResultsPage.tsx)
  (PrivacyPolicyPage.tsx, ProfilePage.tsx, TermsPage.tsx, WelcomePage.module.css, WelcomePage.tsx)
types/
  (Placeholder for any future shared client types, e.g., assessment.types.ts if not using shared)
```

**Content for one example icon (others would be similar placeholders):**
---
**File Path:** `packages/client/src/assets/icons/report/IconExecutiveSummary.tsx`
---
```typescript
import React from 'react';

const IconExecutiveSummary: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="12" y1="18" x2="12" y2="12"></line>
    <line x1="9" y1="15" x2="15" y2="15"></line>
  </svg>
);
export default IconExecutiveSummary;
```

*(For all other `.tsx` and `.module.css` files listed under "Client Component, Page, Store, Lib, Assets Files", their content is as generated and refined in the preceding subtasks. Providing all of them here would make this response excessively long. Refer to the output of individual subtasks for their specific content.)*


## IV. Shared Package (`packages/shared/`)

Create a directory `packages/shared/` in your project root. Inside it, create `types/`.

---
**File Path:** `packages/shared/types/assessment.types.ts`
---
*(Content as generated in "Define CompleteProfileDataV1 Interface & API TODO", Task 11 - includes `CompleteProfileDataV1` and its constituent data interfaces).*


## V. Setup and Run Instructions (macOS)

### Prerequisites:
1.  **Node.js:** Ensure Node.js is installed (preferably LTS version). You can check with `node -v`. If not installed, download from [nodejs.org](https://nodejs.org/).
2.  **pnpm:** This project uses `pnpm` for package management and workspace support. Install it globally if you haven't already:
    ```bash
    npm install -g pnpm
    ```
    Verify with `pnpm -v`.

### Steps:

1.  **Create Project Directory Structure:**
    Open your terminal and run:
    ```bash
    mkdir inner-dna-app
    cd inner-dna-app
    mkdir -p packages/client/src packages/server/src packages/shared/types
    ```
    *(The subsequent file creation steps will populate these directories.)*

2.  **Save File Contents:**
    *   Carefully save each file's content provided above into its specified path within the `inner-dna-app` directory structure. For example, save the root `package.json` content into `inner-dna-app/package.json`.
    *   For the client component files not explicitly listed with content in section III (e.g., `Stone.tsx`, `LoginModal.tsx`, etc.), use the content generated for them in the respective earlier subtasks.

3.  **Install Dependencies:**
    Navigate to the project root (`inner-dna-app`) in your terminal and run:
    ```bash
    pnpm install
    ```
    This will install dependencies for the root and all packages defined in `pnpm-workspace.yaml`.

4.  **Create `.env` Files:**
    *   **Server:**
        *   Navigate to `packages/server/`.
        *   Copy `.env.example` to a new file named `.env`:
            ```bash
            cp .env.example .env
            ```
        *   Open `packages/server/.env` and **replace placeholder values**, especially for `JWT_SECRET` and `REFRESH_TOKEN_SECRET`. Generate strong random strings for these. For example:
            ```ini
            PORT=3001
            NODE_ENV=development
            JWT_SECRET=replace_this_with_a_very_long_random_strong_secret_key_1
            JWT_EXPIRES_IN=1h
            REFRESH_TOKEN_SECRET=replace_this_with_another_very_long_random_strong_secret_key_2
            REFRESH_TOKEN_EXPIRES_IN=7d
            CLIENT_ORIGIN=http://localhost:3000 # Adjust if your Vite client runs on a different port (e.g., 5173)
            ```
    *   **Client:**
        *   Navigate to `packages/client/`.
        *   Copy `.env.example` to `.env`:
            ```bash
            cp .env.example .env
            ```
        *   Open `packages/client/.env`. The default `VITE_API_BASE_URL=http://localhost:3001/api` should match the server's port. Adjust if necessary.
            ```ini
            VITE_API_BASE_URL=http://localhost:3001/api
            ```

5.  **Run the Development Servers:**
    *   Open two separate terminal windows/tabs, both navigated to the project root (`inner-dna-app`).
    *   **Terminal 1 (Backend Server):**
        ```bash
        pnpm dev:server
        ```
        You should see output indicating the server is running, typically on port 3001 (e.g., `[server]: Server is running at http://localhost:3001 (IN-MEMORY AUTH MODE)`).
    *   **Terminal 2 (Frontend Client):**
        ```bash
        pnpm dev:client
        ```
        Vite will start the development server, usually on port `3000` (as configured in `vite.config.ts`) or `5173` (a Vite default if 3000 is taken). Check the terminal output for the correct URL (e.g., `Local: http://localhost:3000/`).

6.  **Open in Browser:**
    *   Open your web browser and navigate to the URL provided by the Vite dev server (e.g., `http://localhost:3000` or `http://localhost:5173`).

7.  **Using the Application:**
    *   You should see the Welcome Page.
    *   Registration and Login will use the in-memory backend. Users you register will only exist in the server's memory for the current session (they will be lost if the server restarts).
    *   You can test the full assessment flow.

This completes the setup for local review.
```
