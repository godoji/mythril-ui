import { useRef } from "react";
import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.js";
import { Checkbox } from "../checkbox/checkbox.js";
import { Popover } from "./popover.js";
import type { PopoverProps } from "./popover.js";

const ConstrainedExample = (props: PopoverProps): ReactElement => {
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
      <Popover {...props} boundary={boundary} />
    </div>
  );
};
const meta = {
  title: "Components/Popover",
  component: Popover,
  tags: ["autodocs"],
  args: {
    label: "Display options",
    trigger: <Button>Display options</Button>,
    children: <Checkbox label="Show timestamps" defaultChecked />,
  },
} satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const ConstrainedContainer: Story = {
  render: (args) => <ConstrainedExample {...args} />,
};
export const HoverAndKeyboard: Story = {
  args: {
    openOn: "hover",
    trigger: <Button>Account</Button>,
    label: "Account options",
    children: <Button>Sign out</Button>,
  },
};

export const Open: Story = {
  args: { defaultOpen: true },
};
