import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
   eslint.configs.recommended,
   ...tseslint.configs.strict,
   { ignores: ['**/*.js'] },
   {
      rules: {
          allowObjectTypes: 'off',
         '@typescript-eslint/no-non-null-assertion': 'off',
         '@typescript-eslint/no-empty-object-type': 'off'
      },
   },
]