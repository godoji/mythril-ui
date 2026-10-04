import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.js";
import { Checkbox } from "../checkbox/checkbox.js";
import { Chip } from "../chip/chip.js";
import { ChoiceButton } from "../choice-button/choice-button.js";
import { CodeBlock } from "../code-block/code-block.js";
import { Combobox } from "../combobox/combobox.js";
import { Card } from "../editor-layout/editor-layout.js";
import { Inline } from "../inline/inline.js";
import { Listbox } from "../listbox/listbox.js";
import { Notice } from "../notice/notice.js";
import { Popover } from "../popover/popover.js";
import { Progress } from "../progress/progress.js";
import { Select } from "../select/select.js";
import { Stack } from "../stack/stack.js";
import { StatusBadge } from "../status-badge/status-badge.js";
import { Tabs } from "../tabs/tabs.js";
import { TextInput } from "../text-input/text-input.js";
import { Theme } from "./theme.js";

const meta = {
  title: "Components/Theme",
  component: Theme,
  tags: ["autodocs"],
} satisfies Meta<typeof Theme>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  args: { children: null },
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 24rem), 1fr))",
        gap: "1rem",
        maxWidth: "64rem",
      }}
    >
      {(["dark", "light"] as const).map((mode) => (
        <Theme
          key={mode}
          mode={mode}
          role="group"
          aria-label={`${mode} components`}
          style={{
            padding: "1rem",
            minWidth: 0,
            borderRadius: "var(--mythril-radius-panel)",
          }}
        >
          <Stack gap="4">
            <strong>{mode === "dark" ? "Dark" : "Light"}</strong>
            <Card title="Controls">
              <Stack>
                <Inline>
                  <Button variant="ghost">Unselected</Button>
                  <Button variant="ghost" aria-pressed>
                    Selected
                  </Button>
                  <Button variant="primary">Primary</Button>
                  <Button size="small">Compact</Button>
                </Inline>
                <TextInput label="Name" defaultValue="Workspace" />
                <Select label="Format">
                  <option>Text</option>
                  <option>JSON</option>
                </Select>
                <Combobox
                  label="Owner"
                  defaultValue="alpha"
                  options={[
                    { value: "alpha", label: "Alpha" },
                    { value: "beta", label: "Beta" },
                  ]}
                />
                <Checkbox label="Notifications" defaultChecked />
                <ChoiceButton label="Open workspace" />
                <Tabs
                  label="View"
                  variant="segmented"
                  items={[
                    {
                      value: "list",
                      label: "List",
                      content: (
                        <Inline>
                          <Chip>Design</Chip>
                          <StatusBadge tone="success">Ready</StatusBadge>
                        </Inline>
                      ),
                    },
                    { value: "grid", label: "Grid", content: "Grid view" },
                  ]}
                />
              </Stack>
            </Card>
            <Listbox
              label="Destination"
              defaultValue="alpha"
              options={[
                { value: "alpha", label: "Alpha" },
                { value: "beta", label: "Beta" },
              ]}
            />
            <Notice tone="success">Changes saved</Notice>
            <CodeBlock code="Build completed" label="Output" />
            <Progress label="Processing" value={0.6} />
            <Popover label="Options" trigger={<Button>Options</Button>}>
              <Checkbox label="Show archived" />
            </Popover>
          </Stack>
        </Theme>
      ))}
    </div>
  ),
};
