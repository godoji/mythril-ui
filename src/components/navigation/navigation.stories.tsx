import { useState } from "react";
import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Home, MoreHorizontal, Package, Settings } from "lucide-react";
import {
  Navigation,
  NavigationAction,
  NavigationLink,
  NavigationGroup,
  NavigationRow,
} from "./navigation.js";
import { Inline } from "../inline/inline.js";
import { IconButton } from "../icon-button/icon-button.js";
import { StatusBadge } from "../status-badge/status-badge.js";
import { Stack } from "../stack/stack.js";
const Example = (): ReactElement => {
  const [page, setPage] = useState("Overview");
  return (
    <>
      <Inline align="start">
        {(["sidebar", "rail"] as const).map((variant) => (
          <Navigation
            key={variant}
            label={`${variant} navigation`}
            variant={variant}
          >
            <NavigationAction
              icon={Home}
              label="Overview"
              current={page === "Overview"}
              onClick={() => {
                setPage("Overview");
              }}
            />
            <NavigationGroup
              label="Catalog"
              icon={Package}
              defaultOpen={variant === "sidebar"}
            >
              <NavigationLink
                href="#products"
                label="Products"
                current={page === "Products"}
                onClick={() => {
                  setPage("Products");
                }}
              />
              <NavigationLink
                href="#categories"
                label="Categories"
                onClick={() => {
                  setPage("Categories");
                }}
              />
            </NavigationGroup>
            <NavigationAction
              icon={Settings}
              label="Settings"
              onClick={() => {
                setPage("Settings");
              }}
            />
            {variant === "sidebar" && (
              <NavigationLink
                href="#long"
                label="A long navigation entry that stays on one line"
                labelOverflow="marquee"
                size="small"
              />
            )}
          </Navigation>
        ))}
        <Stack style={{ flex: "1 1 18rem" }}>
          <strong>Full width</strong>
          <Navigation label="Full-width navigation" width="full">
            <NavigationLink
              href="#overview"
              label="Overview"
              icon={Home}
              current
            />
            <NavigationLink href="#products" label="Products" icon={Package} />
          </Navigation>
        </Stack>
      </Inline>
      <p role="status">Selected: {page}</p>
    </>
  );
};
const meta = {
  title: "Components/Navigation",
  component: Navigation,
  tags: ["autodocs"],
} satisfies Meta<typeof Navigation>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  args: { label: "Navigation" },
  render: () => <Example />,
  parameters: {
    docs: {
      description: {
        story:
          "Hover or focus the long sidebar label to read its clipped text.",
      },
    },
  },
};
export const OpenFlyout: Story = {
  args: { label: "Navigation" },
  render: () => (
    <Navigation label="Rail" variant="rail">
      <NavigationGroup label="Catalog" icon={Package} defaultOpen>
        <NavigationLink href="#products" label="Products" current />
        <NavigationLink href="#categories" label="Categories" />
      </NavigationGroup>
    </Navigation>
  ),
};
export const TrailingContent: Story = {
  args: { label: "Navigation" },
  render: () => (
    <Navigation label="Review stories">
      <NavigationLink
        href="#changed"
        label="Changed story with a percentage"
        icon={Package}
        badge={
          <StatusBadge size="small" tone="warning">
            2.4%
          </StatusBadge>
        }
      />
      <NavigationRow
        trailing={
          <IconButton
            icon={MoreHorizontal}
            label="More story actions"
            variant="ghost"
            size="small"
          />
        }
      >
        <NavigationLink
          href="#actions"
          label="Story with actions"
          icon={Settings}
        />
      </NavigationRow>
    </Navigation>
  ),
};
