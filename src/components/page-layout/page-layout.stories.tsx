import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageContainer, Grid, LinkCard } from "./page-layout.js";
const meta = {
  title: "Components/Page layout",
  component: PageContainer,
  tags: ["autodocs"],
} satisfies Meta<typeof PageContainer>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  render: () => (
    <PageContainer>
      <h1>Workspace</h1>
      <Grid minColumnWidth="15rem">
        <LinkCard
          title="Catalog"
          description="Products, categories and availability"
          href="?path=/story/examples-admin-workspace--catalog"
          target="_top"
        />
        <LinkCard
          title="Content"
          description="Localized pages and reusable sections"
          href="?path=/story/examples-admin-workspace--content-studio"
          target="_top"
        />
        <LinkCard
          title="Analytics"
          description="Metrics and accessible chart summaries"
          href="?path=/story/examples-admin-workspace--analytics"
          target="_top"
        />
      </Grid>
    </PageContainer>
  ),
};
