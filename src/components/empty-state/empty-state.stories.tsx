import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.js";
import { EmptyState } from "./empty-state.js";

const meta = {
  title: "Components/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  args: {
    title: "No products found",
    description: "Try another search or add a product.",
    actions: <Button size="small">Clear filters</Button>,
  },
};
