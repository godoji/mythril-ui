import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ContextMenu } from "./context-menu.js";

describe("ContextMenu", () => {
  it("opens at a right click and selects an action", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <ContextMenu
        label="File actions"
        items={[{ id: "copy", label: "Copy path", onSelect }]}
      >
        <button type="button">File row</button>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByText("File row"), {
      clientX: 80,
      clientY: 120,
    });
    const item = await screen.findByRole("menuitem", { name: "Copy path" });
    await waitFor(() => expect(item).toHaveFocus());
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens from the keyboard", async () => {
    const user = userEvent.setup();
    render(
      <ContextMenu
        label="Actions"
        items={[{ id: "copy", label: "Copy", onSelect: vi.fn() }]}
      >
        <button type="button">Item</button>
      </ContextMenu>,
    );
    screen.getByText("Item").focus();
    await user.keyboard("{Shift>}{F10}{/Shift}");
    expect(
      await screen.findByRole("menu", { name: "Actions" }),
    ).toBeInTheDocument();
  });
});
