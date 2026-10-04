import type { ReactElement } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Listbox } from "./listbox.js";

describe("Listbox", () => {
  it("inherits a disabled fieldset for pointer, keyboard, and submission behavior", async () => {
    const onValueChange = vi.fn();
    const field = (disabled: boolean): ReactElement => (
      <form aria-label="Chooser">
        <fieldset disabled={disabled}>
          <Listbox
            label="Views"
            name="view"
            defaultValue="history"
            onValueChange={onValueChange}
            options={[
              { value: "history", label: "History" },
              { value: "output", label: "Output" },
            ]}
          />
        </fieldset>
      </form>
    );
    const { rerender } = render(field(false));
    rerender(field(true));
    const output = screen.getByRole("option", { name: "Output" });
    fireEvent.click(output);
    fireEvent.keyDown(output, { key: "Enter" });
    expect(onValueChange).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(screen.getByRole("listbox")).toHaveAttribute(
        "aria-disabled",
        "true",
      ),
    );
    expect(
      Array.from(new FormData(screen.getByRole<HTMLFormElement>("form"))),
    ).toEqual([]);
    rerender(field(false));
    await waitFor(() =>
      expect(screen.getByRole("listbox")).not.toHaveAttribute("aria-disabled"),
    );
    fireEvent.click(output);
    expect(onValueChange).toHaveBeenCalledWith("output");
  });

  it("omits an explicitly disabled selection from form submission", () => {
    render(
      <form aria-label="Chooser">
        <Listbox
          label="Views"
          name="view"
          disabled
          defaultValue="history"
          options={[{ value: "history", label: "History" }]}
        />
      </form>,
    );
    expect(screen.getByRole("option")).toHaveAttribute("tabindex", "-1");
    expect(
      Array.from(new FormData(screen.getByRole<HTMLFormElement>("form"))),
    ).toEqual([]);
  });

  it("restores default selection and the tab stop after native form reset", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <form aria-label="Chooser">
        <Listbox
          label="Views"
          name="view"
          defaultValue="history"
          onValueChange={onValueChange}
          options={[
            { value: "history", label: "History" },
            { value: "output", label: "Output" },
          ]}
        />
        <button type="reset">Reset</button>
      </form>,
    );
    await user.click(screen.getByRole("option", { name: "Output" }));
    await user.click(screen.getByRole("button", { name: "Reset" }));
    const history = screen.getByRole("option", { name: "History" });
    expect(history).toHaveAttribute("aria-selected", "true");
    expect(history).toHaveAttribute("tabindex", "0");
    expect(
      new FormData(screen.getByRole<HTMLFormElement>("form")).get("view"),
    ).toBe("history");
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it.each(["controlled", "cancelled"])(
    "preserves a %s selection on form reset",
    async (mode) => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <form
          onReset={
            mode === "cancelled"
              ? (event) => {
                  event.preventDefault();
                }
              : undefined
          }
        >
          <Listbox
            label="Views"
            defaultValue="history"
            {...(mode === "controlled" && { value: "output" })}
            onValueChange={onValueChange}
            options={[
              { value: "history", label: "History" },
              { value: "output", label: "Output" },
            ]}
          />
          <button type="reset">Reset</button>
        </form>,
      );
      if (mode === "cancelled") {
        await user.click(screen.getByRole("option", { name: "Output" }));
        onValueChange.mockClear();
      }
      await user.click(screen.getByRole("button", { name: "Reset" }));
      expect(screen.getByRole("option", { name: "Output" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      expect(onValueChange).not.toHaveBeenCalled();
    },
  );

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
