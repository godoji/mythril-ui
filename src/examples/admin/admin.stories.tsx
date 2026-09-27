import { useState } from "react";
import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart3, FileText, Package } from "lucide-react";
import {
  AppShell,
  Navigation,
  NavigationAction,
  PageContainer,
  StatusBadge,
} from "../../index.js";
import { Catalog as CatalogView } from "./catalog.js";
import { ContentStudio as ContentView } from "./content.js";
import { Analytics as AnalyticsView } from "./analytics.js";
import styles from "./admin.module.css";

type View = "catalog" | "content" | "analytics";
const AdminWorkspace = ({
  initialView = "catalog",
  startInEditor = false,
  navigationVariant = "sidebar",
}: {
  initialView?: View;
  startInEditor?: boolean;
  navigationVariant?: "sidebar" | "rail";
}): ReactElement => {
  const [view, setView] = useState(initialView);
  const navigation = (
    variant: "sidebar" | "rail",
    close?: () => void,
  ): ReactElement => (
    <Navigation label="Workspace" variant={variant}>
      {(
        [
          { id: "catalog", label: "Products", icon: Package },
          { id: "content", label: "Content", icon: FileText },
          { id: "analytics", label: "Analytics", icon: BarChart3 },
        ] as const
      ).map((item) => (
        <NavigationAction
          key={item.id}
          label={item.label}
          icon={item.icon}
          current={view === item.id}
          onClick={() => {
            setView(item.id);
            close?.();
          }}
        />
      ))}
    </Navigation>
  );
  return (
    <AppShell
      className={styles.frame}
      header={
        <div className={styles.header}>
          <strong>Merchant workspace</strong>
          <StatusBadge>Interactive example</StatusBadge>
        </div>
      }
      navigation={navigation(navigationVariant)}
      mobileNavigation={(close) => navigation("sidebar", close)}
    >
      <PageContainer width="wide">
        {view === "catalog" ? (
          <CatalogView startInEditor={startInEditor} />
        ) : view === "content" ? (
          <ContentView />
        ) : (
          <AnalyticsView />
        )}
      </PageContainer>
    </AppShell>
  );
};
const meta = {
  title: "Examples/Admin workspace",
  component: AdminWorkspace,
  parameters: {
    docs: {
      description: {
        component:
          "A complete local demo. Filter and edit products, preview an image, reorder localized content, switch analytics periods, and explore both navigation variants. No backend or account is required. State resets when a view unmounts.",
      },
    },
  },
  argTypes: {
    initialView: {
      control: "select",
      options: ["catalog", "content", "analytics"],
    },
    navigationVariant: { control: "radio", options: ["sidebar", "rail"] },
  },
} satisfies Meta<typeof AdminWorkspace>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Catalog: Story = { args: { initialView: "catalog" } };
export const ProductEditor: Story = {
  args: { initialView: "catalog", startInEditor: true },
};
export const ContentStudio: Story = { args: { initialView: "content" } };
export const Analytics: Story = { args: { initialView: "analytics" } };
export const IconRail: Story = { args: { navigationVariant: "rail" } };
