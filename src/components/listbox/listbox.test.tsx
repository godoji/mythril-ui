import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Listbox } from "./listbox.js";

describe("Listbox", () => {
  it("moves focus separately from selection and skips disabled options", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Listbox
        label="Views"
        options={[
          { value: "history", label: "History" },
          { value: "disabled", label: "Disabled", disabled: true },
          { value: "output", label: "Output" },
        ]}
        onValueChange={onValueChange}
      />,
    );
    const history = screen.getByRole("option", { name: "History" });
    history.focus();
    await user.keyboard("{ArrowDown}");
    const output = screen.getByRole("option", { name: "Output" });
    expect(output).toHaveFocus();
    expect(output).toHaveAttribute("aria-selected", "false");
    await user.keyboard("{Enter}");
    expect(output).toHaveAttribute("aria-selected", "true");
    expect(onValueChange).toHaveBeenCalledWith("output");
  });
});
