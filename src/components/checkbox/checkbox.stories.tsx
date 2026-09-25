import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./checkbox.js";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: {
    label: "Include timestamps",
    description: "Add a time to each output line.",
  },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Mixed: Story = { args: { indeterminate: true } };
export const Invalid: Story = { args: { error: "Confirm before continuing." } };
export const Disabled: Story = { args: { disabled: true } };
