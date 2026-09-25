# Mythril

A reusable React 19 component library for Anvil and future projects. Start small:
native controls, typed APIs, locally scoped styles, and no application behavior.

## Development

Use Node 24 (`nvm use`) and npm. The toolchain requires Node 22.12 or later.

```sh
npm ci
npm run dev
```

Storybook runs locally at http://127.0.0.1:6006. It provides interactive controls,
generated prop documentation, component states, and an accessibility panel.

```sh
npm run check            # formatting, lint, types, tests, package and Storybook builds
npm run test:watch       # component tests during development
npm run format          # format source and configuration
npm run build           # ESM, declarations, and styles in dist/
```

Vite's [library mode](https://vite.dev/guide/build#library-mode) builds the package;
[Storybook React/Vite](https://storybook.js.org/docs/get-started/frameworks/react-vite)
provides isolated component development. React and React DOM are peer dependencies
and remain external to the bundle. Vitest and Testing Library verify observable
behavior. The package check installs a real tarball into a disposable consumer,
then checks declarations, CSS resolution, Vite bundling, and server rendering.
CI runs the same complete check. Visual and screen-reader QA remain manual.

## Use from another project

The package is `@aelbrecht/mythril-ui`, configured for private GitHub Packages in
`aelbrecht/mythril-ui`. See [publishing and installation](docs/publishing.md) for
registry authentication and releases. Local packaging also works without publishing:

```sh
# In Mythril (prepack builds the package):
npm pack

# In a consuming React 19 project:
npm install /absolute/path/to/mythril/aelbrecht-mythril-ui-0.1.0.tgz
```

```tsx
import { Button, IconButton, TextField } from "@aelbrecht/mythril-ui";
import { MoreHorizontal, Plus } from "lucide-react";
import "@aelbrecht/mythril-ui/styles.css";

export const ProjectForm = () => (
  <form>
    <TextField label="Project name" name="project" required />
    <Button type="submit" variant="primary" icon={Plus}>
      Create project
    </Button>
    <IconButton icon={MoreHorizontal} label="More options" />
  </form>
);
```

Import the stylesheet once at the application's entry point. Wrap controls in
`<Theme>` (dark by default) or `<Theme mode="light">` for the full palette, typography,
and themed overlays. There is no global reset or document-level styling. Only
the public entry and stylesheet are supported imports; internal paths are private.
Output is ESM-only and targets modern browsers. React 18 and CommonJS consumers
are not currently supported. The JS bundle carries a `use client` boundary for
React Server Component hosts, and can still be server-rendered by React DOM.

Anvil is not modified by this setup. Install a published version or local tarball
there when ready to adopt components. Rebuild and reinstall a new tarball after
local library changes.

## Components

| Area       | Components                                                                                                |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| Actions    | Button, ButtonLink, IconButton, ToggleButton, Toolbar, Tooltip                                            |
| Forms      | TextInput, Textarea, TextareaComposer, Select, Checkbox, Combobox, Listbox, EntityPicker, FileDropzone    |
| Structure  | Disclosure, Accordion, Tabs, ResizablePanels, TreeView, PageHeader, Card, FormRow, FormActions, FilterBar |
| Data       | DataTable, Pagination, DescriptionList, ImagePreview                                                      |
| Feedback   | StatusBadge, Chip, Notice, Alert, UsageMeter, ToastProvider, LoadingState, EmptyState                     |
| Overlays   | Dialog, Drawer, Popover, Menu, ContextMenu                                                                |
| History    | ScrollArea with follow-latest, CodeBlock with copy and bounded preview                                    |
| Appearance | Theme with light/dark palettes and CSS token overrides                                                    |

The original `TextField` export remains an alias for `TextInput`. Text inputs,
textareas, and selects default to a filled editor surface; use `variant="outline"`
for a bordered field. `TextareaComposer` places an action row below a textarea in
one surface. Fields share accessible labels, descriptions, errors, and native form/ref behavior. Floating UI
handles overlay positioning and focus; Lucide React supplies icons. Both are runtime
dependencies externalized from the library bundle.

Editor surfaces can compose `PageHeader`, `Card`, `FormRow`, `FilterBar`,
`DataTable`, and `Pagination` without coupling the library to a router or API.
`EntityPicker` accepts application-supplied search results and selected items;
`FileDropzone` reports files without uploading them. Use `ButtonLink` for native
anchors or `buttonLinkProps()` on a router link.

Start with **Components → Button → Overview** to compare variants on one page,
then **Examples → Readable history**. The history example combines compact
controls, formatted text, disclosures, statuses, long output, and scroll-follow
behavior with local fixture data. Use the theme toolbar to compare light and dark.
The example is not part of the published API and does not call any application API.

See [component contracts and examples](docs/components.md) for state management,
accessibility behavior, limitations, and theming. Workflow logic, Markdown parsing,
log fetching/pagination, and task-specific components remain in the consuming app.

## Styling

CSS Modules scope component rules. `Theme` uses the Lovable Anvil activity-history
palette: a near-black canvas, dark panels, hairline borders, compact controls, and
restrained green statuses. It prefers Geist if the host provides it, then system
fonts; no font is fetched by the package. Use typed `tokens` to customize `--mythril-*`
variables; token overrides also follow tooltips and other portaled overlays.
`className`/`style` can customize components that expose native element props.
Theme defaults live in [theme.module.css](src/components/theme/theme.module.css).
Consumers own contrast when overriding colors.

## Adding components

Keep each component in `src/components/<name>/`, alongside its CSS Module, stories,
and behavior tests. Use arrow functions, exported props interfaces, and native
element semantics. Forward native props and refs; preserve keyboard, focus,
disabled, and form behavior. Prefer composition over speculative variants.

Explicitly export components and types from `src/index.ts`. Keep app state,
routing, API calls, and Anvil-specific concepts outside the library. Add public
API documentation with JSDoc and stories for supported states. Test interactions
and accessibility relationships rather than snapshots or CSS implementation.
For complex widgets, evaluate an accessible primitive before implementing focus
management yourself. Hand-written files should stay below roughly 500 lines.

See [linting decisions](docs/linting.md) for how the supplied ESLint reference was
adapted. Version public API changes deliberately and run `npm run check` before
sharing a package. Publishing a stable GitHub release triggers validation and then
publishing to GitHub Packages; the release tag must match the package version.
