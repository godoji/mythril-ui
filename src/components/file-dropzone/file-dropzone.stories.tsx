import { useState } from "react";
import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileDropzone } from "./file-dropzone.js";

const Example = (): ReactElement => {
  const [files, setFiles] = useState<string[]>([]);
  return (
    <div style={{ width: "24rem" }}>
      <FileDropzone
        label="Product image"
        description="Choose or drop an image. No upload occurs in this story."
        accept="image/*"
        onFiles={(chosen) => {
          setFiles(chosen.map((file) => file.name));
        }}
      />
      {files.length > 0 && <p role="status">Selected: {files.join(", ")}</p>}
    </div>
  );
};
const meta = {
  title: "Components/FileDropzone",
  component: FileDropzone,
  tags: ["autodocs"],
  render: Example,
} satisfies Meta<typeof FileDropzone>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  args: { label: "Product image", onFiles: () => {} },
};
