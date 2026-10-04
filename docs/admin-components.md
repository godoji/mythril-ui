# Building administration interfaces

Mythril supplies reusable presentation and interaction. Consumers supply routing,
authentication, requests, validation rules, data models, and persistence. The
Storybook **Start here** pages link to every component group and to a complete
interactive admin workspace.

## Explore the examples

Run `npm run dev`, then open Storybook on `http://127.0.0.1:6006`.

- **Start here / Welcome**: interactive light/dark comparison and entry points.
- **Start here / Component directory**: searchable component groups.
- **Examples / Admin workspace / Catalog**: search, filters, sorting, pagination,
  creating and editing products.
- **Product Editor**: multilingual fields, a simulated remote picker, collections,
  prices, and local image previews.
- **Content Studio**: editable localized sections with add/remove/reorder actions.
- **Analytics**: period selection, metric cards, chart tokens and a data summary.
- **Icon Rail**: the same workspace using compact navigation.

Examples use in-memory demonstration data. They make no requests and do not upload
files. State resets when a view unmounts. The theme toolbar applies to every page;
the welcome page intentionally shows both themes together. Component Docs pages
provide prop tables; source is available through Storybook's source view.

## Application shell and navigation

`AppShell` provides header, navigation, main-content and optional aside slots.
The `scroll="document"` default follows document scrolling. Use `scroll="panes"`
inside a container with a defined height for independent pane scrolling. At narrow
viewport widths the desktop navigation is hidden and a trigger opens `Drawer`.
Pass `mobileNavigation(close)` and call `close` when a destination is selected.
Use `height="viewport"` to fill the dynamic viewport, or `height="parent"` to
fill a container with a defined height. The default `height="content"` keeps
embedded shells sized to their content. Viewport height with document scrolling
grows for long pages; with pane scrolling it bounds the shell to the viewport.
The header keeps its height while the body fills the remaining space.

`Navigation` has `sidebar` and `rail` variants. `NavigationLink` keeps native anchor
behavior, `NavigationAction` is a native button, and `NavigationGroup` provides a
sidebar disclosure or a rail flyout. Rail links/actions have tooltips; group
flyouts open on click or keyboard activation. Pass `current` from your router or
view state. Groups expose controlled open state and optional collision boundaries.
`Navigation width="full"` fills its container. AppShell's mobile drawer applies
this width automatically; an explicit `width="fixed"` retains compact navigation.
Tooltips open on mouse hover and keyboard focus, ignoring touch and pen hover so
the first tap remains available to the action.

Use `renderLink` to integrate a router without replacing link semantics:

```tsx
<NavigationLink
  label="Products"
  href="/products"
  current={pathname === "/products"}
  renderLink={({ href, ...props }) => <Link to={href!} {...props} />}
/>
```

The adapter must forward the ref, event handlers, accessibility attributes,
class name, and children. Use one application navigation definition to render
both desktop and mobile presentations. Keep account actions in `Menu`.

`PageContainer` provides reading/standard/wide/full widths and token-based gutters.
`Grid` uses a minimum column width and collapses naturally to fit its container.
`LinkCard` is an anchor with a title and description, suitable for category indexes;
it supports the same router adapter. Use `Card`, `FormRow`, `Stack`, and `Inline`
inside those layouts rather than assigning margins to every control.
`LinkCard media={...}` adds non-interactive media above the content. Set
`orientation="horizontal"` for a thumbnail beside the content; the layout wraps
in narrow containers. Keep buttons and other interactive controls outside the card.

`Progress` is a styled native task-progress bar with an accessible `label` and no
extra visible copy. Pass `value` and a positive `max` (default 1); omit `value` for
indeterminate work. A value of zero remains determinate. Use `UsageMeter` for
capacity rather than task progress.

## Multilingual editing

`LocalizedField` receives explicit locales and a `Record<string, string>` of values.
It reports changes as `(locale, value)`. A locale's code is opaque to the library;
include a default locale explicitly if the application has one. The consumer owns
language loading and any conversion to a backend representation.

