/** @type {import("prettier").Options} */
export default {
  printWidth: 100,
  tabWidth: 2,
  trailingComma: "es5",
  singleQuote: false,
  semi: true,
  importOrder: ["^[./]", "^@/"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ["prettier-plugin-tailwindcss", "@ianvs/prettier-plugin-sort-imports"],
  pluginSearchDirs: false,
};
