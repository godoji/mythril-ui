import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./textarea.js";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  args: { label: "Notes" },
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
        gap: "1.5rem",
        maxWidth: "44rem",
      }}
    >
      <Textarea label="Filled (default)" placeholder="Add context…" />
      <Textarea
        label="Manually resizable"
        resizable
        placeholder="Resize vertically…"
      />
      <Textarea label="Outlined" variant="outline" placeholder="Add context…" />
      <Textarea label="Invalid" error="Notes are required." required />
      <Textarea label="Disabled" value="Locked" readOnly disabled />
      <Textarea
        label="Auto-resizing"
        autoResize
        rows={1}
        maxRows={5}
        placeholder="Type several lines…"
      />
    </div>
  ),
};
