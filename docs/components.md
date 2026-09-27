# Component contracts

Import components from `@godoji/mythril-ui` and load
`@godoji/mythril-ui/styles.css` once. Storybook documents props and supported
states. All components are React 19 components; refs are ordinary props.

## Theme and density

```tsx
import { Button, Theme } from "@godoji/mythril-ui";

<Theme mode="dark" tokens={{ "--mythril-radius": "2px" }}>
  <Button size="small">Save</Button>
</Theme>;
```

Single-line buttons, text inputs, selects, checkbox rows, and tab bars share
`--mythril-control-height` (32px by default), including without `Theme`.
`Button size="small"` and small icon buttons use
`--mythril-control-height-small` (28px by default). Textareas remain multiline,
and checkbox indicators stay 16px, centered inside a full-height field row.
Underline tabs have 24px between labels and 12px between the tab bar and panel;
segmented tabs include their border and padding inside the 32px height. The
`Examples/Control alignment` story shows these dimensions together.
`Theme` defaults to a dark palette: near-black canvas, slightly
lighter panels, hairline dividers, compact controls, and restrained status color.
It uses Geist when the host loads it, then a system sans-serif fallback; it does
not fetch fonts. Pass `mode="light"` for the matching light palette. Pass custom
variables through `tokens` so portaled overlays receive them too. Overrides made
only on arbitrary DOM ancestors cannot cross a portal. Without `Theme`, components
use their light fallback palette. No global reset is included.

## Actions and fields

- `Button`: `primary`, `secondary`, `ghost`, `success`, `warning`, or `danger`;
  `small` or `medium`. Semantic variants use restrained tinted surfaces rather
  than solid warning/danger fills.
  Defaults to `type="button"`. Native disabled, submit, event, and ref behavior is
  preserved. Pass `icon={Plus}` with a visible label and optionally
  `iconPosition="end"` to place the icon after it. Icons are decorative and hidden
  from assistive technology. Use `IconButton` when there is no visible label.
- `IconButton`: the same variants, with a required Lucide `icon` and accessible
  `label`. Its tooltip opens on hover or focus and matches its accessible name.
  A disabled button remains disabled;
  its wrapper adds a keyboard-focusable explanation, not an executable action.
  Pass `boundary` to constrain its tooltip inside a container. Use
  `shape="circle"` for a circular icon-only button.
- `Tooltip`: a single focusable child that forwards DOM props and its ref. Opens
  on hover/focus and dismisses on Escape. Content is text, not interactive UI.
  `placement` is a preference; Floating UI flips it when needed.
- `TextInput`, `Textarea`, and `Select` use a borderless `filled` surface by
  default, or `variant="outline"` for a bordered field. The filled surface uses
  `--mythril-input-filled` and inherits the theme text color. `TextareaComposer`
  combines a filled textarea and an `actions` slot beneath it inside one surface;
  place it in a native form and pass a submit button when appropriate. Its
  `className` styles the outer surface and `textareaClassName` styles the native
  textarea. It does not attach files, submit data, or interpret keyboard shortcuts.
- `TextInput`, `Textarea`, `Select`, `Checkbox`: required `label`, normally visible; optional
  `description` and `error`. Descriptions merge with caller `aria-describedby`.
  Errors set `aria-invalid`; consumers own validation and live announcements.
  Native props, form names, controlled/uncontrolled values, and refs pass through.
  `className` targets the native control. `Select` accepts native `option` and
  `optgroup` children. `Checkbox` supports `indeterminate`.
- `TextField` remains a compatibility alias for `TextInput`.
- `TextInput` also supports native number, date, time, and datetime-local types.
  Textareas cannot be manually resized by default; pass `resizable` to allow
  vertical resizing. `Textarea autoResize` grows with content and disables manual
  resizing; `maxRows` caps its height. Use
  `labelHidden` on TextInput, Textarea, Select, Combobox, or EntityPicker when a surrounding
  `FormRow` shows the same label. The native label stays accessible.
- `ButtonLink` is a styled native anchor with the Button variants, sizes, and
  optional Lucide icon. Spread `buttonLinkProps({ variant, size })` onto a router
  link to style it without changing navigation semantics.

