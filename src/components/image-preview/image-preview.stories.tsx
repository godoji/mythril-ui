import type { Meta, StoryObj } from "@storybook/react-vite";
import { ImagePreview } from "./image-preview.js";
import samplePreview from "./sample-preview.png";

const meta = {
  title: "Components/ImagePreview",
  component: ImagePreview,
  tags: ["autodocs"],
} satisfies Meta<typeof ImagePreview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  args: {
    src: samplePreview,
    alt: "Abstract landscape illustration",
    caption: "Preview",
    onRemove: () => {},
  },
};
