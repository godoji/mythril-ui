import { useState } from "react";
import type { ReactElement } from "react";
import {
  Card,
  ChartFrame,
  DataTable,
  DataTableCell,
  DataTableHeadCell,
  DescriptionList,
  Grid,
  PageHeader,
  Select,
  Stack,
  Stat,
} from "../../index.js";
import styles from "./admin.module.css";
const weekly = [42, 67, 51, 84, 63, 105, 92];
export const Analytics = (): ReactElement => {
  const [period, setPeriod] = useState("week");
  const values = weekly.map((value) => (period === "week" ? value : value * 4));
  return (
    <Stack gap="4">
      <PageHeader
        title="Store overview"
        actions={
          <Select
            label="Period"
            labelHidden
            value={period}
            onChange={(event) => {
              setPeriod(event.currentTarget.value);
            }}
          >
            <option value="week">This week</option>
            <option value="month">This month</option>
          </Select>
        }
      />
      <Grid minColumnWidth="12rem">
        <Stat
          label="Revenue"
          value={period === "week" ? "€12,480" : "€49,920"}
          detail="12% above previous period"
          tone="success"
        />
        <Stat
          label="Orders"
          value={values.reduce((sum, value) => sum + value, 0)}
          detail="Across all channels"
        />
        <Stat label="Average order" value="€24.76" />
        <Stat
          label="Needs attention"
          value="3"
          detail="Payments to review"
          tone="warning"
        />
      </Grid>
      <ChartFrame
        label="Orders"
        description={
          period === "week"
            ? "Daily orders this week"
            : "Orders grouped by weekday this month"
        }
        summary={
          <DataTable caption="Orders by day">
            <thead>
              <tr>
                <DataTableHeadCell>Day</DataTableHeadCell>
                <DataTableHeadCell>Orders</DataTableHeadCell>
              </tr>
            </thead>
            <tbody>
              {values.map((value, index) => (
                <tr key={index}>
                  <DataTableCell>
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                  </DataTableCell>
                  <DataTableCell>{value}</DataTableCell>
                </tr>
              ))}
            </tbody>
          </DataTable>
        }
      >
        <div className={styles.bars} aria-hidden="true">
          {values.map((value, index) => (
            <div key={index} className={styles.barColumn}>
              <span
                style={{
                  height: `${String((value / Math.max(...values)) * 100)}%`,
                }}
              />
              <small>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
              </small>
            </div>
          ))}
        </div>
      </ChartFrame>
      <Grid>
        <Card title="Channels">
          <DescriptionList
            items={[
              { label: "Online store", value: "82%" },
              { label: "Retail", value: "18%" },
            ]}
          />
        </Card>
        <Card title="Operations">
          <DescriptionList
            items={[
              { label: "Ready to ship", value: "24 orders" },
              { label: "Awaiting payment", value: "3 orders" },
            ]}
          />
        </Card>
      </Grid>
    </Stack>
  );
};
