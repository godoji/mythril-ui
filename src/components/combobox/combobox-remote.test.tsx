import { useState } from "react";
import type { ReactElement } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Combobox } from "./combobox.js";
import type { ComboboxOption } from "./combobox.js";

const Remote = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ComboboxOption>({
    value: "old",
    label: "Existing producer",
  });
  return (
    <Combobox
      label="Producer"
      value={selected.value}
      selectedOption={selected}
      onOptionSelect={setSelected}
      query={query}
      onQueryChange={setQuery}
      filterMode="provided"
      options={query ? [{ value: "new", label: "Server-ranked match" }] : []}
    />
  );
};
describe("Remote Combobox", () => {
  it("preserves off-page labels and replaces a selection using caller-filtered results", async () => {
    const user = userEvent.setup();
    render(<Remote />);
    const input = screen.getByRole("combobox");
    expect(input).toHaveValue("Existing producer");
    await user.type(input, "france");
    await user.click(
      screen.getByRole("option", { name: "Server-ranked match" }),
    );
    expect(input).toHaveValue("Server-ranked match");
    await user.click(input);
    await user.keyboard("{Escape}");
    expect(input).toHaveValue("Server-ranked match");
  });
  it("does not select stale results while loading", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Combobox
        label="Producer"
        loading
        options={[{ value: "old", label: "Stale" }]}
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole("combobox"));
    await user.keyboard("{Enter}");
    expect(screen.getByRole("status")).toHaveTextContent("Loading");
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
