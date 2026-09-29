import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Checkbox } from "./checkbox.js";

describe("Checkbox", () => {
  it("keeps native checkbox behavior with a decorative icon", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Include timestamps" name="timestamps" />);

    const checkbox = screen.getByRole("checkbox", {
      name: "Include timestamps",
    });
    expect(checkbox).not.toBeChecked();
    expect(checkbox.querySelector("svg")).toBeNull();

    await user.click(screen.getByText("Include timestamps"));
    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveAttribute("name", "timestamps");
  });

  it("sets the native indeterminate and disabled states", () => {
    render(<Checkbox label="Partial selection" indeterminate disabled />);
    const checkbox = screen.getByRole("checkbox", {
      name: "Partial selection",
    });
    expect(checkbox).toBePartiallyChecked();
    expect(checkbox).toBeDisabled();
  });
});
