import type { Meta, StoryObj } from "@storybook/react-vite";
import { DescriptionList } from "./description-list.js";

const meta = {
  title: "Components/DescriptionList",
  component: DescriptionList,
  tags: ["autodocs"],
} satisfies Meta<typeof DescriptionList>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  args: {
    items: [
      { label: "Order", value: "#128" },
      { label: "Customer", value: "Alex" },
      { label: "Reference", value: null },
    ],
  },
};
