import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress } from "./progress.js";
import { Stack } from "../stack/stack.js";

const meta = {
  title: "Components/Progress",
  component: Progress,
  tags: ["autodocs"],
} satisfies Meta<typeof Progress>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  args: { label: "Task progress" },
  render: () => (
    <Stack style={{ maxWidth: "24rem" }}>
      {[
        { label: "Starting", value: 0 },
        { label: "Processing", value: 0.4 },
        { label: "Complete", value: 1 },
        { label: "Indeterminate" },
      ].map(({ label, value }) => (
        <Stack gap="2" key={label}>
          <span>{label}</span>
          <Progress label={label} {...(value !== undefined && { value })} />
        </Stack>
      ))}
    </Stack>
  ),
};
