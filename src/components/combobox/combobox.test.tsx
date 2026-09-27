import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Combobox } from "./combobox.js";

describe("Combobox", () => {
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
