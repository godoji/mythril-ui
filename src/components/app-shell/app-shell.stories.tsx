import { useState } from "react";
import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppShell } from "./app-shell.js";
import type { AppShellProps } from "./app-shell.js";
import { Navigation, NavigationLink } from "../navigation/navigation.js";
import { Grid, PageContainer } from "../page-layout/page-layout.js";
import { Button } from "../button/button.js";
import { Inline } from "../inline/inline.js";
import { Stack } from "../stack/stack.js";
const Example = (props: AppShellProps): ReactElement => {
  const [long, setLong] = useState(false);
  const [scroll, setScroll] = useState(props.scroll ?? "document");
  return (
    <AppShell {...props} scroll={scroll}>
      <PageContainer>
        <Stack>
          <Inline>
            <Button
              onClick={() => {
                setLong(!long);
              }}
            >
              {long ? "Short content" : "Long content"}
            </Button>
            <Button
              onClick={() => {
                setScroll(scroll === "document" ? "panes" : "document");
              }}
            >
              {scroll === "document"
                ? "Use pane scroll"
                : "Use document scroll"}
            </Button>
          </Inline>
          <h1>Catalog</h1>
          {Array.from({ length: long ? 35 : 1 }, (_, index) => (
            <div
              key={index}
              style={{
                paddingBlock: "1rem",
                borderBottom: "1px solid var(--mythril-divider)",
              }}
            >
              Item {index + 1}
            </div>
          ))}
        </Stack>
      </PageContainer>
    </AppShell>
  );
};
const meta = {
  title: "Components/AppShell",
  component: AppShell,
  tags: ["autodocs"],
} satisfies Meta<typeof AppShell>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  args: {
    header: <strong>Workspace</strong>,
    navigation: (
      <Navigation label="Workspace">
        <NavigationLink href="#content" label="Overview" current />
        <NavigationLink href="#products" label="Products" />
      </Navigation>
    ),
    mobileNavigation: (close) => (
      <Navigation label="Workspace">
        <NavigationLink
          href="#content"
          label="Overview"
          onClick={close}
          current
        />
        <NavigationLink href="#products" label="Products" onClick={close} />
      </Navigation>
    ),
    children: <PageContainer>Short content</PageContainer>,
  },
  render: (args) => (
    <Grid minColumnWidth="22rem">
      {(
        [
          { label: "Content height", height: "content", scroll: "document" },
          { label: "Parent height", height: "parent", scroll: "document" },
          { label: "Parent with panes", height: "parent", scroll: "panes" },
        ] as const
      ).map(({ label, height, scroll }) => (
        <Stack key={label}>
          <strong>{label}</strong>
          <div
            style={{
              height: "18rem",
              border: "1px solid var(--mythril-border)",
              overflow: "auto",
            }}
          >
            <AppShell {...args} height={height} scroll={scroll} />
          </div>
        </Stack>
      ))}
    </Grid>
  ),
};
export const Viewport: Story = {
  args: { ...Overview.args, height: "viewport" },
  parameters: { themePadding: 0 },
  render: (args) => <Example {...args} />,
};
