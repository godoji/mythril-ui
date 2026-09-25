import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Tabs } from "./tabs.js";
const items = [
  { value: "first", label: "First", content: "First panel" },
  {
    value: "disabled",
    label: "Unavailable",
    content: "Disabled panel",
    disabled: true,
  },
  { value: "last", label: "Last", content: "Last panel" },
];
describe("Tabs", () => {
  it("navigates with arrows and Home/End, skipping disabled tabs", async () => {
    const user = userEvent.setup();
    render(<Tabs label="Details" items={items} />);
    await user.tab();
    expect(screen.getByRole("tab", { name: "First" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Last" })).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Last panel");
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "First" })).toHaveFocus();
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Last" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await user.keyboard("{Home}");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("First panel");
  });
  it("reports controlled selection without changing the caller's value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Tabs
        label="Details"
        items={items}
        value="first"
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole("tab", { name: "Last" }));
    expect(onValueChange).toHaveBeenCalledWith("last");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("First panel");
  });
});
