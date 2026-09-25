import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs } from "./tabs.js";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  args: {
    label: "Details",
    items: [
      {
        value: "history",
        label: "History",
        content: "Recent activity appears here.",
      },
      {
        value: "output",
        label: "Output",
        content: "Full output appears here.",
      },
      {
        value: "artifacts",
        label: "Artifacts",
        content: "No artifacts yet.",
        disabled: true,
      },
    ],
  },
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Segmented: Story = { args: { variant: "segmented" } };
