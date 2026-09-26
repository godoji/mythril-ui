import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert, Notice } from "./notice.js";

const meta = {
  title: "Components/Notice",
  component: Notice,
  tags: ["autodocs"],
  args: {
    title: "Review the result",
    children: "The output is ready for your review.",
    tone: "info",
  },
} satisfies Meta<typeof Notice>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Warning: Story = {
  args: {
    title: "Changes are pending",
    children: "Review the changes before continuing.",
    tone: "warning",
  },
};
export const Error: Story = {
  args: {
    title: "Unable to save",
    children: "Try again after checking the connection.",
    tone: "danger",
    role: "alert",
  },
};
export const Success: Story = { args: { title: "Saved", tone: "success" } };

export const AlertMessage: Story = {
  render: () => (
    <Alert title="Unable to save" tone="danger">
      Check the connection and try again.
    </Alert>
  ),
};
