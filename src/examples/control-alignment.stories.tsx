import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus, Settings2 } from "lucide-react";
import {
  Button,
  Checkbox,
  IconButton,
  Select,
  Tabs,
  TextInput,
} from "../index.js";

const ControlAlignmentExample = (): ReactElement => (
  <div style={{ display: "grid", gap: "2rem", maxWidth: "48rem" }}>
    <section>
      <h2>32px single-line controls</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          gap: "0.75rem",
        }}
      >
        <div style={{ width: "12rem" }}>
          <TextInput label="Name" placeholder="Untitled" />
        </div>
        <div style={{ width: "12rem" }}>
          <Select label="Format" defaultValue="text">
            <option value="text">Plain text</option>
            <option value="json">JSON</option>
          </Select>
        </div>
        <Button icon={Plus}>Add item</Button>
        <IconButton icon={Settings2} label="Settings" />
        <Checkbox label="Include details" />
      </div>
    </section>
    <section>
      <h2>Tabs</h2>
      <Tabs
        label="Output views"
        items={[
          { value: "history", label: "History", content: "Recent activity" },
          { value: "output", label: "Full output", content: "Complete log" },
          { value: "details", label: "Details", content: "Run details" },
        ]}
      />
    </section>
    <section>
      <h2>Segmented tabs</h2>
      <Tabs
        label="Display mode"
        variant="segmented"
        items={[
          { value: "list", label: "List", content: "List view" },
          { value: "grid", label: "Grid", content: "Grid view" },
        ]}
      />
    </section>
  </div>
);

const meta = {
  title: "Examples/Control alignment",
  component: ControlAlignmentExample,
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof ControlAlignmentExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
