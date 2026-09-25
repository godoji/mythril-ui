import { useState } from "react";
import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { EntityPicker } from "./entity-picker.js";
import type { EntityPickerOption } from "./entity-picker.js";

const catalog: EntityPickerOption[] = [
  { value: "grape", label: "Grape", description: "Product category" },
  { value: "country", label: "Country", description: "Product category" },
  { value: "wine", label: "Wine", description: "Product category" },
];
const Example = (): ReactElement => {
  const [selected, setSelected] = useState<EntityPickerOption[]>([]);
  const [query, setQuery] = useState("");
  return (
    <div style={{ width: "20rem" }}>
      <EntityPicker
        label="Related items"
        selected={selected}
        onSelectedChange={setSelected}
        query={query}
        onQueryChange={setQuery}
        options={catalog.filter((item) =>
          item.label.toLowerCase().includes(query.toLowerCase()),
        )}
        maxSelected={3}
      />
    </div>
  );
};
const meta = {
  title: "Components/EntityPicker",
  component: EntityPicker,
  tags: ["autodocs"],
  render: Example,
} satisfies Meta<typeof EntityPicker>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  args: {
    label: "Related items",
    selected: [],
    options: [],
    onSelectedChange: () => {},
  },
};
