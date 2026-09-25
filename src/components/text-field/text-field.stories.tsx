import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "./text-field.js";

const meta = {
  title: "Components/TextField",
  component: TextField,
  tags: ["autodocs"],
  args: { label: "Project name", placeholder: "My project" },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithDescription: Story = {
  args: { description: "A short name to identify your project." },
};
export const Invalid: Story = {
  args: { error: "Enter a project name.", required: true },
};
export const Disabled: Story = { args: { disabled: true } };
