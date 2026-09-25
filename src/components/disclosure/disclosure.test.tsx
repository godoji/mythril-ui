import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Accordion } from "../accordion/accordion.js";
import { Disclosure } from "./disclosure.js";

describe("disclosures", () => {
  it("supports keyboard activation and keeps collapsed content mounted", async () => {
    const user = userEvent.setup();
    render(
      <Disclosure title="Output">
        <p>Command result</p>
      </Disclosure>,
    );
    const trigger = screen.getByRole("button", { name: "Output" });
    expect(screen.getByText("Command result")).not.toBeVisible();
    await user.tab();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Command result")).toBeVisible();
    await user.keyboard(" ");
    expect(screen.getByText("Command result")).not.toBeVisible();
  });
  it("keeps controlled state with the caller", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Disclosure title="Output" open={false} onOpenChange={onOpenChange}>
        Result
      </Disclosure>,
    );
    await user.click(screen.getByRole("button"));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
  it("supports exclusive and multiple accordion sections", async () => {
    const user = userEvent.setup();
    const items = [
      { value: "one", title: "First", content: "First content" },
      { value: "two", title: "Second", content: "Second content" },
    ];
    const { rerender } = render(<Accordion label="Details" items={items} />);
    await user.click(screen.getByRole("button", { name: "First" }));
    await user.click(screen.getByRole("button", { name: "Second" }));
    expect(screen.getByText("First content")).not.toBeVisible();
    expect(screen.getByText("Second content")).toBeVisible();
    rerender(<Accordion label="Details" items={items} multiple />);
    await user.click(screen.getByRole("button", { name: "First" }));
    expect(screen.getByText("First content")).toBeVisible();
    expect(screen.getByText("Second content")).toBeVisible();
  });
});
