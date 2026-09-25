import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.js";
import { TextInput } from "../text-input/text-input.js";
import { Select } from "../select/select.js";
import {
  Card,
  FilterBar,
  FormActions,
  FormRow,
  PageHeader,
} from "./editor-layout.js";

const meta = {
  title: "Components/Editor layout",
  component: PageHeader,
  tags: ["autodocs"],
} satisfies Meta<typeof PageHeader>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  args: { title: "Products" },
  render: () => (
    <div style={{ maxWidth: "48rem" }}>
      <PageHeader
        title="Products"
        description="Manage the catalog."
        actions={<Button variant="primary">New product</Button>}
      />
      <FilterBar label="Product filters">
        <TextInput label="Search" placeholder="Search products" />
        <Select label="Status">
          <option>All</option>
          <option>Active</option>
        </Select>
      </FilterBar>
      <Card
        title="Product details"
        description="Fields share a compact row layout."
      >
        <FormRow label="Identifier" hint="Unique within the catalog">
          <TextInput
            label="Identifier"
            labelHidden
            id="product-id"
            defaultValue="wine-01"
          />
        </FormRow>
        <FormRow label="Name">
          <TextInput label="Name" labelHidden defaultValue="Sample wine" />
        </FormRow>
        <FormActions align="end">
          <Button>Discard</Button>
          <Button variant="primary">Save</Button>
        </FormActions>
      </Card>
    </div>
  ),
};