```tsx
<LocalizedField
  label="Title"
  locales={[
    { code: "en", label: "English", required: true },
    { code: "nl", label: "Nederlands" },
  ]}
  values={titles}
  onValueChange={(locale, value) =>
    setTitles((previous) => ({ ...previous, [locale]: value }))
  }
  name="title"
/>
```

Hidden language panels retain their values and submit as `title[en]`, `title[nl]`,
and so on. Disabled fields do not submit. Required native fields reveal their
locale when invalid. Pass per-language `errors` for application validation.
`multiline` uses the existing auto-growing Textarea. Completion/empty/error labels
are configurable. Controlled `activeLocale` consumers must respond to
`onActiveLocaleChange`, including validation-driven changes.

## Remote references

`Combobox` supports `query`, `onQueryChange`, `filterMode="provided"`, and `loading`.
Supply `selectedOption` to keep the chosen label available when it is absent from
the current result page. `onOptionSelect` returns the full selected option;
`onValueChange` still reports its string value. Set `value` from application state.
Loading hides stale options and prevents their selection. Query is reset on
selection and when reopening the chooser.

`EntityPicker` provides the same remote-query boundary for multiple selections,
plus inline chips and a selection limit. It now supports `id`, input `ref`,
`description`, `error`, and `aria-describedby`. A selection limit of one remains
a multiselect limit; use Combobox for single-value replacement.

Debouncing, cancellation, caching, request errors, and selected-label hydration
belong in application adapters. No component fetches data.

## Repeated sections

`CollectionEditor` accepts `{ id, label, content }` items and `onMove(id, toIndex)`,
`onRemove(id)`, and optional `onAdd` callbacks. Supply stable IDs and update the
array immutably. Moving preserves mounted editor state. After an accepted move or
removal, focus goes to the moved or adjacent item's heading, with a status
announcement. Removing the last item focuses Add, or the collection if no Add
button exists. The caller owns confirmation, item creation, and persistence.
Movement uses ordinary keyboard-accessible buttons rather than requiring dragging.

`disabled` disables the mutation controls and wraps editor content in a disabled
fieldset. Nested custom controls must also honor native fieldset semantics, or
receive their own disabled prop where needed.

## Numbers and metrics

`NumberField` uses raw decimal **text**, preserving empty, negative and trailing
separator drafts. `decimalSeparator` selects the native validation pattern;
`prefix`/`suffix` display units. Include units in the accessible label. Values
submit exactly as entered. Parse and validate them explicitly in the consumer;
no floating-point conversion or rounding occurs inside the component. Range,
precision, currency formatting and conversion to integer minor units remain
application responsibilities. This avoids turning an empty field into zero.

`Stat` accepts an already formatted value, supporting detail, and explicit tone.
It reserves one line for optional detail, keeping cards the same height with or
without it. Stats stretch to the tallest card in each `Grid` row, including when
labels or details wrap. Content can grow without a fixed height. A positive
change is not automatically considered good. `ChartFrame` accepts any
chart renderer plus a required accessible textual/tabular `summary`. Its CSS
variables are `--mythril-chart-1`, `--mythril-chart-2`, `--mythril-chart-3`,
`--mythril-chart-grid`, and `--mythril-chart-text`. Set them on the frame through
`style` when customizing a series. Mythril does not add a chart engine dependency.

## Built-in messages

`MessagesProvider` accepts partial overrides, inheriting unspecified values from
an outer provider. It covers pagination, picker and upload messages, including
functions for page numbers and item-removal labels. Other components expose
specific label props such as Dialog's `closeLabel` and CollectionEditor's movement
labels. Applications remain free to choose their translation library.

## Scope

This release adds library APIs and examples. Advanced data-grid selection,
virtualization, a custom date-range calendar, rich text editing, and drag-and-drop
reordering require concrete consumer requirements before adding new abstractions
or dependencies. Native date/time fields, semantic tables, and button-based
reordering cover the current baseline.
