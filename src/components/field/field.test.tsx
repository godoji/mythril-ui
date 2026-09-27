import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TextInput } from "../text-input/text-input.js";
import { Textarea } from "../textarea/textarea.js";
import { Select } from "../select/select.js";
import { Checkbox } from "../checkbox/checkbox.js";

describe("labeled form controls", () => {
  it("preserves names, values, refs, and native form behavior", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLTextAreaElement>();
    render(
      <form aria-label="Settings">
        <TextInput label="Name" name="name" />
        <Textarea label="Notes" name="notes" ref={ref} />
        <Select label="Format" name="format">
          <option value="text">Text</option>
          <option value="json">JSON</option>
        </Select>
        <Checkbox label="Timestamps" name="timestamps" />
      </form>,
    );
    await user.type(screen.getByLabelText("Name"), "Anvil");
    await user.type(screen.getByLabelText("Notes"), "Review output");
    await user.selectOptions(screen.getByLabelText("Format"), "json");
    await user.click(screen.getByLabelText("Timestamps"));
    expect(ref.current).toBe(screen.getByLabelText("Notes"));
    expect(screen.getByRole("form")).toHaveFormValues({
      name: "Anvil",
      notes: "Review output",
      format: "json",
      timestamps: true,
    });
  });

  it("shows focus styling only after keyboard navigation", async () => {
    const user = userEvent.setup();
    render(
      <>
        <TextInput label="Name" />
        <button type="button">Next</button>
      </>,
    );
    const input = screen.getByRole("textbox", { name: "Name" });
    const field = input.closest("[data-focus-ring]");
    expect(field).toHaveAttribute("data-focus-ring", "true");

    await user.click(input);
    expect(input).toHaveFocus();
    expect(field).toHaveAttribute("data-focus-ring", "false");

    await user.tab();
    await user.tab({ shift: true });
    expect(input).toHaveFocus();
    expect(field).toHaveAttribute("data-focus-ring", "true");
  });

  it("associates hints, errors, and external descriptions on every field", () => {
    render(
      <>
        <p id="external">External guidance.</p>
        <Textarea
          label="Notes"
          description="Keep it brief."
          error="Required."
          aria-describedby="external"
        />
        <Select label="Format" error="Choose a format.">
          <option>Text</option>
        </Select>
        <Checkbox
          label="Confirm"
          description="Review first."
          error="Confirmation required."
        />
      </>,
    );
    expect(screen.getByLabelText("Notes")).toHaveAccessibleDescription(
      "External guidance. Keep it brief. Required.",
    );
    expect(screen.getByLabelText("Format")).toBeInvalid();
    expect(screen.getByLabelText("Confirm")).toHaveAccessibleDescription(
      "Review first. Confirmation required.",
    );
  });

  it("supports mixed checkboxes and native disabled behavior", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <Checkbox label="All items" indeterminate onChange={onChange} />,
    );
    expect(screen.getByRole("checkbox")).toBePartiallyChecked();
    await user.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledOnce();
    rerender(<Checkbox label="All items" disabled onChange={onChange} />);
    expect(screen.getByRole("checkbox")).not.toBePartiallyChecked();
    await user.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledOnce();
  });
});
