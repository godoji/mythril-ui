import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  DataTable,
  DataTableCell,
  DataTableHeadCell,
  DataTableStateRow,
} from "./data-table.js";

describe("DataTable", () => {
  it("preserves native table semantics and exposes a sort action", async () => {
    const onSort = vi.fn();
    const user = userEvent.setup();
    render(
      <DataTable caption="Orders" stickyHeader>
        <thead>
          <tr>
            <DataTableHeadCell sortDirection="descending" onSort={onSort}>
              Order
            </DataTableHeadCell>
          </tr>
        </thead>
        <tbody>
          <tr>
            <DataTableCell>#128</DataTableCell>
          </tr>
        </tbody>
      </DataTable>,
    );
    expect(screen.getByRole("table", { name: "Orders" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Order" })).toHaveAttribute(
      "aria-sort",
      "descending",
    );
    await user.click(screen.getByRole("button", { name: "Order" }));
    expect(onSort).toHaveBeenCalledOnce();
  });
  it("uses a spanning row for empty content", () => {
    render(
      <DataTable caption="Results">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <DataTableStateRow colSpan={2}>No results</DataTableStateRow>
        </tbody>
      </DataTable>,
    );
    expect(screen.getByRole("cell", { name: "No results" })).toHaveAttribute(
      "colspan",
      "2",
    );
  });
});
