import { useState } from "react";
import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusBadge } from "../status-badge/status-badge.js";
import {
  DataTable,
  DataTableCell,
  DataTableHeadCell,
  DataTableStateRow,
} from "./data-table.js";

const Example = (): ReactElement => {
  const [descending, setDescending] = useState(true);
  const rows = [
    { id: 128, name: "New order", customer: "Alex", status: "Paid" },
    { id: 127, name: "Gift card", customer: "Morgan", status: "Pending" },
  ];
  return (
    <div style={{ display: "grid", gap: "1.5rem", maxWidth: "48rem" }}>
      <DataTable
        caption="Orders"
        minWidth="36rem"
        stickyHeader
        maxHeight="14rem"
      >
        <thead>
          <tr>
            <DataTableHeadCell
              sortDirection={descending ? "descending" : "ascending"}
              onSort={() => {
                setDescending(!descending);
              }}
            >
              Order
            </DataTableHeadCell>
            <DataTableHeadCell>Item</DataTableHeadCell>
            <DataTableHeadCell hideBelow="small">Customer</DataTableHeadCell>
            <DataTableHeadCell align="end">Status</DataTableHeadCell>
          </tr>
        </thead>
        <tbody>
          <tr>
            <DataTableCell colSpan={4}>Today</DataTableCell>
          </tr>
          {(descending ? rows : [...rows].reverse()).map((row) => (
            <tr key={row.id}>
              <DataTableCell>
                <a href={`#order-${String(row.id)}`}>#{row.id}</a>
              </DataTableCell>
              <DataTableCell>{row.name}</DataTableCell>
              <DataTableCell hideBelow="small">{row.customer}</DataTableCell>
              <DataTableCell align="end">
                <StatusBadge
                  tone={row.status === "Paid" ? "success" : "warning"}
                >
                  {row.status}
                </StatusBadge>
              </DataTableCell>
            </tr>
          ))}
        </tbody>
      </DataTable>
      <DataTable caption="Empty orders">
        <thead>
          <tr>
            <DataTableHeadCell>Order</DataTableHeadCell>
            <DataTableHeadCell>Status</DataTableHeadCell>
          </tr>
        </thead>
        <tbody>
          <DataTableStateRow colSpan={2}>No orders found.</DataTableStateRow>
        </tbody>
      </DataTable>
    </div>
  );
};
const meta = {
  title: "Components/DataTable",
  component: DataTable,
  tags: ["autodocs"],
  render: Example,
} satisfies Meta<typeof DataTable>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = { args: { caption: "Orders" } };
