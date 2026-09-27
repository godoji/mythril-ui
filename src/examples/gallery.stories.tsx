import { useState } from "react";
import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus, Settings, Send } from "lucide-react";
import {
  Button,
  Card,
  Checkbox,
  Chip,
  Combobox,
  Dialog,
  EntityPicker,
  Grid,
  IconButton,
  Inline,
  Notice,
  PageContainer,
  PageHeader,
  Popover,
  Select,
  Stack,
  StatusBadge,
  Tabs,
  Textarea,
  TextInput,
  Tooltip,
} from "../index.js";
import type { EntityPickerOption } from "../index.js";
const Gallery = (): ReactElement => {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<EntityPickerOption[]>([
    { value: "design", label: "Design" },
  ]);
  const [count, setCount] = useState(0);
  return (
    <PageContainer width="wide">
      <Stack gap="6">
        <PageHeader
          title="Component gallery"
          description="A working overview of everyday controls. Try the interactions, or use the directory for complete API documentation."
        />
        <Grid minColumnWidth="22rem">
          <Card title="Actions">
            <Stack>
              <Inline>
                <Button
                  variant="primary"
                  onClick={() => {
                    setCount(count + 1);
                  }}
                >
                  Primary
                </Button>
                <Button
                  icon={Plus}
                  onClick={() => {
                    setCount(count + 1);
                  }}
                >
                  Add item
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setCount(0);
                  }}
                >
                  Reset
                </Button>
                <Button disabled>Disabled</Button>
              </Inline>
              <Inline>
                <IconButton
                  icon={Settings}
                  label="Open settings"
                  onClick={() => {
                    setOpen(true);
                  }}
                />
                <IconButton
                  icon={Send}
                  label="Send"
                  shape="circle"
                  variant="primary"
                  onClick={() => {
                    setCount(count + 1);
                  }}
                />
                <Tooltip label="Keyboard and pointer accessible">
                  <Button>Tooltip</Button>
                </Tooltip>
              </Inline>
              <p role="status">{String(count)} actions</p>
            </Stack>
          </Card>
          <Card title="Fields">
            <Stack>
              <TextInput label="Project name" placeholder="Untitled project" />
              <Inline align="end">
                <Select label="Visibility">
                  <option>Private</option>
                  <option>Public</option>
                </Select>
                <Button
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Configure
                </Button>
              </Inline>
              <Checkbox label="Enable notifications" defaultChecked />
              <TextInput
                label="Slug"
                defaultValue="already-taken"
                error="This identifier is already in use."
              />
              <Textarea
                label="Notes"
                autoResize
                placeholder="Add a few notes…"
              />
            </Stack>
          </Card>
          <Card title="Selection">
            <Stack>
              <Combobox
                label="Owner"
                options={[
                  { value: "alex", label: "Alex" },
                  { value: "sam", label: "Sam" },
                  { value: "jules", label: "Jules" },
                ]}
              />
              <EntityPicker
                label="Labels"
                selected={tags}
                onSelectedChange={setTags}
                layout="inline"
                filterMode="prefix"
                options={[
                  { value: "design", label: "Design" },
                  { value: "engineering", label: "Engineering" },
                  { value: "support", label: "Support" },
                ]}
              />
              <Inline>
                <Chip>Read only</Chip>
                <StatusBadge tone="success">Active</StatusBadge>
                <StatusBadge tone="warning">Draft</StatusBadge>
                <StatusBadge tone="danger">Failed</StatusBadge>
              </Inline>
            </Stack>
          </Card>
          <Card title="Overlays and feedback">
            <Stack>
              <Inline>
                <Button
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Open dialog
                </Button>
                <Popover
                  label="Quick settings"
                  trigger={<Button>Open popover</Button>}
                >
                  <Stack>
                    <Checkbox label="Compact view" defaultChecked />
                    <Checkbox label="Show archived" />
                  </Stack>
                </Popover>
              </Inline>
              <Notice tone="info">
                Your changes are saved locally in this example.
              </Notice>
              <Notice tone="warning">Two fields need your attention.</Notice>
              <Tabs
                label="Details"
                items={[
                  {
                    value: "overview",
                    label: "Overview",
                    content: "Tab panels keep their state when switching.",
                  },
                  {
                    value: "activity",
                    label: "Activity",
                    content: "No recent activity.",
                  },
                ]}
              />
            </Stack>
          </Card>
        </Grid>
      </Stack>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Project settings"
        footer={
          <Button
            variant="primary"
            onClick={() => {
              setOpen(false);
            }}
          >
            Done
          </Button>
        }
      >
        <Stack>
          <TextInput label="Name" defaultValue="Summer collection" />
          <Checkbox label="Accept contributions" defaultChecked />
        </Stack>
      </Dialog>
    </PageContainer>
  );
};
const meta = {
  title: "Examples/Component gallery",
  component: Gallery,
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof Gallery>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
