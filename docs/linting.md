# Linting decisions

The supplied `unified-viewer/eslint.config.js` is a reference for conventions,
not an application architecture to copy. Mythril uses an ESLint flat config.

Retained:

- Strict type-aware TypeScript checks and recommended Promise rules.
- React Hooks checks, keyed lists, self-closing JSX, and arrow components.
- Explicit function return types, interfaces for object shapes, type-only imports,
  and intentional named public exports. Callback expressions may infer returns.
- No mutable exported bindings, wildcard exports, or runtime namespaces.
- CSS Modules and native CSS rather than preprocessors.
- Validation of JSDoc when present, without mandatory documentation boilerplate.

Adapted for a library:

- No app feature boundaries: components can compose other components directly.
- Utility types such as `Omit`, `Pick`, and `Partial` are allowed. Native React
  props should be extended, not manually duplicated.
- Default exports are allowed in tool configs and Storybook metadata, which
  require them. Component source and the package entry use named exports.
- `.js` import specifiers are allowed: TypeScript resolves them to source `.ts`
  files and emitted declarations remain compatible with Node ESM consumers.
- Class-name composition is allowed so consumers can supply their own classes.
  Component styles still use CSS Modules, with no global reset or `:root` rules.
- React's version is detected instead of hard-coded to React 18.
- Fast Refresh's only-export-components rule is omitted: public library entry
  points intentionally export components and types together.
- React Hooks' official rules replace bespoke hook-name heuristics that can
  reject legitimate types and APIs.
- TypeScript-aware redeclaration checking replaces the base rule.
- Prettier owns formatting; its ESLint compatibility config runs last, rather
  than re-enabling conflicting deprecated formatting rules.
- JSX accessibility linting is added. It supplements interaction tests and
  Storybook's accessibility panel; it does not replace manual accessibility QA.
- Named scroll regions and disabled-control explanation groups may use tabIndex
  so keyboard users can scroll output and discover unavailable-action tooltips.

ESLint 9 and TypeScript 6 are deliberate compatibility choices: the React and
accessibility plugins currently declare ESLint 9 support, and typescript-eslint
requires TypeScript below 6.1. Vite and Storybook use the latest stable releases
resolved during setup. Exact development versions and `package-lock.json` keep
installs repeatable; upgrades should pass `npm run check`.
