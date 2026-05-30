import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
// 1. Import prettier plugin và config
import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended, 
      ...tseslint.configs.recommended,
      eslintConfigPrettier // 2. Thêm cái này để tắt các rule xung đột với Prettier
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      fontSize: 2026, // Cập nhật môi trường hiện tại
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,'prettier': eslintPluginPrettier, // 3. Thêm plugin prettier
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'prettier/prettier': 'error', // 4. Báo lỗi đỏ nếu code sai format Prettier
    },
  },
)