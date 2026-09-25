import type { Meta, StoryObj } from "@storybook/react-vite";
import { TreeView } from "./tree-view.js";

const meta = {
  title: "Components/TreeView",
  component: TreeView,
  tags: ["autodocs"],
  args: {
    label: "Project outline",
    defaultExpandedIds: ["project"],
    nodes: [
      {
        id: "project",
        label: "Project",
        children: [
          { id: "readme", label: "README.md" },
          {
            id: "src",
            label: "src",
            children: [
              { id: "app", label: "App.tsx" },
              { id: "styles", label: "styles.css" },
            ],
          },
        ],
      },
      { id: "archive", label: "Archive", disabled: true },
    ],
  },
} satisfies Meta<typeof TreeView>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  render: (args) => <TreeView {...args} className="" />,
};