## Structure and feedback

`Stack` arranges children vertically with `gap` values from the Mythril spacing
scale (`"1"`, `"2"`, `"3"`, `"4"`, `"6"`, or `"8"`; default `"3"`). Put it around
related controls or sections instead of adding margins to each child. It accepts
native `div` props, including `className` and `ref`, and adds no padding. Pass
`as="form"` or `as="section"` to keep the native element and its typed props.

`ChoiceButton` is a full-width native button for a selectable action. Pass `label`,
optional `description` and `trailing` content, and `highlighted` for quiet visual
emphasis. It defaults to `type="button"`; the consumer owns the choice and any
meaning attached to the emphasis.

`Inline` arranges children horizontally with the same spacing scale. Its `align`
prop controls cross-axis alignment (`"center"` by default). Use `align="end"` to
align a button with the control beneath a visible field label. Items wrap by
default; pass `wrap={false}` for a single row.

`Disclosure` accepts `title`, `children`, and optional controlled `open` /
`onOpenChange`, or `defaultOpen`. Its trigger handles Enter/Space and exposes
expanded state. Titles should be non-interactive content. Collapsed children stay
mounted but hidden, preserving local state.

`Accordion` composes disclosures from unique `{ value, title, content, disabled }`
items. `value`/`defaultValue` is an array of item values; `multiple` enables more
than one open section. Each trigger is a normal Tab stop with Enter/Space; no
optional accordion arrow-key navigation is implemented.

`Tabs` accepts unique `{ value, label, content, disabled }` items. Choose underline
or segmented presentation. Arrow keys, Home, and End move and automatically
activate tabs, skipping disabled items and honoring RTL direction. Panels remain
mounted while hidden. Controlled selection uses `value` / `onValueChange`.

`ResizablePanels` renders a primary pane, secondary pane, and focusable separator.
`orientation="horizontal"` places panes side by side; `vertical` stacks them.
`size` / `defaultSize`, `minSize`, `maxSize`, and `minSecondarySize` are pixel
values. Drag the separator or use arrows in 10px steps (50px with Shift); Home and
End move to the limits. With `collapsible`, Enter collapses and restores the
primary pane. The consumer persists `onSizeChange` if desired. Its separator
follows the [window splitter pattern](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/).

`TreeView` takes hierarchical nodes with unique IDs and string labels. Expansion
and selection are independently controlled (`expandedIds` / `selectedId`) or
uncontrolled (`defaultExpandedIds` / `defaultSelectedId`). Arrow keys, Home/End,
Enter/Space, and typeahead navigate or select visible nodes; disabled nodes are
skipped. Applications supply the tree data and selection action. No filesystem
loading, drag-and-drop, or multi-selection is included. See the
[tree view pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/).

`Combobox` filters its `options` by label and description, keeping keyboard focus
in the text input while `aria-activedescendant` tracks the active option. It
supports controlled or default `value`, disabled options, a native hidden `name`
value for forms, and the same `variant` and field descriptions as TextInput.
Its listbox uses Floating UI and accepts a `boundary`. Applications own remote
search, validation, and command execution. See the
[combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/).

`Listbox` renders the same option shape as a permanently visible single-select
list. It has roving focus, arrow/Home/End navigation, typeahead, disabled options,
and controlled or default `value`. Focus and selection stay separate until Enter,
Space, or a click selects an option.

`EntityPicker` is a controlled multi-select for async or local search. Pass
`selected` items with their labels, matching `options`, and `onSelectedChange`;
optionally control `query` / `onQueryChange`. The app fetches results and maps
selected IDs to its data model. `maxSelected` disables new selections while
retaining removal. Keyboard focus stays in the input: arrows move through enabled
results, Enter toggles, Backspace removes the last selected item when the query
is empty, and Escape closes the list. A `name` submits selected IDs as repeated
hidden form values. Its result overlay accepts `boundary` and uses Floating UI.
Use `layout="inline"` to place removable chips and the input in one bordered
surface. With `filterMode="prefix"`, the picker filters local options by the
beginning of their label, omits selected options from results, and clears the
query after selection. The default `filterMode="provided"` keeps caller-filtered
results for asynchronous searches.

