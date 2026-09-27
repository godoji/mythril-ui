import { useState } from "react";
import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CollectionEditor } from "./collection-editor.js";
import { TextInput } from "../text-input/text-input.js";
const Example = (): ReactElement => {
  const [items, setItems] = useState([
    { id: "one", title: "Featured collection" },
    { id: "two", title: "Meet the makers" },
  ]);
  return (
    <CollectionEditor
      label="Page sections"
      items={items.map((item) => ({
        id: item.id,
        label: item.title || "Untitled section",
        content: (
          <TextInput
            label="Section title"
            value={item.title}
            onChange={(event) => {
              setItems(
                items.map((entry) =>
                  entry.id === item.id
                    ? { ...entry, title: event.currentTarget.value }
                    : entry,
                ),
              );
            }}
          />
        ),
      }))}
      onMove={(id, to) => {
        const item = items.find((entry) => entry.id === id);
        if (!item) return;
        const next = items.filter((entry) => entry.id !== id);
        next.splice(to, 0, item);
        setItems(next);
      }}
      onRemove={(id) => {
        setItems(items.filter((entry) => entry.id !== id));
      }}
      onAdd={() => {
        setItems([...items, { id: crypto.randomUUID(), title: "New section" }]);
      }}
    />
  );
};
const meta = {
  title: "Components/CollectionEditor",
  component: CollectionEditor,
  tags: ["autodocs"],
} satisfies Meta<typeof CollectionEditor>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  args: { label: "Sections", items: [], onMove: () => {}, onRemove: () => {} },
  render: () => <Example />,
};
