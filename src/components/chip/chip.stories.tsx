import { useState } from "react";
import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chip } from "./chip.js";

const Example = (): ReactElement => {
  const [items, setItems] = useState(["Belgium", "France", "Italy"]);
  return (
    <div style={{ display: "flex", gap: ".5rem" }}>
      {items.map((item) => (
        <Chip
          key={item}
          onRemove={() => {
            setItems(items.filter((value) => value !== item));
          }}
          removeLabel={`Remove ${item}`}
        >
          {item}
        </Chip>
      ))}
      <Chip>Read-only</Chip>
    </div>
  );
};
const meta = {
  title: "Components/Chip",
  component: Chip,
  tags: ["autodocs"],
  render: Example,
} satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = { args: { children: "Belgium" } };
