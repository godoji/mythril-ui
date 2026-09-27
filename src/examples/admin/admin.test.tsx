import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Catalog } from "./catalog.js";
import { ContentStudio } from "./content.js";
import { Analytics } from "./analytics.js";

describe("Admin examples", () => {
  it("filters the catalog and saves product edits back to the list", async () => {
    const user = userEvent.setup();
    render(<Catalog />);
    await user.type(
      screen.getByRole("searchbox", { name: "Search" }),
      "coastal",
    );
    expect(screen.getAllByRole("row")).toHaveLength(2);
    await user.click(
      screen.getByRole("button", { name: "Edit Coastal white" }),
    );
    const name = screen.getByRole("textbox", { name: "Name (English)" });
    await user.clear(name);
    await user.type(name, "Coastal white reserve");
    await user.click(screen.getByRole("button", { name: "Save product" }));
    expect(
      screen.getByRole("cell", { name: "Coastal white reserve" }),
    ).toBeInTheDocument();
  });
  it("adds, edits and removes content sections", async () => {
    const user = userEvent.setup();
    render(<ContentStudio />);
    await user.click(screen.getByRole("button", { name: "Add section" }));
    const sections = screen.getAllByRole("listitem");
    const added = sections.at(-1);
    if (!added) throw new Error("Missing section");
    const input = within(added).getByRole("textbox", {
      name: "Title (English)",
    });
    await user.clear(input);
    await user.type(input, "New arrivals");
    expect(
      within(added).getByRole("heading", { name: "New arrivals" }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Remove New arrivals" }),
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
  it("updates metrics and exposes chart data when the period changes", async () => {
    const user = userEvent.setup();
    render(<Analytics />);
    expect(screen.getByText("€12,480")).toBeInTheDocument();
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Period" }),
      "month",
    );
    expect(screen.getByText("€49,920")).toBeInTheDocument();
    await user.click(screen.getByText("View chart data"));
    expect(screen.getByRole("table", { name: "Orders by day" })).toBeVisible();
  });
});
