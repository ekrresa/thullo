/** @type {import("prettier").Config} */
module.exports = {
  arrowParens: 'avoid',
  printWidth: 90,
  singleQuote: true,
  semi: false,
  importOrder: [
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@hooks/(.*)$',
    '^@stores/(.*)$',
    '^@components/(.*)$',
    '^@lib/(.*)$',
    '^@models/(.*)$',
    '^@styles/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
  importOrderBuiltinModulesToTop: true,
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderMergeDuplicateImports: true,
  importOrderCombineTypeAndValueImports: true,
  plugins: [require.resolve('@ianvs/prettier-plugin-sort-imports')],
}
