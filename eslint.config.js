import globals from 'globals';
import js from '@eslint/js';

export default [
    {
        // ignores needs to be in it's own config object, to make directories ignorable - https://github.com/eslint/eslint/discussions/17429
        ignores: ['.DS_Store', 'node_modules/*', 'build/*', 'package-lock.json']
    },
    {
        languageOptions: { globals: globals.browser },
        rules: {
            ...js.configs.recommended.rules,
            'no-console': 'error'
        }
    }
];
