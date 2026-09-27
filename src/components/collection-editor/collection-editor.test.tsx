import { useState } from "react";
import type { ReactElement } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CollectionEditor } from "./collection-editor.js";

const Example = (): ReactElement => {
  const [items, setItems] = useState(["Alpha", "Beta"]);
  return (
    <CollectionEditor
      label="Sections"
      items={items.map((id) => ({
        id,
        label: id,
        content: <input aria-label={`${id} title`} defaultValue={id} />,
      }))}
      onMove={(id, to) => {
        setItems((old) => {
          const next = old.filter((item) => item !== id);
          next.splice(to, 0, id);
          return next;
        });
      }}
      onRemove={(id) => {
        setItems((old) => old.filter((item) => item !== id));
      }}
      onAdd={() => {
        setItems((old) => [...old, "New"]);
      }}
    />
  );
};
describe("CollectionEditor", () => {
  it("preserves item state and focus when moving and removing items", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.type(
      screen.getByRole("textbox", { name: "Alpha title" }),
      " edited",
    );
    await user.click(screen.getByRole("button", { name: "Move Alpha down" }));
    expect(
      within(screen.getAllByRole("listitem")[1] as HTMLElement).getByRole(
        "textbox",
      ),
    ).toHaveValue("Alpha edited");
    expect(screen.getByRole("heading", { name: "Alpha" })).toHaveFocus();
    expect(screen.getByRole("status")).toHaveTextContent("Alpha, 2 of 2");
    await user.click(screen.getByRole("button", { name: "Remove Alpha" }));
    expect(screen.getByRole("heading", { name: "Beta" })).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Remove Beta" }));
    expect(screen.getByRole("button", { name: "Add item" })).toHaveFocus();
  });
});
