import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "./pagination.js";

describe("Pagination", () => {
  it("reports controlled page and size changes", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const onPageSizeChange = vi.fn();
    render(
      <Pagination
        label="Orders pages"
        page={2}
        totalPages={3}
        onPageChange={onPageChange}
        pageSize={25}
        pageSizeOptions={[10, 25]}
        onPageSizeChange={onPageSizeChange}
      />,
    );
    expect(
      screen.getByRole("navigation", { name: "Orders pages" }),
    ).toHaveTextContent("Page 2 of 3");
    await user.click(screen.getByRole("button", { name: "Previous" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(onPageChange).toHaveBeenNthCalledWith(1, 1);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 3);
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Results per page" }),
      "10",
    );
    expect(onPageSizeChange).toHaveBeenCalledWith(10);
  });
  it("supports unknown totals through load more", async () => {
    const user = userEvent.setup();
    const onLoadMore = vi.fn();
    render(
      <Pagination
        label="Order history"
        mode="load-more"
        hasNextPage
        onLoadMore={onLoadMore}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Show more" }));
    expect(onLoadMore).toHaveBeenCalledOnce();
  });
  it("shows a compact numbered window with direct page navigation", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const { rerender } = render(
      <Pagination
        label="Orders pages"
        page={5}
        totalPages={20}
        onPageChange={onPageChange}
      />,
    );
    expect(
      screen.getByText("5", { selector: '[aria-current="page"]' }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("…")).toHaveLength(2);
    await user.click(screen.getByRole("button", { name: "Go to page 20" }));
    expect(onPageChange).toHaveBeenCalledWith(20);
    rerender(
      <Pagination
        label="Orders pages"
        page={20}
        totalPages={20}
        onPageChange={onPageChange}
      />,
    );
    expect(
      screen.getByText("20", { selector: '[aria-current="page"]' }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });
  it("disables all page controls while loading", () => {
    render(
      <Pagination
        label="Orders pages"
        page={2}
        totalPages={3}
        onPageChange={vi.fn()}
        pageSize={25}
        pageSizeOptions={[10, 25]}
        onPageSizeChange={vi.fn()}
        loading
      />,
    );
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Go to page 3" })).toBeDisabled();
    expect(
      screen.getByRole("combobox", { name: "Results per page" }),
    ).toBeDisabled();
  });
});
