import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleCheck, CircleDot, Info } from "lucide-react";
import { ResizablePanels } from "./resizable-panels.js";
import { Navigation, NavigationLink } from "../navigation/navigation.js";
import { StatusBadge } from "../status-badge/status-badge.js";
import { IconButton } from "../icon-button/icon-button.js";

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

export const StorybookCompare: Story = {
  args: { primaryLabel: "Story navigation and issues" },
  render: () => (
    <ResizablePanels
      primaryLabel="Story navigation and issues"
      defaultSize={280}
      minSize={210}
      maxSize={440}
      minSecondarySize={250}
      style={{ height: "22rem", border: "1px solid var(--mythril-divider)" }}
      primary={
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: "var(--mythril-surface)",
          }}
        >
          <strong style={{ padding: "0.75rem" }}>Storybook Compare</strong>
          <Navigation
            label="Stories"
            style={{ width: "100%", flex: 1, overflow: "auto" }}
          >
            <NavigationLink
              href="#changed"
              label="Changed story"
              icon={CircleDot}
              current
              badge={
                <StatusBadge size="small" tone="warning">
                  2.4%
                </StatusBadge>
              }
            />
            <NavigationLink
              href="#unchanged"
              label="Unchanged story"
              icon={CircleCheck}
            />
          </Navigation>
          <div
            style={{
              padding: "0.75rem",
              borderTop: "1px solid var(--mythril-divider)",
            }}
          >
            <strong>Issues</strong>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "0.5rem",
              }}
            >
              <span style={{ flex: 1 }}>Visual differences</span>
              <StatusBadge size="small" tone="warning">
                2.4%
              </StatusBadge>
              <IconButton icon={Info} label="Issue details" size="small" />
            </div>
          </div>
        </div>
      }
      secondary={
        <div style={{ height: "100%", padding: "1rem" }}>
          <strong>Changed story</strong>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "0.5rem",
              height: "80%",
              marginTop: "0.75rem",
            }}
          >
            {(["Baseline", "Candidate"] as const).map((label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                  border: "1px solid var(--mythril-divider)",
                }}
              >
                <span style={{ padding: "0.5rem" }}>{label}</span>
                <div style={{ flex: 1, background: "var(--mythril-input)" }} />
              </div>
            ))}
          </div>
        </div>
      }
    />
  ),
};
