import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stat, ChartFrame } from "./stat.js";
import { Grid } from "../page-layout/page-layout.js";
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
    <Grid minColumnWidth="15rem">
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
      <Stat
        label="Failed payments"
        value="3"
        detail="Review payment activity"
        tone="danger"
      />
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
    </Grid>
  ),
};
