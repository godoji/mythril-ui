import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeText } from "./code-text.js";
import { Stack } from "../stack/stack.js";

const meta = {
  title: "Components/CodeText",
  component: CodeText,
} satisfies Meta<typeof CodeText>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  args: { code: "$ go test ./internal/workflow\nok workflow 0.42s" },
  render: (args) => (
    <Stack gap="4">
      <CodeText {...args} aria-label="Command output" />
      <CodeText code="read internal/workflow/runner.go" tone="muted" />
      <CodeText code="Command exited with status 1" tone="danger" />
      <CodeText
        aria-label="Patch preview"
        format="diff"
        code={
          "*** Update File: runner.go\n@@\n-oldName()\n+clearName()\n context()"
        }
      />
    </Stack>
  ),
};
