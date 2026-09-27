import { Star } from "lucide-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChoiceButton } from "./choice-button.js";

const meta = {
  title: "Components/ChoiceButton",
  component: ChoiceButton,
  tags: ["autodocs"],
  args: { label: "Continue to implementation" },
} satisfies Meta<typeof ChoiceButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "0.5rem", maxWidth: "32rem" }}>
      <ChoiceButton label="Continue to implementation" />
      <ChoiceButton
        label="Return to planning"
        description="Revisit the previous stage"
        highlighted
        trailing={<Star size={14} aria-label="Suggested" />}
      />
      <ChoiceButton label="Unavailable route" disabled />
    </div>
  ),
};
