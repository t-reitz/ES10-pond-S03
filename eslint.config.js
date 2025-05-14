import eslintJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslintJs.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked, // Para regras que usam type information
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname, // ou process.cwd() se estiver em CommonJS puro
      },
    },
    rules: {
      "no-console": "warn",
      "no-unused-vars": "warn", // Desabilitado para dar preferência à regra do typescript-eslint
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn"
    }
  },
  {
    ignores: ["dist/", "node_modules/", "coverage/", "*.md", "jest.config.js", "eslint.config.js"] // Ignora o próprio arquivo de config
  }
);
