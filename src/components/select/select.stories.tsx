import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./select.js";

const meta = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  args: { label: "Output format" },
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))",
        gap: "1.5rem",
        maxWidth: "38rem",
      }}
    >
      <Select label="Filled (default)" defaultValue="text">
        <option value="text">Plain text</option>
        <option value="json">JSON</option>
      </Select>
      <Select label="Outlined" variant="outline" defaultValue="json">
        <option value="text">Plain text</option>
        <option value="json">JSON</option>
      </Select>
      <Select label="Invalid" error="Choose a format." defaultValue="">
        <option value="">Choose a format</option>
        <option value="text">Plain text</option>
      </Select>
      <Select label="Disabled" disabled defaultValue="text">
        <option value="text">Plain text</option>
      </Select>
    </div>
  ),
};
