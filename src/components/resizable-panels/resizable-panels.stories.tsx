import type { Meta, StoryObj } from "@storybook/react-vite";
import { ResizablePanels } from "./resizable-panels.js";

const paneStyle = {
  padding: "0.75rem",
  height: "100%",
  boxSizing: "border-box",
} as const;
const meta = {
  title: "Components/ResizablePanels",
  component: ResizablePanels,
  tags: ["autodocs"],
  parameters: { controls: { disable: true } },
  args: {
    primaryLabel: "Navigation pane",
    primary: <div style={paneStyle}>Navigation</div>,
    secondary: <div style={paneStyle}>Editor content</div>,
    collapsible: true,
    style: { height: "18rem", border: "1px solid var(--mythril-divider)" },
  },
} satisfies Meta<typeof ResizablePanels>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "1.5rem", maxWidth: "48rem" }}>
      <div>
        <p>
          Horizontal split: drag, use arrow keys, or press Enter to collapse.
        </p>
        <ResizablePanels {...args} />
      </div>
      <div>
        <p>Vertical split</p>
        <ResizablePanels
          {...args}
          orientation="vertical"
          defaultSize={110}
          minSize={60}
        />
      </div>
    </div>
  ),
};
