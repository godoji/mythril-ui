import { useState } from "react";
import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { NumberField } from "./number-field.js";
import { Stack } from "../stack/stack.js";
const Example = (): ReactElement => {
  const [price, setPrice] = useState("12,50");
  return (
    <Stack>
      <NumberField
        label="Price in euros"
        prefix="€"
        decimalSeparator=","
        value={price}
        onValueChange={setPrice}
      />
      <NumberField
        label="Weight in kilograms"
        suffix="kg"
        value="0.75"
        onValueChange={() => {}}
        readOnly
      />
      <NumberField
        label="Tax rate in percent"
        suffix="%"
        value="invalid"
        onValueChange={() => {}}
        error="Enter a decimal number."
      />
      <NumberField
        label="Disabled amount"
        value="20"
        onValueChange={() => {}}
        disabled
      />
    </Stack>
  );
};
const meta = {
  title: "Components/NumberField",
  component: NumberField,
  tags: ["autodocs"],
} satisfies Meta<typeof NumberField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  args: { label: "Amount", value: "", onValueChange: () => {} },
  render: () => <Example />,
};
