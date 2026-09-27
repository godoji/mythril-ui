import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Exercise the actual tarball from an isolated consumer, never a source alias.
const root = fileURLToPath(new URL("../", import.meta.url));
const fixture = mkdtempSync(join(tmpdir(), "mythril-consumer-"));
const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const npmCli = process.env.npm_execpath;
assert(npmCli, "Run this check through npm run test:package.");

const run = (executable, args, cwd = fixture) =>
  execFileSync(executable, args, { cwd, encoding: "utf8", stdio: "pipe" });

try {
  const [packed] = JSON.parse(
    run(
      process.execPath,
      [
        npmCli,
        "pack",
        "--ignore-scripts",
        "--json",
        "--pack-destination",
        fixture,
      ],
      root,
    ),
  );
  const paths = packed.files.map((file) => file.path);
  for (const path of ["dist/index.js", "dist/index.d.ts", "dist/styles.css"]) {
    assert(paths.includes(path), `Missing package entry: ${path}`);
  }
  assert(!paths.some((path) => /(?:stories|test)\.[cm]?[jt]sx?$/.test(path)));
  assert(!paths.some((path) => path.startsWith("src/")));

  writeFileSync(
    join(fixture, "package.json"),
    JSON.stringify({
      private: true,
      type: "module",
      dependencies: {
        "@godoji/mythril-ui": `file:${join(fixture, packed.filename)}`,
        react: manifest.devDependencies.react,
        "react-dom": manifest.devDependencies["react-dom"],
        "@types/react": manifest.devDependencies["@types/react"],
        "@types/react-dom": manifest.devDependencies["@types/react-dom"],
      },
    }),
  );
  // A fresh CI runner may not have registry metadata for peer dependencies cached.
  run(process.execPath, [
    npmCli,
    "install",
    "--ignore-scripts",
    "--no-audit",
    "--no-fund",
    "--package-lock=false",
  ]);
  writeFileSync(
    join(fixture, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        target: "ES2022",
        module: "NodeNext",
        moduleResolution: "NodeNext",
        jsx: "react-jsx",
        strict: true,
        noEmit: true,
        skipLibCheck: false,
      },
      include: ["consumer.tsx"],
    }),
  );
  writeFileSync(
    join(fixture, "consumer.tsx"),
    `
import { createRef } from "react";
import { createRoot } from "react-dom/client";
import { Accordion, Alert, Button, ButtonLink, buttonLinkProps, Card, Checkbox, Chip, CodeBlock, Combobox, ContextMenu, DataTable, DataTableCell, DataTableHeadCell, DataTableStateRow, DescriptionList, Dialog, Disclosure, Drawer, EmptyState, EntityPicker, FileDropzone, FilterBar, FormActions, FormRow, IconButton, ImagePreview, Listbox, LoadingState, Menu, Notice, PageHeader, Pagination, Popover, ResizablePanels, ScrollArea, Select, StatusBadge, Tabs, Textarea, TextareaComposer, TextField, TextInput, Theme, ToastProvider, ToggleButton, Toolbar, Tooltip, TreeView, UsageMeter } from "@godoji/mythril-ui";
import { Play, Plus } from "lucide-react";
import type { ButtonProps, FieldVariant, FloatingBoundary, TextFieldProps } from "@godoji/mythril-ui";
import "@godoji/mythril-ui/styles.css";
const button: ButtonProps = { type: "submit", ref: createRef<HTMLButtonElement>() };
const field: TextFieldProps = { label: "Project", name: "project", ref: createRef<HTMLInputElement>() };
const fieldVariant: FieldVariant = "filled";
void fieldVariant;
const boundary: FloatingBoundary = createRef<HTMLDivElement>();
// @ts-expect-error unsupported variants must remain a type error for consumers
const invalid: ButtonProps = { variant: "unknown" };
void invalid;
createRoot(document.getElementById("root")!).render(<Theme mode="dark" tokens={{ "--mythril-radius": "2px" }}>
  <Button {...button} icon={Plus}>Save</Button><TextField {...field} />
  <TextInput label="Name" variant="outline" /><Textarea label="Notes" /><TextareaComposer label="Add a note" actions={<Button type="submit">Add note</Button>} /><Select label="Format"><option>Text</option></Select><Checkbox label="Confirm" />
  <IconButton icon={Play} label="Run" boundary={boundary} /><Tooltip label="Help" boundary={boundary}><Button>Help</Button></Tooltip><StatusBadge tone="success">Complete</StatusBadge><Notice>Ready</Notice><Alert>Check this</Alert>
  <Accordion label="Details" items={[{ value: "one", title: "One", content: "Details" }]} />
  <ScrollArea label="History" followLatest><Disclosure title="Output"><CodeBlock code="full output" /></Disclosure></ScrollArea>
  <Tabs label="Views" items={[{ value: "history", label: "History", content: "Content" }]} />
  <Popover label="Options" trigger={<Button>Options</Button>} boundary={boundary}>Options</Popover>
  <Menu label="Actions" trigger={<Button>Actions</Button>} boundary={boundary} items={[]} />
  <Dialog open={false} onOpenChange={() => {}} title="Confirm" />
  <UsageMeter label="Usage" value={null} max={100} />
  <ResizablePanels primaryLabel="Tasks" primary="Tasks" secondary="History" />
  <TreeView label="Files" nodes={[{ id: "one", label: "One" }]} />
  <Combobox label="Task" options={[{ value: "one", label: "One" }]} />
  <Listbox label="Views" options={[{ value: "history", label: "History" }]} />
  <Toolbar label="Actions" items={[{ id: "play", label: "Play", icon: Play, onPress: () => {} }]} />
  <ToggleButton>Preview</ToggleButton>
  <ContextMenu label="File actions" items={[]}><button type="button">File</button></ContextMenu>
  <ToastProvider><span>Notifications</span></ToastProvider>
  <ButtonLink href="/orders">Orders</ButtonLink><a href="/products" {...buttonLinkProps({ variant: "ghost" })}>Products</a>
  <PageHeader title="Catalog" actions={<Button>New</Button>} />
  <FilterBar label="Catalog filters"><TextInput label="Search" /></FilterBar>
  <Card title="Details"><FormRow label="Name"><TextInput label="Name" labelHidden /></FormRow><FormActions><Button>Save</Button></FormActions></Card>
  <DataTable caption="Records"><thead><tr><DataTableHeadCell>Name</DataTableHeadCell></tr></thead><tbody><tr><DataTableCell>One</DataTableCell></tr><DataTableStateRow colSpan={1}>End</DataTableStateRow></tbody></DataTable>
  <Pagination label="Pages" page={1} totalPages={2} onPageChange={() => {}} />
  <EntityPicker label="Related" selected={[]} options={[]} onSelectedChange={() => {}} />
  <FileDropzone label="Image" onFiles={() => {}} />
  <ImagePreview src="/sample.png" alt="Sample" />
  <Drawer open={false} onOpenChange={() => {}} title="Navigation">Sections</Drawer>
  <LoadingState /><EmptyState title="Nothing here" />
  <DescriptionList items={[{ label: "Code", value: "A1" }]} /><Chip>Tag</Chip>
  <Textarea label="Translation" autoResize />
</Theme>);
`,
  );
  writeFileSync(
    join(fixture, "index.html"),
    '<div id="root"></div><script type="module" src="/consumer.tsx"></script>',
  );
  run(process.execPath, [
    join(root, "node_modules/typescript/bin/tsc"),
    "-p",
    "tsconfig.json",
  ]);
  run(process.execPath, [join(root, "node_modules/vite/bin/vite.js"), "build"]);
  const markup = run(process.execPath, [
    "--input-type=module",
    "-e",
    `
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Button, TextField } from "@godoji/mythril-ui";
console.log(renderToStaticMarkup(createElement(Button, null, "Save")));
console.log(renderToStaticMarkup(createElement(TextField, { label: "Project" })));
`,
  ]);
  assert.match(markup, /type="button"/);
  assert.match(markup, /Save/);
  assert.match(markup, /<label/);
  const bundle = readFileSync(join(root, "dist/index.js"), "utf8");
  assert.match(bundle, /["']use client["']/);
  assert.match(bundle, /from\s*["']react/);
  console.log(
    "Packed consumer passed: exports, TypeScript, CSS, Vite build, and server rendering.",
  );
} catch (error) {
  if (error.stdout) process.stderr.write(error.stdout);
  if (error.stderr) process.stderr.write(error.stderr);
  throw error;
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
