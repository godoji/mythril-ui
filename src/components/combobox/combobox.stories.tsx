import type { Meta, StoryObj } from "@storybook/react-vite";
import { Combobox } from "./combobox.js";
import { Button } from "../button/button.js";

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
    <form
      style={{
        width: "18rem",
        maxWidth: "100%",
        display: "grid",
        gap: "0.75rem",
      }}
    >
      <Combobox {...args} name="task" defaultValue="history" />
      <Button type="reset">Reset</Button>
    </form>
  ),
};
