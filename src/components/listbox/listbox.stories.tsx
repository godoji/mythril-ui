import type { Meta, StoryObj } from "@storybook/react-vite";
import { Listbox } from "./listbox.js";
import { Button } from "../button/button.js";

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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 18rem), 1fr))",
        gap: "1rem",
        maxWidth: "40rem",
      }}
    >
      <form style={{ display: "grid", gap: "0.75rem" }}>
        <Listbox {...args} name="view" />
        <Button type="reset">Reset</Button>
      </form>
      <Listbox {...args} label="Disabled views" disabled />
    </div>
  ),
};
