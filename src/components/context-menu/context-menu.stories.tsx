import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, userEvent, within } from "storybook/test";
import { ContextMenu } from "./context-menu.js";

const meta = {
  title: "Components/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
  args: {
    label: "File actions",
    children: (
      <button
        type="button"
        style={{
          padding: "2rem",
          width: "16rem",
          border: "1px solid var(--mythril-divider)",
        }}
      >
        Right-click here, or focus and press Shift+F10.
      </button>
    ),
    items: [
      { id: "copy", label: "Copy path", onSelect: fn() },
      { id: "rename", label: "Rename", onSelect: fn() },
      { id: "delete", label: "Delete", danger: true, onSelect: fn() },
    ],
  },
} satisfies Meta<typeof ContextMenu>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};

export const Open: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.pointer({
      keys: "[MouseRight]",
      target: within(canvasElement).getByRole("button"),
    });
  },
};
