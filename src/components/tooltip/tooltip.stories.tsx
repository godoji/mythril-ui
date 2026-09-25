import { useRef } from "react";
import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.js";
import { Tooltip } from "./tooltip.js";
import type { TooltipProps } from "./tooltip.js";

const ConstrainedExample = (props: TooltipProps): ReactElement => {
  const boundary = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={boundary}
      style={{
        width: 240,
        height: 120,
        padding: 8,
        border: "1px dashed currentColor",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
      }}
    >
      <Tooltip {...props} boundary={boundary} />
    </div>
  );
};
const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  args: {
    label: "Download a copy of the full output",
    children: <Button>Export</Button>,
  },
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const ConstrainedContainer: Story = {
  render: (args) => <ConstrainedExample {...args} />,
};
export const Disabled: Story = {
  args: {
    disabled: true,
    label: "Output is not available yet",
    children: <Button disabled>Export</Button>,
  },
};
