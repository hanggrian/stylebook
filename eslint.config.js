import js from '@eslint/js';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';

export default typescriptEslint.config(
    { ignores: ['dist'] },
    {
        extends: [js.configs.recommended],
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            globals: globals.node,
        },
    },
    {
        extends: [js.configs.recommended, ...typescriptEslint.configs.recommended],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2022,
            globals: globals.node,
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
);
