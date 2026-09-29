import { useState } from "react";
import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleCheck, CircleDot, Info } from "lucide-react";
import {
  IconButton,
  Navigation,
  NavigationLink,
  ResizablePanels,
  StatusBadge,
} from "../index.js";

const stories = [
  { id: "changed", label: "Changed story", difference: "2.4%" },
  { id: "unchanged", label: "Unchanged story" },
] as const;

const StorybookCompareExample = (): ReactElement => {
  const [selectedId, setSelectedId] =
    useState<(typeof stories)[number]["id"]>("changed");
  const selectedStory =
    stories.find((story) => story.id === selectedId) ?? stories[0];

  return (
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
            {stories.map((story) => (
              <NavigationLink
                key={story.id}
                href={`#${story.id}`}
                label={story.label}
                icon={story.id === "changed" ? CircleDot : CircleCheck}
                current={selectedId === story.id}
                onClick={(event) => {
                  event.preventDefault();
                  setSelectedId(story.id);
                }}
                badge={
                  "difference" in story ? (
                    <StatusBadge size="small" tone="warning">
                      {story.difference}
                    </StatusBadge>
                  ) : undefined
                }
              />
            ))}
          </Navigation>
          {selectedId === "changed" && (
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
          )}
        </div>
      }
      secondary={
        <div style={{ height: "100%", padding: "1rem" }}>
          <strong>{selectedStory.label}</strong>
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
  );
};

const meta = {
  title: "Examples/Storybook Compare",
  component: StorybookCompareExample,
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof StorybookCompareExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
