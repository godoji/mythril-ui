import { useState } from "react";
import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Home, Package, Settings } from "lucide-react";
import {
  Navigation,
  NavigationAction,
  NavigationLink,
  NavigationGroup,
} from "./navigation.js";
import { Inline } from "../inline/inline.js";
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
          </Navigation>
        ))}
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
