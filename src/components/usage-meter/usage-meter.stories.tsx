import type { Meta, StoryObj } from "@storybook/react-vite";
import { UsageMeter } from "./usage-meter.js";

const meta = {
  title: "Components/UsageMeter",
  component: UsageMeter,
  tags: ["autodocs"],
  args: { label: "Context usage", value: 32000, max: 128000, unit: "tokens" },
} satisfies Meta<typeof UsageMeter>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Empty: Story = { args: { value: 0 } };
export const Unavailable: Story = { args: { value: null } };
export const NearLimit: Story = { args: { value: 110000 } };
export const OverLimit: Story = { args: { value: 140000 } };
