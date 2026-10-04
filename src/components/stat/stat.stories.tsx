import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Stat, ChartFrame } from "./stat.js";
import { Grid } from "../page-layout/page-layout.js";
import { Stack } from "../stack/stack.js";
const meta = {
  title: "Components/Stat",
  component: Stat,
  tags: ["autodocs"],
} satisfies Meta<typeof Stat>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  args: { label: "Revenue", value: "€12,480" },
  render: () => (
    <Stack gap="6">
      <Grid minColumnWidth="15rem" role="group" aria-label="Mixed detail stats">
        <Stat
          label="Revenue"
          value="€12,480"
          detail="12% above last month"
          tone="success"
        />
        <Stat
          label="Pending orders"
          value="24"
          detail="6 need attention"
          tone="warning"
        />
        <Stat label="Average order" value="€24.76" />
        <Stat label="Refunds" value="0" detail={0} />
      </Grid>
      <Grid
        minColumnWidth="10rem"
        style={{ maxWidth: "28rem" }}
        role="group"
        aria-label="Wrapped content stats"
      >
        <Stat
          label="Payments requiring manual review before settlement"
          value="3"
          detail="Review the payment activity and contact the customer before retrying."
          tone="danger"
        />
        <Stat label="Completed" value="120" />
      </Grid>
      <ChartFrame
        label="Orders by channel"
        summary={<p>Online: 80 orders. Retail: 40 orders.</p>}
      >
        <div aria-hidden="true" style={{ display: "grid", gap: ".5rem" }}>
          <div
            style={{
              width: "80%",
              height: "1rem",
              background: "var(--mythril-chart-1)",
            }}
          />
          <div
            style={{
              width: "40%",
              height: "1rem",
              background: "var(--mythril-chart-2)",
            }}
          />
        </div>
      </ChartFrame>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const name of ["Mixed detail stats", "Wrapped content stats"]) {
      const group = canvas.getByRole("group", { name });
      const rowHeights = new Map<number, number>();
      for (const card of group.children) {
        const { top, height } = card.getBoundingClientRect();
        await expect(height).toBeGreaterThan(0);
        await expect(height).toBe(rowHeights.get(top) ?? height);
        rowHeights.set(top, height);
      }
    }
    await expect(canvas.getByText("Refunds").closest("div")).toHaveTextContent(
      "Refunds00",
    );
  },
};
