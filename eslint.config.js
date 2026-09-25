import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import jsdoc from "eslint-plugin-jsdoc";
import jsxA11y from "eslint-plugin-jsx-a11y";
import promise from "eslint-plugin-promise";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

// Adapted from the supplied unified-viewer config. See docs/linting.md.
export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "storybook-static/**",
      "coverage/**",
      "node_modules/**",
    ],
  },
  {
    files: ["**/*.{js,mjs}"],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      promise.configs["flat/recommended"],
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { react, "react-hooks": reactHooks, "jsx-a11y": jsxA11y, jsdoc },
    settings: { react: { version: "detect" } },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      // Named scroll regions and disabled-control explanation groups need keyboard focus.
      "jsx-a11y/no-noninteractive-tabindex": [
        "error",
        { roles: ["tabpanel", "region", "group"] },
      ],
      "react/prop-types": "off",
      "react/jsx-key": ["error", { checkFragmentShorthand: true }],
      "react/self-closing-comp": "error",
      "react/jsx-no-useless-fragment": "error",
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],
      "react/jsx-no-bind": ["error", { allowArrowFunctions: true }],
      "no-redeclare": "off",
      "@typescript-eslint/no-redeclare": ["error", { builtinGlobals: true }],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],
      "@typescript-eslint/no-useless-constructor": "error",
      "one-var": ["error", "never"],
      "guard-for-in": "error",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "(?<!\\.module)\\.css$",
              message:
                "Use CSS Modules for component styles; avoid global side effects.",
            },
            {
              regex: "\\.(scss|sass|less|jsx)$",
              message: "Use TypeScript and native CSS Modules.",
            },
          ],
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "ExportAllDeclaration",
          message:
            "Export public names explicitly so the package API stays intentional.",
        },
        {
          selector: 'ExportNamedDeclaration > VariableDeclaration[kind="let"]',
          message: "Do not export mutable bindings.",
        },
        {
          selector: "TSModuleDeclaration[declare!=true]",
          message: "Use ES modules rather than TypeScript namespaces.",
        },
        {
          selector:
            "FunctionExpression:not([id]):not(MethodDefinition > FunctionExpression)",
          message:
            "Use arrow functions instead of anonymous function expressions.",
        },
      ],
      "jsdoc/check-tag-names": [
        "error",
        { typed: true, enableFixer: false, definedTags: ["group", "remarks"] },
      ],
      "jsdoc/no-types": "error",
      "jsdoc/check-param-names": "error",
      "jsdoc/check-alignment": "error",
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/**/*.stories.tsx"],
    rules: {
      "no-restricted-exports": [
        "error",
        { restrictDefaultExports: { direct: true } },
      ],
    },
  },
  // Formatting has a single owner; this must remain last.
  prettier,
);
