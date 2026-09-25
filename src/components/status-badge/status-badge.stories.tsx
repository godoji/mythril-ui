import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusBadge } from "./status-badge.js";

const meta = {
  title: "Components/StatusBadge",
  component: StatusBadge,
  tags: ["autodocs"],
  args: { children: "Queued", tone: "neutral" },
} satisfies Meta<typeof StatusBadge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Running: Story = { args: { children: "Running", tone: "info" } };
export const Complete: Story = {
  args: { children: "Complete", tone: "success" },
};
export const Review: Story = {
  args: { children: "Needs review", tone: "warning" },
};
export const Failed: Story = { args: { children: "Failed", tone: "danger" } };
