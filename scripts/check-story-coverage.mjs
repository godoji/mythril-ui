import { existsSync, readFileSync } from "node:fs";

const exports = readFileSync(
  new URL("../src/index.ts", import.meta.url),
  "utf8",
);
const missing = [];
const storyIds = new Set();
const toId = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const componentExports =
  /export\s*\{([^}]+)\}\s*from\s*"\.\/components\/([^/]+)\/[^"]+";/gs;

for (const [, names, directory] of exports.matchAll(componentExports)) {
  const path = new URL(
    `../src/components/${directory}/${directory}.stories.tsx`,
    import.meta.url,
  );
  if (!existsSync(path)) {
    missing.push(`${directory}: story file`);
    continue;
  }
  const story = readFileSync(path, "utf8");
  const title = story.match(/title:\s*"(Components\/[^"]+)"/)?.[1];
  if (title) {
    for (const [, name] of story.matchAll(/export const (\w+)/g)) {
      storyIds.add(
        `${toId(title)}--${toId(name.replace(/([a-z0-9])([A-Z])/g, "$1-$2"))}`,
      );
    }
  }
  for (const name of names.split(",").map((part) => part.trim())) {
    if (!/^[A-Z]/.test(name)) continue;
    if (!new RegExp(`<${name}\\b|component:\\s*${name}\\b`).test(story)) {
      missing.push(`${directory}: ${name}`);
    }
  }
}

const catalog = readFileSync(
  new URL("../src/examples/component-catalog.ts", import.meta.url),
  "utf8",
);
for (const [, id] of catalog.matchAll(/href: "\?path=\/story\/([^"]+)"/g)) {
  if (!storyIds.has(id))
    missing.push(`component directory: broken story link ${id}`);
}

if (missing.length > 0) {
  console.error(`Missing Storybook coverage:\n${missing.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log("Every exported component is represented in Storybook.");
}
