import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion } from "./accordion.js";

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  args: {
    label: "Output details",
    items: [
      { value: "summary", title: "Summary", content: "All checks passed." },
      { value: "output", title: "Output", content: <pre>7 tests passed</pre> },
      {
        value: "unavailable",
        title: "Artifacts (unavailable)",
        content: "No artifacts",
        disabled: true,
      },
    ],
  },
} satisfies Meta<typeof Accordion>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Multiple: Story = {
  args: { multiple: true, defaultValue: ["summary", "output"] },
};
