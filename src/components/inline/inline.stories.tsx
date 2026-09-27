import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.js";
import { Select } from "../select/select.js";
import { Inline } from "./inline.js";

const meta = {
  title: "Components/Inline",
  component: Inline,
  tags: ["autodocs"],
} satisfies Meta<typeof Inline>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem", maxWidth: "32rem" }}>
      <div>
        <strong>Center aligned</strong>
        <Inline>
          <Select label="Next stage" defaultValue="implement">
            <option value="implement">Continue to Implement</option>
          </Select>
          <Button>Prepare next stage</Button>
        </Inline>
      </div>
      <div>
        <strong>Bottom aligned</strong>
        <Inline align="end">
          <Select label="Next stage" defaultValue="implement">
            <option value="implement">Continue to Implement</option>
          </Select>
          <Button>Prepare next stage</Button>
        </Inline>
      </div>
    </div>
  ),
};
