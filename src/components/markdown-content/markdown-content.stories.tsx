import type { Meta, StoryObj } from "@storybook/react-vite";
import { MarkdownContent } from "./markdown-content.js";

const meta = {
  title: "Components/MarkdownContent",
  component: MarkdownContent,
  tags: ["autodocs"],
  args: {
    content:
      "## Review\n\nRead the [guide](https://example.com) before continuing.\n\n- Check the output\n- Run `npm test`\n\n> Keep the result concise.\n\n| Check | Result |\n| --- | --- |\n| Types | Passed |",
  },
} satisfies Meta<typeof MarkdownContent>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
