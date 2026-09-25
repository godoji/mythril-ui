import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoadingState } from "./loading-state.js";

const meta = {
  title: "Components/LoadingState",
  component: LoadingState,
  tags: ["autodocs"],
} satisfies Meta<typeof LoadingState>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  args: { label: "Loading orders…" },
  render: () => (
    <div style={{ display: "grid", gap: "1rem" }}>
      <LoadingState label="Loading orders…" />
      <LoadingState label="Refreshing" inline />
    </div>
  ),
};
