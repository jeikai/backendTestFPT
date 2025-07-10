import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import eslintPluginJest from "eslint-plugin-jest";

export default defineConfig([
  // Cấu hình chung cho JS
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: {
      js,
    },
    extends: ["js/recommended"],
  },
  // Dành cho CommonJS
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
    },
  },
  // Global cho trình duyệt
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  // ✅ Thêm cấu hình riêng cho file test dùng Jest
  {
    files: ["**/*.test.js", "**/__tests__/**/*.js"],
    plugins: {
      jest: eslintPluginJest,
    },
    languageOptions: {
      globals: globals.jest,
    },
    rules: {
      // Optionally enable recommended rules
      ...eslintPluginJest.configs.recommended.rules,
    },
  },
]);
