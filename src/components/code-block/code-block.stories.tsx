import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeBlock } from "./code-block.js";

const meta = {
  title: "Components/CodeBlock",
  component: CodeBlock,
  tags: ["autodocs"],
  args: {
    label: "Build output",
    language: "text",
    code: "Checking types…\nBuilding package…\n7 tests passed.",
  },
} satisfies Meta<typeof CodeBlock>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const LongOutput: Story = {
  args: {
    code: Array.from(
      { length: 1200 },
      (_, index) =>
        `${String(index + 1)}: checking file ${String(index + 1)} — passed`,
    ).join("\n"),
    previewLimit: 1000,
  },
};
export const Wrapped: Story = {
  args: {
    code: "A very long line of output. ".repeat(100),
    wrap: true,
    previewLimit: 500,
  },
};
