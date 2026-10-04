import { useState } from "react";
import type { ReactElement } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EntityPicker } from "./entity-picker.js";
import type { EntityPickerOption } from "./entity-picker.js";

const options: EntityPickerOption[] = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta", disabled: true },
  { value: "c", label: "Charlie" },
  { value: "d", label: "Delta" },
];
const Example = ({
  onQueryChange,
}: {
  onQueryChange: (query: string) => void;
}): ReactElement => {
  const [selected, setSelected] = useState<EntityPickerOption[]>([]);
  const [query, setQuery] = useState("");
  return (
    <form aria-label="Relationships">
      <EntityPicker
        label="Related items"
        name="item"
        selected={selected}
        onSelectedChange={setSelected}
        query={query}
        onQueryChange={(next) => {
          setQuery(next);
          onQueryChange(next);
        }}
        options={options.filter((option) =>
          option.label.toLowerCase().includes(query.toLowerCase()),
        )}
        maxSelected={2}
      />
    </form>
  );
};
describe("EntityPicker", () => {
  it.each([
    { isComposing: true, keyCode: 13 },
    { isComposing: false, keyCode: 229 },
  ])(
    "does not navigate, select, remove, or dismiss during composition",
    async (composition) => {
      const user = userEvent.setup();
      const onSelectedChange = vi.fn();
      render(
        <EntityPicker
          label="Related"
          selected={[{ value: "a", label: "Alpha" }]}
          options={options}
          onSelectedChange={onSelectedChange}
        />,
      );
      const input = screen.getByRole("combobox");
      await user.click(input);
      for (const key of ["ArrowDown", "Enter", "Backspace", "Escape"]) {
        expect(fireEvent.keyDown(input, { key, ...composition })).toBe(true);
      }
      expect(onSelectedChange).not.toHaveBeenCalled();
      expect(input).toHaveAttribute("aria-expanded", "true");
    },
  );

  it("returns keyboard focus to the input after removing a selected chip", async () => {
    const user = userEvent.setup();
    render(<Example onQueryChange={vi.fn()} />);
    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.keyboard("{Enter}");
    await user.tab();
    expect(screen.getByRole("button", { name: "Remove Alpha" })).toHaveFocus();
    await user.keyboard(" ");
    expect(
      screen.queryByRole("button", { name: "Remove Alpha" }),
    ).not.toBeInTheDocument();
    expect(input).toHaveFocus();
  });

  it("closes results and rejects mutations when a parent fieldset becomes disabled", async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    const field = (disabled: boolean): ReactElement => (
      <fieldset disabled={disabled}>
        <EntityPicker
          label="Related"
          selected={[]}
          options={options}
          onSelectedChange={onSelectedChange}
        />
      </fieldset>
    );
    const { rerender } = render(field(false));
    const input = screen.getByRole("combobox");
    await user.click(input);
    const option = screen.getByRole("option", { name: "Alpha" });
    rerender(field(true));
    fireEvent.click(option);
    expect(onSelectedChange).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument(),
    );
    expect(input).toHaveAttribute("aria-expanded", "false");
    rerender(field(false));
    await user.click(input);
    await user.click(screen.getByRole("option", { name: "Alpha" }));
    expect(onSelectedChange).toHaveBeenCalledWith([
      { value: "a", label: "Alpha" },
    ]);
  });

  it("preserves native first-legend exceptions to disabled fieldsets", async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(
      <fieldset disabled>
        <legend>
          <EntityPicker
            label="Enabled legend"
            selected={[]}
            options={options}
            onSelectedChange={onSelectedChange}
          />
        </legend>
      </fieldset>,
    );
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Alpha" }));
    expect(onSelectedChange).toHaveBeenCalledWith([
      { value: "a", label: "Alpha" },
    ]);
  });

  it("filters local options by prefix in the inline chip layout", async () => {
    const user = userEvent.setup();
    const catalog: EntityPickerOption[] = [
      { value: "read", label: "read" },
      { value: "ready", label: "ready" },
      { value: "grep", label: "grep" },
    ];
    const InlineExample = (): ReactElement => {
      const [selected, setSelected] = useState<EntityPickerOption[]>([]);
      return (
        <EntityPicker
          label="Allowed tools"
          selected={selected}
          options={catalog}
          onSelectedChange={setSelected}
          layout="inline"
          filterMode="prefix"
        />
      );
    };
    render(<InlineExample />);
    const input = screen.getByRole("combobox", { name: "Allowed tools" });
    await user.type(input, "rea");
    expect(screen.getByRole("option", { name: "read" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "ready" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "grep" })).toBeNull();
    await user.click(screen.getByRole("option", { name: "read" }));
    expect(input).toHaveValue("");
    const remove = screen.getByRole("button", { name: "Remove read" });
    expect(input.parentElement).toContainElement(remove);
    expect(screen.queryByRole("option", { name: "read" })).toBeNull();
    await user.click(remove);
    expect(screen.queryByRole("button", { name: "Remove read" })).toBeNull();
    await user.click(input);
    expect(screen.getByRole("option", { name: "read" })).toBeInTheDocument();
  });
  it("queries, selects multiple results, and removes a selected value", async () => {
    const user = userEvent.setup();
    const onQueryChange = vi.fn();
    render(<Example onQueryChange={onQueryChange} />);
    const input = screen.getByRole("combobox", { name: "Related items" });
    await user.click(input);
    expect(
      screen.getByRole("listbox", { name: "Related items" }),
    ).toHaveAttribute("aria-multiselectable", "true");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(
      screen.getByRole("button", { name: "Remove Charlie" }),
    ).toBeInTheDocument();
    await user.type(input, "alp");
    expect(onQueryChange).toHaveBeenCalled();
    await user.keyboard("{Enter}");
    expect(
      screen.getByRole("form", { name: "Relationships" }),
    ).toHaveFormValues({ item: ["c", "a"] });
    await user.clear(input);
    expect(screen.getByRole("option", { name: "Delta" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await user.click(screen.getByRole("button", { name: "Remove Charlie" }));
    expect(
      screen.getByRole("form", { name: "Relationships" }),
    ).toHaveFormValues({ item: "a" });
  });
  it("omits selected values from form submission when disabled", () => {
    render(
      <form aria-label="Relationships">
        <EntityPicker
          label="Related items"
          name="item"
          selected={[{ value: "a", label: "Alpha" }]}
          options={options}
          onSelectedChange={vi.fn()}
          disabled
        />
      </form>,
    );
    const form = screen.getByRole("form", { name: "Relationships" });
    expect(new FormData(form as HTMLFormElement).getAll("item")).toEqual([]);
  });
  it("keeps keyboard-active results in view and uses the unthemed light palette", async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.spyOn(HTMLElement.prototype, "scrollIntoView");
    try {
      render(
        <EntityPicker
          label="Related items"
          selected={[]}
          options={Array.from({ length: 20 }, (_, index) => ({
            value: String(index),
            label: `Item ${String(index)}`,
          }))}
          onSelectedChange={vi.fn()}
        />,
      );
      const input = screen.getByRole("combobox", { name: "Related items" });
      await user.click(input);
      expect(screen.getByRole("listbox").parentElement).toHaveAttribute(
        "data-theme",
        "light",
      );
      await user.keyboard("{ArrowDown}".repeat(15));
      const active = screen.getByRole("option", { name: "Item 15" });
      expect(active).toHaveAttribute("data-active", "true");
      expect(scrollIntoView.mock.contexts.at(-1)).toBe(active);
    } finally {
      scrollIntoView.mockRestore();
    }
  });
});
