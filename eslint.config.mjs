import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import unusedImports from 'eslint-plugin-unused-imports';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname
});

const eslintConfig = [
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    {
        plugins: {
            prettier,
            'unused-imports': unusedImports,
            import: importPlugin
        },
        rules: {
            'no-unused-vars': [
                'error',
                {
                    vars: 'local',
                    args: 'none'
                }
            ],
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            'react-hooks/exhaustive-deps': 'off',
            'unused-imports/no-unused-imports': 'warn',
            'import/order': [
                2,
                {
                    groups: ['builtin', 'external', ['internal', 'parent', 'sibling', 'index'], 'unknown'],
                    pathGroupsExcludedImportTypes: ['builtin'],
                    'newlines-between': 'always',
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true
                    }
                }
            ]
        }
    }
];

export default eslintConfig;
