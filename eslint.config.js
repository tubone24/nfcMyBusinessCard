import eslintPluginAstro from 'eslint-plugin-astro';
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  // JavaScript/TypeScript files
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  // Astro files
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs['jsx-a11y-recommended'],
  {
    files: ['**/*.astro'],
    rules: {
      // Override or add Astro-specific rules here
    },
  },
  // Ignore patterns
  {
    ignores: [
      'dist/',
      'node_modules/',
      '.astro/',
      'storybook-static/',
      'playwright-report/',
      'test-results/',
    ],
  },
];
