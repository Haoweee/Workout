import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Allow @ts-nocheck in specific files like icons.tsx
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-nocheck': false,
        },
      ],
      // Allow non-component exports for context and hook files
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
          allowExportNames: ['useGuestAuth', 'useMixedRouteAuth'],
        },
      ],
    },
  },
  {
    // Specific config for icons file
    files: ['src/components/ui/icons.tsx'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
  {
    // Disable react-refresh rules for context and hooks files
    files: ['src/context/**/*.tsx', 'src/hooks/**/*.ts'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
]);
