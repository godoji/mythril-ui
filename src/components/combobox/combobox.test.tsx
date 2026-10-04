import type { ReactElement } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Combobox } from "./combobox.js";
import { Dialog } from "../dialog/dialog.js";
import { Drawer } from "../drawer/drawer.js";
import { EntityPicker } from "../entity-picker/entity-picker.js";

const choices = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
];

describe("Combobox", () => {
  it.each([Dialog, Drawer])(
    "dismisses each nested picker before its enclosing overlay",
    async (Overlay) => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(
        <Overlay open onOpenChange={onOpenChange} title="Editor">
          <Combobox label="Single" options={choices} />
          <EntityPicker
            label="Multiple"
            selected={[]}
            options={choices}
            onSelectedChange={vi.fn()}
          />
        </Overlay>,
      );
      for (const label of ["Single", "Multiple"]) {
        const input = screen.getByRole("combobox", { name: label });
        await user.click(input);
        await user.keyboard("{Escape}");
        expect(input).toHaveAttribute("aria-expanded", "false");
        expect(onOpenChange).not.toHaveBeenCalled();
      }
      await user.keyboard("{Escape}");
      expect(onOpenChange).toHaveBeenCalledWith(
        false,
        expect.anything(),
        "escape-key",
      );
    },
  );

  it.each([
    { isComposing: true, keyCode: 13 },
    { isComposing: false, keyCode: 229 },
  ])(
    "leaves composing keyboard events to the input method",
    async (composition) => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Combobox
          label="Task"
          options={choices}
          onValueChange={onValueChange}
        />,
      );
      const input = screen.getByRole("combobox");
      await user.click(input);
      for (const key of ["ArrowDown", "Enter", "Escape"]) {
        expect(fireEvent.keyDown(input, { key, ...composition })).toBe(true);
      }
      expect(onValueChange).not.toHaveBeenCalled();
      expect(input).toHaveAttribute("aria-expanded", "true");
      expect(input).toHaveAttribute(
        "aria-activedescendant",
        expect.stringContaining("option-0"),
      );
    },
  );

  it("closes results and rejects selections when an enclosing fieldset is disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const field = (disabled: boolean): ReactElement => (
      <fieldset disabled={disabled}>
        <Combobox
          label="Task"
          options={choices}
          onValueChange={onValueChange}
        />
      </fieldset>
    );
    const { rerender } = render(field(false));
    const input = screen.getByRole("combobox");
    await user.click(input);
    const option = screen.getByRole("option", { name: "Beta" });
    rerender(field(true));
    fireEvent.click(option);
    expect(onValueChange).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument(),
    );
    expect(input).toHaveAttribute("aria-expanded", "false");
    rerender(field(false));
    await user.click(input);
    await user.click(screen.getByRole("option", { name: "Beta" }));
    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("restores uncontrolled defaults on native form reset without a change callback", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <form aria-label="Task chooser">
        <Combobox
          label="Task"
          name="task"
          options={choices}
          defaultValue="a"
          onValueChange={onValueChange}
        />
        <button type="reset">Reset</button>
      </form>,
    );
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Beta" }));
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByRole("combobox")).toHaveValue("Alpha");
    expect(
      new FormData(screen.getByRole<HTMLFormElement>("form")).get("task"),
    ).toBe("a");
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
          <Combobox
            label="Task"
            options={choices}
            defaultValue="a"
            {...(mode === "controlled" && { value: "b" })}
            onValueChange={onValueChange}
          />
          <button type="reset">Reset</button>
        </form>,
      );
      if (mode === "cancelled") {
        await user.click(screen.getByRole("combobox"));
        await user.click(screen.getByRole("option", { name: "Beta" }));
        onValueChange.mockClear();
      }
      await user.click(screen.getByRole("button", { name: "Reset" }));
      expect(screen.getByRole("combobox")).toHaveValue("Beta");
      expect(onValueChange).not.toHaveBeenCalled();
    },
  );

  it("filters, skips disabled options, selects by keyboard, and submits the value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <form aria-label="Task chooser">
        <Combobox
          label="Task"
          name="task"
          options={[
            { value: "a", label: "Alpha" },
            { value: "b", label: "Beta", disabled: true },
            { value: "c", label: "Charlie" },
          ]}
          onValueChange={onValueChange}
        />
      </form>,
    );
    const input = screen.getByRole("combobox", { name: "Task" });
    await user.click(input);
    expect(input).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{ArrowDown}");
    expect(input).toHaveAttribute(
      "aria-activedescendant",
      expect.stringContaining("option-2"),
    );
    await user.keyboard("{Enter}");
    expect(input).toHaveValue("Charlie");
    expect(onValueChange).toHaveBeenCalledWith("c");
    expect(screen.getByRole("form", { name: "Task chooser" })).toHaveFormValues(
      { task: "c" },
    );
    await user.click(input);
    await user.type(input, "alp");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument(),
    );
    expect(input).toHaveValue("Charlie");
  });

  it("selects a pointer target without losing input focus", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Combobox
        label="File"
        options={[
          { value: "a", label: "Alpha" },
          { value: "b", label: "Beta" },
        ]}
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole("combobox", { name: "File" });
    await user.click(input);
    await user.click(screen.getByRole("option", { name: "Beta" }));
    expect(input).toHaveValue("Beta");
    expect(input).toHaveFocus();
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("omits a disabled selection from native form submission", () => {
    const options = [{ value: "a", label: "Alpha" }];
    const { rerender } = render(
      <form aria-label="Task chooser">
        <Combobox
          label="Task"
          name="task"
          options={options}
          defaultValue="a"
          disabled
        />
      </form>,
    );
    const form = screen.getByRole("form", { name: "Task chooser" });
    expect(new FormData(form as HTMLFormElement).getAll("task")).toEqual([]);
    rerender(
      <form aria-label="Task chooser">
        <Combobox label="Task" name="task" options={options} defaultValue="a" />
      </form>,
    );
    expect(new FormData(form as HTMLFormElement).getAll("task")).toEqual(["a"]);
  });

  it("keeps the keyboard-active option in view", async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.spyOn(HTMLElement.prototype, "scrollIntoView");
    try {
      render(
        <Combobox
          label="Task"
          options={Array.from({ length: 30 }, (_, index) => ({
            value: String(index),
            label: `Task ${String(index)}`,
          }))}
        />,
      );
      await user.click(screen.getByRole("combobox", { name: "Task" }));
      await user.keyboard("{End}");
      const active = screen.getByRole("option", { name: "Task 29" });
      expect(active).toHaveAttribute("data-active", "true");
      expect(scrollIntoView.mock.contexts.at(-1)).toBe(active);
    } finally {
      scrollIntoView.mockRestore();
    }
  });
});