`FileDropzone` reports native selected or dropped `File` objects through
`onFiles`. The app validates file types, uploads bytes, handles errors, and owns
persistence. `accept` filters the native file picker but cannot validate a drop
by itself. `ImagePreview` presents a URL with optional caption and removal; it
does not create object URLs or upload images.

`Toolbar` groups icon actions from `items` with one Tab stop; arrows and Home/End
move focus, skipping disabled items. A `pressed` item shows its toggle state and a
`shortcut` appears in its tooltip, but keyboard shortcuts are registered by the
application. `ToggleButton` is the standalone text-labelled counterpart, with
controlled or default pressed state. See the
[toolbar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/).

`StatusBadge` displays caller-provided text with a semantic tone. It contains no
Anvil status mapping and does not announce every render. `Notice` presents static
feedback, with optional title/actions. `Alert` uses `role="alert"` for newly
appearing urgent feedback; use it sparingly in histories.

`UsageMeter` takes `label`, `value`, `max`, and optional `unit` / `formatValue`.
`null` means unavailable and `0` means known zero. Invalid numeric inputs render
unavailable. Over-limit usage fills the meter but retains the true amount in its
text and accessible value description. It makes no model/provider calculations.

`DataTable` wraps a native table in a scrollable viewport. Supply `<thead>` and
`<tbody>` with your own rows; `DataTableHeadCell`, `DataTableCell`, and
`DataTableStateRow` provide compact cells, optional sort controls, responsive
column hiding, and empty/loading rows. `caption` names the table. `stickyHeader`,
`minWidth`, `maxHeight`, and `density` shape the viewport without fetching,
filtering, sorting, or virtualizing data. Sort callbacks and `aria-sort` are
controlled by the app. Ordinary tables leave links and buttons in the page Tab
sequence; a distinct ARIA grid is for spreadsheet-like cell navigation. See the
[table](https://www.w3.org/WAI/ARIA/apg/patterns/table/) and
[grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/) patterns.

`Pagination` uses one-based `page` numbers. In page mode, provide
`onPageChange` and either `totalPages` or `hasNextPage`. A known `totalPages`
shows a compact numbered window for direct jumps; unknown totals show adjacent
navigation only. Optional page-size controls report a new size without resetting
application state. All page controls are disabled while `loading`. In `load-more`
mode, provide `hasNextPage` and `onLoadMore`. `FilterBar` lays out search and
filter controls; query state, debouncing, and URL synchronization stay local.

`PageHeader`, `Card`, `FormRow`, and `FormActions` provide compact editor page
structure. `FormRow` can connect a visible label to a native control with
`htmlFor`; when using a Mythril field, pass `labelHidden` to the field and repeat
its accessible label in the row. `DescriptionList` renders read-only label/value
pairs with native `<dl>` semantics. `Chip` displays a compact value; removable
chips require an accessible `removeLabel`.

`LoadingState` is a quiet announced progress message, and `EmptyState` is a
compact placeholder with optional actions. Use existing `Notice` or `Alert` for
errors and `ToastProvider` for transient outcomes. None of these components
interpret API error objects or choose when a request needs a loading state.

## Dialogs and anchored overlays

`Dialog` is controlled by `open` / `onOpenChange`. It requires a title and accepts
description, body, and footer slots. For consequential actions use
`role="alertdialog"` and point `initialFocus` to a Cancel button ref. Focus is
trapped, background scrolling is locked, and focus returns on dismissal. Escape
closes the current overlay; when a nested tooltip is visible, the first Escape
dismisses that tooltip. Outside clicks do not dismiss a dialog unless
`dismissOnOutsidePress` is enabled. The library never performs the action itself.
`size="medium"` or `size="large"` allows wider editors, and `className`
customizes the panel.

`Drawer` is a modal side panel with start/end placement, small/medium width,
title, description, body, and footer. It traps focus, locks background scrolling,
closes on Escape or outside press, and returns focus. Navigation links and route
state belong to the application.

`Popover` takes a focusable `trigger`, an accessible `label`, and interactive
children. It supports controlled or default open state, collision-aware placement,
Escape/outside dismissal, and non-modal focus management. Triggers must forward
DOM props and refs; Mythril buttons already do this.
`openOn="hover"` also opens on hover or keyboard focus while retaining click
activation; a safe pointer corridor keeps it open while moving into the panel.

`Menu` is a single-level action menu with unique `{ id, label, onSelect, disabled,
danger }` items. It supports arrow keys, Home/End, typeahead, Escape, and focus
return. Callbacks run after requesting menu closure. Async work and its errors
belong to the consumer. Nested menus and menu checkbox/radio items are not included.

`ContextMenu` uses the same `MenuItem` contract. Wrap a focusable target that
forwards DOM props and its ref; right-click, the ContextMenu key, or Shift+F10
opens a Floating UI menu at the pointer or target. `boundary` constrains it.
The wrapped target owns its ordinary click behavior.

`ToastProvider` supplies `useToast().show({ message, tone, duration, action })`
and `dismiss(id)`. It stacks at most three transient notices by default, pauses
the timer while hovered or focused, and uses `role="status"` for routine messages
or `role="alert"` for danger. A duration of `0` keeps a toast until dismissal.
The app decides which event warrants a toast. See the
[status message technique](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA22).

`Tooltip`, `Popover`, `Menu`, `ContextMenu`, `Combobox`, and `EntityPicker` use Floating UI to keep an anchored overlay in
view. `placement` chooses the preferred side; they flip to another side, shift
along edges, and limit their size when space is tight. By default they use the
visible viewport. Pass `boundary={containerRef}` or `boundary={element}` to keep
them within a specific container **and** the viewport. The boundary may be a
React ref to an `HTMLElement` or the element itself. Portals still render in the
document body to escape ancestor clipping; `boundary` controls collision bounds,
not the portal destination. The container should contain the trigger. Its resize
and ancestor scrolling update overlay position. Long Popover and Menu content
scrolls within the available height. Icon-only triggers also accept `boundary`
for their own tooltip.

## History and long output

```tsx
<ScrollArea label="History" followLatest style={{ height: "28rem" }}>
  {entries.map((entry) => (
    <Disclosure key={entry.id} title={entry.title}>
      <CodeBlock code={entry.output} label="Command output" />
    </Disclosure>
  ))}
</ScrollArea>
```

`ScrollArea` is a keyboard-focusable region with native scrollbars. It defaults to
20rem high; outer `className` / `style` control layout and its ref points to the
viewport. With `followLatest`, new or resized content follows the bottom only
while the reader is within `threshold` pixels (default 32). Scrolling up pauses
following and exposes “Jump to latest”; scrolling back to the bottom also resumes
following. `onFollowChange` reports the state. Give the component a different React
`key` when switching histories to reset it. ResizeObserver catches layout changes
such as expanding a disclosure. It does not virtualize, fetch, or paginate data.

`CodeBlock` renders escaped plain text, without a syntax-highlighting dependency.
The default preview is bounded to 12,000 characters and 24rem height; `previewLimit`,
`maxHeight`, and `wrap` are configurable. The preview explicitly reports omitted
characters. “Show full output” reveals the full supplied string, while copy always
copies the original text. Clipboard failures are announced with manual-copy
guidance. Full expansion still renders the complete string: use application-level
paging for very large logs. The library does not truncate or persist source data.

`MarkdownContent` renders `content` with GitHub-flavored Markdown and compact
typography. Raw HTML is omitted. External links open in a new tab with
`noopener noreferrer`; in-page anchors stay in the current tab. It does not
fetch, page, or persist content.

## Composition and verification

**Examples → Readable history** combines the primitives with deterministic local
fixtures, rich text, long logs, a composer, settings, and a confirmation dialog.
It is excluded from package builds. Actual task switching, step navigation,
grouped tool activity, approvals, guidance, paged log access,
artifact previews, and pipeline editing belong to Anvil.

Behavior tests cover forms, keyboard interaction, focus trapping/return, nested
overlays, scroll-follow transitions, usage availability, and clipboard failures.
The packed-consumer check verifies public types, CSS, bundling, and SSR imports.
Storybook provides the accessibility panel for user review. Visual, native-browser
layout/scrolling, and screen-reader QA remain manual.
