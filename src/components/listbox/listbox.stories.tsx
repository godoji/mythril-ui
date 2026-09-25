import type { Meta, StoryObj } from "@storybook/react-vite";
import { Listbox } from "./listbox.js";

const meta = {
  title: "Components/Listbox",
  component: Listbox,
  tags: ["autodocs"],
  args: {
    label: "Open view",
    defaultValue: "history",
    options: [
      { value: "history", label: "History", description: "Recent activity" },
      { value: "output", label: "Full output", description: "Complete log" },
      { value: "disabled", label: "Unavailable view", disabled: true },
    ],
  },
} satisfies Meta<typeof Listbox>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  render: (args) => (
    <div style={{ width: "18rem" }}>
      <Listbox {...args} />
    </div>
  ),
};
