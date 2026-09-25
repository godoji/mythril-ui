import type { Meta, StoryObj } from "@storybook/react-vite";
import { Play, Settings2, Trash2 } from "lucide-react";
import { IconButton } from "./icon-button.js";
const meta = {
  title: "Components/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  parameters: { controls: { disable: true } },
  argTypes: { icon: { control: false } },
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  args: { icon: Play, label: "Run action" },
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <IconButton icon={Play} label="Run action" />
      <IconButton icon={Settings2} label="Settings" size="small" />
      <IconButton icon={Trash2} label="Delete item" variant="danger" />
      <IconButton icon={Play} label="Run unavailable" disabled />
    </div>
  ),
};
