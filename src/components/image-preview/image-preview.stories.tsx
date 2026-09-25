import type { Meta, StoryObj } from "@storybook/react-vite";
import { ImagePreview } from "./image-preview.js";
import sampleProduct from "./sample-product.png";

const meta = {
  title: "Components/ImagePreview",
  component: ImagePreview,
  tags: ["autodocs"],
} satisfies Meta<typeof ImagePreview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  args: {
    src: sampleProduct,
    alt: "Illustrated product placeholder",
    caption: "Preview",
    onRemove: () => {},
  },
};
