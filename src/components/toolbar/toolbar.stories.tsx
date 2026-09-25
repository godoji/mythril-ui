import { useState } from "react";
import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bold, Copy, Eye, Italic } from "lucide-react";
import { Toolbar } from "./toolbar.js";
import { ToggleButton } from "./toggle-button.js";

const Example = (): ReactElement => {
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [preview, setPreview] = useState(false);
  return (
    <div style={{ display: "grid", justifyItems: "start", gap: "1rem" }}>
      <Toolbar
        label="Editor commands"
        items={[
          {
            id: "bold",
            label: "Bold",
            icon: Bold,
            shortcut: "⌘B",
            pressed: bold,
            onPress: () => {
              setBold(!bold);
            },
          },
          {
            id: "italic",
            label: "Italic",
            icon: Italic,
            shortcut: "⌘I",
            pressed: italic,
            onPress: () => {
              setItalic(!italic);
            },
          },
          { id: "copy", label: "Copy", icon: Copy, onPress: () => {} },
          {
            id: "preview",
            label: "Preview",
            icon: Eye,
            pressed: preview,
            onPress: () => {
              setPreview(!preview);
            },
          },
        ]}
      />
      <ToggleButton icon={Eye}>Show preview</ToggleButton>
    </div>
  );
};
const meta = {
  title: "Components/Toolbar",
  component: Toolbar,
  tags: ["autodocs"],
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof Toolbar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  args: { label: "Editor commands", items: [] },
  render: () => <Example />,
};
