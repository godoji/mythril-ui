import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppShell } from "./app-shell.js";
import { Navigation, NavigationLink } from "../navigation/navigation.js";
import { PageContainer } from "../page-layout/page-layout.js";
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
      </Navigation>
    ),
    mobileNavigation: (close) => (
      <Navigation label="Workspace">
        <NavigationLink href="#content" label="Overview" onClick={close} />
      </Navigation>
    ),
    children: (
      <PageContainer>
        <h1 id="content">Workspace overview</h1>
        <p>Resize the preview to explore mobile navigation.</p>
      </PageContainer>
    ),
    aside: <p>Secondary information</p>,
  },
};
