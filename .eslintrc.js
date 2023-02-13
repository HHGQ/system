module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-var-requires': 0,
    "@typescript-eslint/explicit-module-boundary-types":"off", // 函数缺少返回类型
    // "@typescript-eslint/no-unused-vars": [ "error" ],
    "@typescript-eslint/no-unused-vars": ["off"],
    "@typescript-eslint/no-this-alias": ["off"],
    '@typescript-eslint/no-empty-function': 'off',
    "@typescript-eslint/no-explicit-any": "off",
    "no-unused-components": "off",
    "no-undef": 0, // 是否可有未定义的变量
    "no-irregular-whitespace": "off"
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
