import { useRef } from "react";
import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, userEvent, within } from "storybook/test";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../button/button.js";
import { IconButton } from "../icon-button/icon-button.js";
import { Menu } from "./menu.js";
import type { MenuProps } from "./menu.js";

const ConstrainedExample = (props: MenuProps): ReactElement => {
  const boundary = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={boundary}
      style={{
        width: 240,
        height: 180,
        padding: 8,
        border: "1px dashed currentColor",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
      }}
    >
      <Menu {...props} trigger={<Button>Actions</Button>} boundary={boundary} />
    </div>
  );
};
const meta = {
  title: "Components/Menu",
  component: Menu,
  tags: ["autodocs"],
  args: {
    label: "Output actions",
    trigger: <IconButton icon={MoreHorizontal} label="Output actions" />,
    items: [
      { id: "copy", label: "Copy output", onSelect: fn() },
      { id: "export", label: "Export output", onSelect: fn() },
      {
        id: "share",
        label: "Share (unavailable)",
        disabled: true,
        onSelect: fn(),
      },
      { id: "delete", label: "Delete output", danger: true, onSelect: fn() },
    ],
  },
} satisfies Meta<typeof Menu>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const ConstrainedContainer: Story = {
  render: (args) => <ConstrainedExample {...args} />,
};

export const Open: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Output actions" }),
    );
    await userEvent.keyboard("{ArrowDown}");
  },
};
