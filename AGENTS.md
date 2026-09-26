# Mythril development

- Think **editor first** when a design or API choice is unclear. Prefer compact controls, dense but readable layouts, quiet surfaces, visible focus, and restrained semantic color. Avoid oversized buttons, decorative spacing, and portfolio-style presentation.
- Keep single-line controls aligned at the shared 32px height; the compact size is 28px. Multiline inputs grow with content. Keep labels and errors readable without enlarging the controls.
- Use native form elements and preserve refs, disabled and submit behavior, keyboard access, and accessible names. Icon-only buttons need tooltips.
- Treat hidden inputs as part of the public form contract: disabled controls must not submit values. Keep the active option visible in scrollable keyboard-operated lists, and return focus after dismissing overlays.
- Use `lucide-react` for UI icons. Do not add authored SVGs, SVG data URLs, or downloaded icon assets.
- Render every exported component in Storybook, including open overlay and selected states needed for visual review. Put states and variants together in a single overview whenever they can be compared on one page. Add a separate story only for a distinct interaction that cannot be shown clearly there. Keep the Storybook coverage check passing.
- Build reusable presentation primitives, not Anvil workflow logic. Keep overlays on Floating UI and allow collision boundaries. Test portals with and without `Theme`: unthemed controls use light fallbacks, while `Theme` defaults to dark.
- Keep React 19 and React DOM as peers. Export public components and types from `src/index.ts`, include their styles in the package, and avoid importing consumer application code.
- Follow the existing React/TypeScript structure, use arrow functions and strong types, and document public APIs. Add focused behavior tests for changed interactions; run the narrowest relevant checks while developing and `npm run check` before committing a releasable change.
- Validate new APIs in a real consumer using a local tarball before publishing. Keep GitHub Packages private, and never commit registry credentials or tokens.
