import type { Meta, StoryObj } from "@storybook/react-vite";
import { Combobox } from "./combobox.js";

const meta = {
  title: "Components/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  args: {
    label: "Open task",
    placeholder: "Search tasks…",
    options: [
      {
        value: "history",
        label: "Review task history",
        description: "Recently updated",
      },
      {
        value: "pipeline",
        label: "Edit pipeline",
        description: "Configuration",
      },
      { value: "logs", label: "Inspect command logs", description: "Output" },
      { value: "disabled", label: "Unavailable task", disabled: true },
    ],
  },
} satisfies Meta<typeof Combobox>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  render: (args) => (
    <div style={{ width: "18rem" }}>
      <Combobox {...args} />
    </div>
  ),
};
