import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextInput } from "./text-input.js";

const meta = {
  title: "Components/TextInput",
  component: TextInput,
  tags: ["autodocs"],
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof TextInput>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  args: { label: "Project name" },
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))",
        gap: "1.5rem",
        maxWidth: "38rem",
      }}
    >
      <TextInput label="Filled (default)" placeholder="My project" />
      <TextInput label="Outlined" variant="outline" placeholder="My project" />
      <TextInput
        label="With hint"
        description="A short, recognizable name."
        defaultValue="Anvil"
      />
      <TextInput label="Invalid" error="Enter a project name." required />
      <TextInput label="Disabled" value="Locked" readOnly disabled />
    </div>
  ),
};
