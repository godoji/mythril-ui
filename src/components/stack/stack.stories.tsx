import type { Meta, StoryObj } from "@storybook/react-vite";
import type { StackGap } from "./stack.js";
import { Stack } from "./stack.js";

const meta = {
  title: "Components/Stack",
  component: Stack,
  tags: ["autodocs"],
} satisfies Meta<typeof Stack>;
export default meta;
type Story = StoryObj<typeof meta>;

const gaps: StackGap[] = ["1", "2", "3", "4", "6", "8"];

export const Overview: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem", maxWidth: "24rem" }}>
      {gaps.map((gap) => (
        <div key={gap}>
          <strong>Gap {gap}</strong>
          <Stack gap={gap}>
            <div>Review guidance</div>
            <div>Next stage</div>
            <div>Actions</div>
          </Stack>
        </div>
      ))}
    </div>
  ),
};
