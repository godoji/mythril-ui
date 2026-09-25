import { useState } from "react";
import type { ReactElement } from "react";
import { render, screen } from "@testing-library/react";
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
