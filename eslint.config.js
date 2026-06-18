// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import pluginCypress from 'eslint-plugin-cypress';
import daStyle from 'eslint-config-dicodingacademy';

export default defineConfig([{
  files: ['**/*.{js,mjs,cjs,jsx}'],
  plugins: { js },
  extends: ['js/recommended'],
  languageOptions: { globals: { ...globals.browser, ...globals.node } },
  settings: {
    react: {
      version: 'detect',
    },
  },
}, pluginReact.configs.flat.recommended, pluginCypress.configs.recommended, daStyle, {
  rules: {
    'react/prop-types': 'off',
  },
}, ...storybook.configs['flat/recommended']]);
